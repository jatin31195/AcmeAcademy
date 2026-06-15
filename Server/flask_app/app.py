import re
import os
import json
import fitz
import gspread
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from google.oauth2.service_account import Credentials
from dotenv import load_dotenv

# ── Load .env BEFORE anything else ───────────────────────────────────────────
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"), override=True)

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024
CORS(app, resources={r"/*": {"origins": "*"}})

# ── Google Sheets Setup ───────────────────────────────────────────────────────

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]

SHEET_ID       = os.environ.get("GOOGLE_SHEET_ID", "").strip()
WORKSHEET_NAME = os.environ.get("GOOGLE_WORKSHEET_NAME", "Results").strip()


def get_sheet():
    raw = os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON", "").strip()

    if not raw:
        raise RuntimeError(
            "GOOGLE_SERVICE_ACCOUNT_JSON is empty or missing in your .env file."
        )
    if not SHEET_ID:
        raise RuntimeError(
            "GOOGLE_SHEET_ID is empty or missing in your .env file."
        )

    if raw.endswith(".json") and not raw.startswith("{"):
        json_path = os.path.join(os.path.dirname(__file__), raw)
        if not os.path.exists(json_path):
            raise RuntimeError(
                f"Service account file not found: {json_path}\n"
                f"Make sure '{raw}' is in the same folder as app.py."
            )
        with open(json_path, "r") as f:
            info = json.load(f)
    else:
        try:
            info = json.loads(raw)
        except json.JSONDecodeError as e:
            raise RuntimeError(
                f"GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON.\n"
                f"Error: {e}\n"
                f"First 100 chars read: {raw[:100]}"
            )

    creds  = Credentials.from_service_account_info(info, scopes=SCOPES)
    client = gspread.authorize(creds)

    try:
        spreadsheet = client.open_by_key(SHEET_ID)
    except gspread.exceptions.APIError as e:
        raise RuntimeError(
            f"Could not open the Google Sheet. API error: {e}\n"
            f"Fix checklist:\n"
            f"  1. Is GOOGLE_SHEET_ID correct? Current value: '{SHEET_ID}'\n"
            f"  2. Did you share the sheet with this email as Editor?\n"
            f"     → {info.get('client_email', 'not found in JSON')}"
        )

    try:
        return spreadsheet.worksheet(WORKSHEET_NAME)
    except gspread.exceptions.WorksheetNotFound:
        raise RuntimeError(
            f"Tab/worksheet named '{WORKSHEET_NAME}' not found.\n"
            f"Go to your Google Sheet and create a tab named exactly: {WORKSHEET_NAME}"
        )


def ensure_header(sheet):
    if not sheet.get_all_values():
        sheet.append_row(
            ["Test Date", "Name", "Phone", "Application No", "Roll No",
             "Candidate Name", "Score", "Correct", "Incorrect", "Unattempted"],
            value_input_option="RAW",
        )


def save_to_sheet(user_name, user_phone, app_no, roll_no, name, score, correct, incorrect, unattempted):
    sheet = get_sheet()
    ensure_header(sheet)
    sheet.append_row(
        [
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            user_name, user_phone,
            app_no, roll_no, name,
            score, correct, incorrect, unattempted,
        ],
        value_input_option="RAW",
    )


# ── Parsers ───────────────────────────────────────────────────────────────────

def extract_text(file_stream):
    with fitz.open(stream=file_stream.read(), filetype="pdf") as doc:
        return "\n".join(page.get_text() for page in doc)


def parse_answer_key(text):
    # flexible spacing (space, newline, tab)
    result = dict(re.findall(r"(\d{11})\s*(\d{12})", text))
    if result:
        return result

    # reverse format
    result = dict(re.findall(r"(\d{12})\s*(\d{11})", text))
    if result:
        return result

    # fallback (very flexible)
    return dict(re.findall(r"(\d{8,15})\s*(\d{8,15})", text))


def parse_response_sheet(text):
    lines = text.splitlines()
    blocks, block = [], []

    for line in lines:
        line = line.strip()
        if "Question ID" in line and block:
            blocks.append(block)
            block = []
        block.append(line)
    if block:
        blocks.append(block)

    response_map = {}
    for block in blocks:
        qid, chosen, options = None, None, [None] * 4
        for line in block:
            if "Question ID" in line:
                m = re.search(r"(\d{8,15})", line)
                qid = m.group(1) if m else None
            for idx in range(4):
                if f"Option {idx+1} ID" in line:
                    m = re.search(r"(\d{8,15})", line)
                    options[idx] = m.group(1) if m else None
            if "Chosen Option" in line:
                m = re.search(r"(\d+|Not Attempted)", line, re.IGNORECASE)
                chosen = m.group(1) if m else "Not Attempted"

        if qid:
            if not chosen or str(chosen).lower().startswith("not") or not str(chosen).isdigit():
                response_map[qid] = "Unattempted"
            else:
                idx = int(chosen) - 1
                response_map[qid] = options[idx] if 0 <= idx < 4 else "Unattempted"

    return response_map


def extract_candidate_details(text):
    details = {"app_no": "Unknown", "roll_no": "Unknown", "name": "Unknown"}

    m = re.search(r"Application\s*(?:No\.?|Number)\s*:?\s*([A-Z0-9]+)", text, re.IGNORECASE)
    if m:
        details["app_no"] = m.group(1).strip()

    m = re.search(r"Roll\s*(?:No\.?|Number)\s*:?\s*([A-Z0-9]+)", text, re.IGNORECASE)
    if m:
        details["roll_no"] = m.group(1).strip()

    m = re.search(r"Candidate'?s?\s*Name\s*:?\s*([A-Za-z\s]+?)(?=\n[A-Z]|\Z)", text, re.IGNORECASE)
    if m:
        details["name"] = m.group(1).strip()

    return details


# ── Routes ────────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    return jsonify({"status": "CUET Flask API running ✅"})


@app.route("/test-sheets", methods=["GET"])
def test_sheets():
    diagnostics = {
        "GOOGLE_SHEET_ID":              SHEET_ID or "❌ NOT SET",
        "GOOGLE_WORKSHEET_NAME":        WORKSHEET_NAME,
        "GOOGLE_SERVICE_ACCOUNT_JSON":  "❌ NOT SET",
    }

    raw = os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON", "").strip()

    if raw:
        diagnostics["GOOGLE_SERVICE_ACCOUNT_JSON"] = raw if raw.endswith(".json") else f"✅ SET ({len(raw)} chars)"
        try:
            if raw.endswith(".json") and not raw.startswith("{"):
                json_path = os.path.join(os.path.dirname(__file__), raw)
                diagnostics["resolved_path"] = json_path
                diagnostics["file_exists"]   = "✅ Yes" if os.path.exists(json_path) else "❌ File not found"
                if not os.path.exists(json_path):
                    return jsonify({"status": "FAILED", "diagnostics": diagnostics}), 500
                with open(json_path) as f:
                    info = json.load(f)
            else:
                info = json.loads(raw)
            diagnostics["service_account_email"] = info.get("client_email", "not found")
            diagnostics["project_id"]            = info.get("project_id", "not found")
            diagnostics["json_parse"]            = "✅ Valid JSON"
        except (json.JSONDecodeError, Exception) as e:
            diagnostics["json_parse"] = f"❌ Error: {e}"
            return jsonify({"status": "FAILED", "diagnostics": diagnostics}), 500

    else:
        return jsonify({
            "status": "FAILED",
            "diagnostics": diagnostics,
            "fix": (
                "GOOGLE_SERVICE_ACCOUNT_JSON is empty. "
                "Make sure your .env file is in the same folder as app.py "
                "and the variable is set correctly."
            )
        }), 500

    try:
        sheet = get_sheet()
        sheet.append_row(
            [datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
             "TEST", "TEST", "Test Entry", 0, 0, 0, 0],
            value_input_option="RAW",
        )
        diagnostics["sheet_write"] = "✅ Test row written successfully"
        return jsonify({"status": "SUCCESS ✅", "diagnostics": diagnostics})
    except Exception as e:
        diagnostics["sheet_write"] = f"❌ {str(e)}"
        return jsonify({"status": "FAILED", "diagnostics": diagnostics}), 500


@app.route("/check", methods=["POST"])
def check():

    # Debug: Log incoming request headers and form data
    app.logger.info("/check called")
    app.logger.info(f"Headers: {dict(request.headers)}")
    app.logger.info(f"Form: {request.form}")
    app.logger.info(f"Files: {list(request.files.keys())}")

    if "response_sheet" not in request.files or "answer_key" not in request.files:
        app.logger.warning("Missing required files: response_sheet or answer_key")
        return jsonify({"error": "Both PDF files are required."}), 400


    try:
        # Log file info
        resp_file = request.files["response_sheet"]
        ans_file = request.files["answer_key"]
        app.logger.info(f"response_sheet: filename={resp_file.filename}, content_type={resp_file.content_type}")
        app.logger.info(f"answer_key: filename={ans_file.filename}, content_type={ans_file.content_type}")

        response_text = extract_text(resp_file)
        answer_text   = extract_text(ans_file)

        answer_map   = parse_answer_key(answer_text)
        response_map = parse_response_sheet(response_text)

        if not answer_map:
            app.logger.warning("Could not parse Answer Key PDF.")
            app.logger.debug(f"Answer Key sample: {answer_text[:500]}")
            return jsonify({
                "error": "Could not parse Answer Key PDF.",
                "debug_answer_sample": answer_text[:500]
            }), 400

        if not response_map:
            app.logger.warning("Could not parse Response Sheet PDF.")
            app.logger.debug(f"Response Sheet sample: {response_text[:500]}")
            return jsonify({
                "error": "Could not parse Response Sheet PDF.",
                "debug_response_sample": response_text[:500]
            }), 400

        correct = incorrect = unattempted = 0
        results = []

        for qid, correct_code in answer_map.items():
            user_code = response_map.get(qid, "Unattempted")
            if user_code == "Unattempted":
                status = "Unattempted"
                unattempted += 1
            elif user_code == correct_code:
                status = "Correct"
                correct += 1
            else:
                status = "Incorrect"
                incorrect += 1
            results.append({"qid": qid, "yours": user_code, "correct": correct_code, "status": status})

        score      = correct * 4 - incorrect
        candidate  = extract_candidate_details(response_text)
        user_name  = request.form.get("user_name", "").strip()
        user_phone = request.form.get("user_phone", "").strip()

        sheet_error = None
        try:
            save_to_sheet(
                user_name, user_phone,
                candidate["app_no"], candidate["roll_no"], candidate["name"],
                score, correct, incorrect, unattempted,
            )
        except Exception as e:
            sheet_error = str(e)
            app.logger.warning(f"Google Sheets save failed: {e}")

        response = {
            "score": score, "correct": correct,
            "incorrect": incorrect, "unattempted": unattempted,
            "candidate": candidate, "results": results,
        }
        if sheet_error:
            response["sheet_warning"] = f"Score calculated OK but sheet save failed: {sheet_error}"

        app.logger.info(f"Score calculated: {score}, correct: {correct}, incorrect: {incorrect}, unattempted: {unattempted}")
        return jsonify(response)

    except Exception as e:
        app.logger.error(f"Exception in /check: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@app.route("/debug", methods=["POST"])
def debug():
    if "response_sheet" not in request.files or "answer_key" not in request.files:
        return jsonify({"error": "Both files required"}), 400
    try:
        response_text = extract_text(request.files["response_sheet"])
        answer_text   = extract_text(request.files["answer_key"])

        return jsonify({
            "candidate":  extract_candidate_details(response_text),
            "answer_key": {
                "total_questions_parsed": len(parse_answer_key(answer_text)),
                "sample_pairs":           list(parse_answer_key(answer_text).items())[:5],
                "raw_text_sample":        answer_text[:800],
            },
            "response_sheet": {
                "total_questions_parsed": len(parse_response_sheet(response_text)),
                "sample_pairs":           list(parse_response_sheet(response_text).items())[:5],
                "raw_text_sample":        response_text[:800],
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ══════════════════════════════════════════════════════════════════════════════
# NIMCET  ─────────────────────────────────────────────────────────────────────
# Self-contained block. Does NOT touch any CUET logic above. Ported from the
# Streamlit reference (add/app.py) into Flask routes with identical scoring,
# parsing, PDF-report and MongoDB-save behaviour.
# ══════════════════════════════════════════════════════════════════════════════

from flask import Response
from fpdf import FPDF

# Separate sheet for NIMCET. Override via .env if needed; defaults to the
# "Nimcet_2026" tab of the provided spreadsheet.
NIMCET_SHEET_ID       = os.environ.get(
    "NIMCET_SHEET_ID", "1qduXY2YGFs2j7GKzmmEpvF_CSavILZ6edIdtvU1WG_8"
).strip()
NIMCET_WORKSHEET_NAME = os.environ.get("NIMCET_WORKSHEET_NAME", "Nimcet_2026").strip()


# ---------- Candidate Details ----------

def nimcet_extract_candidate_info(text):
    app_no = None
    name = None
    app_match = re.search(r"Application Seq No\s*(\S+)", text)
    name_match = re.search(r"Candidate Name\s*([A-Za-z\s]+?)\s*TC Name", text)
    if app_match:
        app_no = app_match.group(1)
    if name_match:
        name = name_match.group(1).strip()
    return app_no, name


# ---------- Parse Questions from PDF ----------

def parse_nimcet_pdf(file_bytes):
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    all_markers = []
    lines_info = []

    for page_num, page in enumerate(doc):
        page_height = page.rect.height
        y_offset = page_num * page_height

        drawings = page.get_drawings()
        for d in drawings:
            rect = d["rect"]
            for c_key in ("color", "fill"):
                c = d.get(c_key)
                if isinstance(c, (list, tuple)) and len(c) >= 3:
                    r, g, b = c[:3]
                    if r > 1: r, g, b = r/255.0, g/255.0, b/255.0

                    if g > r + 0.1 and g > b + 0.1:
                        all_markers.append({"abs_y": y_offset + rect.y0, "type": "green"})
                    elif r > g + 0.1 and r > b + 0.1:
                        all_markers.append({"abs_y": y_offset + rect.y0, "type": "red"})

        dicts = page.get_text("dict")["blocks"]
        for block in dicts:
            if "lines" not in block: continue
            for line in block["lines"]:
                line_text = ""
                for span in line["spans"]:
                    text = span["text"].strip()
                    line_text += " " + text

                    color_int = span["color"]
                    rect = fitz.Rect(span["bbox"])
                    abs_y_span = y_offset + rect.y0

                    r = ((color_int >> 16) & 255) / 255.0
                    g = ((color_int >> 8) & 255) / 255.0
                    b = (color_int & 255) / 255.0

                    if "✔" in text:
                        all_markers.append({"abs_y": abs_y_span, "type": "green"})
                    elif "✘" in text:
                        all_markers.append({"abs_y": abs_y_span, "type": "red"})
                    elif (g > r + 0.1 and g > b + 0.1) and text:
                        all_markers.append({"abs_y": abs_y_span, "type": "green"})
                    elif (r > g + 0.1 and r > b + 0.1) and text:
                        all_markers.append({"abs_y": abs_y_span, "type": "red"})

                rect = fitz.Rect(line["bbox"])
                abs_y = y_offset + rect.y0
                lines_info.append({"text": line_text.strip(), "abs_y": abs_y})

    all_markers.sort(key=lambda x: x["abs_y"])
    merged_markers = []
    for m in all_markers:
        if not merged_markers:
            merged_markers.append(m)
        else:
            last = merged_markers[-1]
            if last["type"] == m["type"] and abs(last["abs_y"] - m["abs_y"]) < 10:
                pass
            else:
                merged_markers.append(m)

    questions_meta = []
    current_q = None

    for line in lines_info:
        text = line["text"]
        abs_y = line["abs_y"]

        match_qid = re.search(r"Question ID\s*:\s*(\d+)", text)
        if match_qid:
            current_q = {
                "qid": match_qid.group(1),
                "chosen": None,
                "correct": None,
                "abs_y": abs_y,
                "markers": []
            }
            questions_meta.append(current_q)

        if current_q and "Chosen Option" in text:
            match_cho = re.search(r"Chosen Option\s*:\s*(\d+|--)", text)
            if match_cho:
                current_q["chosen"] = match_cho.group(1)

    questions_meta.sort(key=lambda x: x["abs_y"])

    for m in merged_markers:
        for q in questions_meta:
            if q["abs_y"] > m["abs_y"] - 10:
                q["markers"].append(m)
                break

    for q in questions_meta:
        marks = sorted(q["markers"], key=lambda x: x["abs_y"])
        if len(marks) > 4:
            marks = marks[-4:]

        green_indices = [i + 1 for i, m in enumerate(marks) if m["type"] == "green"]
        if green_indices:
            q["correct"] = str(green_indices[0])

    return questions_meta


# ---------- Score Calculation ----------

def nimcet_calculate_score(data):
    stats = {
        "Math": {"correct": 0, "wrong": 0, "unattempted": 0, "score": 0},
        "LR": {"correct": 0, "wrong": 0, "unattempted": 0, "score": 0},
        "Computer": {"correct": 0, "wrong": 0, "unattempted": 0, "score": 0},
        "English": {"correct": 0, "wrong": 0, "unattempted": 0, "score": 0},
    }

    for i, q in enumerate(data):
        chosen = q["chosen"]
        correct = q["correct"]

        if i < 50:
            sec = "Math"
        elif i < 90:
            sec = "LR"
        elif i < 110:
            sec = "Computer"
        else:
            sec = "English"

        if chosen == "--" or chosen is None:
            stats[sec]["unattempted"] += 1
            continue

        if chosen == correct:
            stats[sec]["correct"] += 1
        else:
            stats[sec]["wrong"] += 1

    stats["Math"]["score"] = stats["Math"]["correct"] * 12 - stats["Math"]["wrong"] * 3
    stats["LR"]["score"] = stats["LR"]["correct"] * 6 - stats["LR"]["wrong"] * 1.5
    stats["Computer"]["score"] = stats["Computer"]["correct"] * 6 - stats["Computer"]["wrong"] * 1.5
    stats["English"]["score"] = stats["English"]["correct"] * 4 - stats["English"]["wrong"] * 1

    total = stats["Math"]["score"] + stats["LR"]["score"] + stats["Computer"]["score"] + stats["English"]["score"]

    return stats, total


# ---------- Per-question rows (section / status / marks) ----------

def nimcet_build_question_rows(questions):
    rows = []
    for i, q in enumerate(questions):
        status = "Unattempted"
        marks = 0
        chosen = q["chosen"]
        correct = q["correct"]

        if i < 50:
            pos_m, neg_m = 12, -3
            sec = "Math"
        elif i < 90:
            pos_m, neg_m = 6, -1.5
            sec = "LR"
        elif i < 110:
            pos_m, neg_m = 6, -1.5
            sec = "Computer"
        else:
            pos_m, neg_m = 4, -1
            sec = "English"

        if chosen and chosen != "--":
            if chosen == correct:
                status = "Correct"
                marks = pos_m
            else:
                status = "Incorrect"
                marks = neg_m

        rows.append({
            "q_no": i + 1,
            "qid": q.get("qid", "N/A"),
            "section": sec,
            "chosen": chosen if chosen else "--",
            "correct": correct if correct else "Unknown",
            "status": status,
            "marks": marks,
        })
    return rows


# ---------- PDF Generation ----------

LOGO_PATH = os.path.join(os.path.dirname(__file__), "logo.png")


def nimcet_generate_pdf_report(app_no, name, stats, total, questions):
    # ── ACME brand palette ────────────────────────────────────────────────────
    PURPLE = (124, 58, 237)
    PINK   = (236, 72, 153)
    INDIGO = (30, 27, 75)
    LIGHT  = (243, 240, 255)
    GREEN  = (5, 150, 105)
    RED    = (220, 38, 38)
    GRAY   = (107, 114, 128)
    WHITE  = (255, 255, 255)

    has_logo = os.path.exists(LOGO_PATH)

    class PDFReport(FPDF):
        def header(self):
            # full-width brand band + pink accent
            self.set_fill_color(*PURPLE)
            self.rect(0, 0, self.w, 32, style="F")
            self.set_fill_color(*PINK)
            self.rect(0, 32, self.w, 2, style="F")

            # logo on a white rounded chip, left side of the band
            if has_logo:
                self.set_fill_color(*WHITE)
                self.rect(10, 5, 22, 22, style="F", round_corners=True, corner_radius=3)
                try:
                    self.image(LOGO_PATH, x=11.5, y=6.5, w=19, h=19)
                except Exception:
                    pass

            self.set_y(7)
            self.set_text_color(*WHITE)
            self.set_font("helvetica", "B", 25)
            self.cell(0, 11, "ACME Academy", ln=1, align="C")
            self.set_font("helvetica", "I", 12)
            self.cell(0, 7, "NIMCET Performance Report", ln=1, align="C")

            # faint diagonal "ACME" watermark behind the page content
            self.set_font("helvetica", "B", 110)
            with self.local_context(fill_opacity=0.05):
                self.set_text_color(*PURPLE)
                with self.rotation(angle=32, x=self.w / 2, y=self.h / 2):
                    self.text(self.w / 2 - 95, self.h / 2 + 20, "ACME")

            self.set_y(42)
            self.set_text_color(0, 0, 0)

        def footer(self):
            self.set_y(-14)
            self.set_draw_color(*PURPLE)
            self.set_line_width(0.3)
            self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
            self.set_y(-11)
            self.set_font("helvetica", "I", 8)
            self.set_text_color(*GRAY)
            self.cell(self.epw / 2, 6,
                      "  acmeacademy.in  |  India's Most Trusted MCA Entrance Academy", align="L")
            self.cell(self.epw / 2, 6, f"Page {self.page_no()}  ", align="R")

    def section_title(pdf, txt):
        pdf.set_font("helvetica", "B", 12)
        pdf.set_fill_color(*INDIGO)
        pdf.set_text_color(*WHITE)
        pdf.cell(0, 9, f"  {txt}", ln=1, fill=True)
        pdf.set_text_color(0, 0, 0)
        pdf.ln(3)

    total_correct     = sum(s["correct"] for s in stats.values())
    total_wrong       = sum(s["wrong"] for s in stats.values())
    total_unattempted = sum(s["unattempted"] for s in stats.values())

    pdf = PDFReport()
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.add_page()

    # ── Candidate Details ─────────────────────────────────────────────────────
    section_title(pdf, "Candidate Details")
    pdf.set_fill_color(*LIGHT)
    pdf.set_font("helvetica", "", 12)
    pdf.cell(0, 9, f"   Name:  {name if name else 'N/A'}", ln=1, fill=True)
    pdf.cell(0, 9, f"   Application No:  {app_no if app_no else 'N/A'}", ln=1, fill=True)
    pdf.ln(6)

    # ── Total Score hero box ──────────────────────────────────────────────────
    hero_y = pdf.get_y()
    pdf.set_fill_color(*(RED if total < 0 else PURPLE))
    pdf.rect(pdf.l_margin, hero_y, pdf.epw, 28, style="F", round_corners=True, corner_radius=4)
    pdf.set_y(hero_y + 4)
    pdf.set_text_color(*WHITE)
    pdf.set_font("helvetica", "", 10)
    pdf.cell(0, 6, "TOTAL SCORE", ln=1, align="C")
    pdf.set_font("helvetica", "B", 26)
    pdf.cell(0, 13, f"{total}  /  1000", ln=1, align="C")
    pdf.set_text_color(0, 0, 0)
    pdf.set_y(hero_y + 28)
    pdf.ln(6)

    # ── Performance Summary (three mini stat boxes) ───────────────────────────
    section_title(pdf, "Performance Summary")
    gap = 6
    box_w = (pdf.epw - 2 * gap) / 3
    box_h = 20
    sum_y = pdf.get_y()
    summary = [
        ("CORRECT", total_correct, GREEN),
        ("WRONG", total_wrong, RED),
        ("UNATTEMPTED", total_unattempted, GRAY),
    ]
    for i, (label, val, col) in enumerate(summary):
        x = pdf.l_margin + i * (box_w + gap)
        pdf.set_fill_color(*LIGHT)
        pdf.rect(x, sum_y, box_w, box_h, style="F", round_corners=True, corner_radius=3)
        pdf.set_xy(x, sum_y + 3)
        pdf.set_text_color(*col)
        pdf.set_font("helvetica", "B", 18)
        pdf.cell(box_w, 9, str(val), align="C")
        pdf.set_xy(x, sum_y + 12)
        pdf.set_text_color(*GRAY)
        pdf.set_font("helvetica", "B", 8)
        pdf.cell(box_w, 5, label, align="C")
    pdf.set_y(sum_y + box_h)
    pdf.set_text_color(0, 0, 0)
    pdf.ln(8)

    # ── Section-wise Breakdown ────────────────────────────────────────────────
    section_title(pdf, "Section-wise Breakdown")
    headers = ["Section", "Correct", "Wrong", "Unattempted", "Score"]
    widths = [pdf.epw * 0.32, pdf.epw * 0.17, pdf.epw * 0.17, pdf.epw * 0.17, pdf.epw * 0.17]

    pdf.set_font("helvetica", "B", 10)
    pdf.set_fill_color(*PURPLE)
    pdf.set_text_color(*WHITE)
    for h, w in zip(headers, widths):
        pdf.cell(w, 9, h, align="C", fill=True)
    pdf.ln()
    pdf.set_text_color(0, 0, 0)

    sections = [
        ("Mathematics", "Math"),
        ("Logical Reasoning", "LR"),
        ("Computer Awareness", "Computer"),
        ("General English", "English"),
    ]
    shade = False
    for sec_name, sec_key in sections:
        pdf.set_fill_color(*(LIGHT if shade else WHITE))
        pdf.set_font("helvetica", "", 10)
        pdf.cell(widths[0], 9, f"  {sec_name}", fill=True)
        pdf.cell(widths[1], 9, str(stats[sec_key]["correct"]), align="C", fill=True)
        pdf.cell(widths[2], 9, str(stats[sec_key]["wrong"]), align="C", fill=True)
        pdf.cell(widths[3], 9, str(stats[sec_key]["unattempted"]), align="C", fill=True)
        sc = stats[sec_key]["score"]
        pdf.set_font("helvetica", "B", 10)
        pdf.set_text_color(*(RED if sc < 0 else GREEN))
        pdf.cell(widths[4], 9, str(sc), align="C", fill=True)
        pdf.set_text_color(0, 0, 0)
        pdf.ln()
        shade = not shade

    # totals row
    pdf.set_font("helvetica", "B", 10)
    pdf.set_fill_color(*INDIGO)
    pdf.set_text_color(*WHITE)
    pdf.cell(widths[0], 9, "  Total", fill=True)
    pdf.cell(widths[1], 9, str(total_correct), align="C", fill=True)
    pdf.cell(widths[2], 9, str(total_wrong), align="C", fill=True)
    pdf.cell(widths[3], 9, str(total_unattempted), align="C", fill=True)
    pdf.cell(widths[4], 9, str(total), align="C", fill=True)
    pdf.ln()
    pdf.set_text_color(0, 0, 0)
    pdf.ln(8)

    # ── Question-wise Analysis ────────────────────────────────────────────────
    section_title(pdf, "Question-wise Analysis")
    q_headers = ["Q.No", "Section", "Chosen", "Correct", "Status", "Marks"]
    q_widths = [pdf.epw * 0.10, pdf.epw * 0.28, pdf.epw * 0.15,
                pdf.epw * 0.15, pdf.epw * 0.20, pdf.epw * 0.12]

    def q_header():
        pdf.set_font("helvetica", "B", 9)
        pdf.set_fill_color(*PURPLE)
        pdf.set_text_color(*WHITE)
        for h, w in zip(q_headers, q_widths):
            pdf.cell(w, 8, h, align="C", fill=True)
        pdf.ln()
        pdf.set_text_color(0, 0, 0)

    q_header()
    shade = False
    for i, q in enumerate(questions):
        status = "Unattempted"
        marks = 0
        chosen = q["chosen"]
        correct = q["correct"]

        if i < 50:
            pos_m, neg_m, sec = 12, -3, "Mathematics"
        elif i < 90:
            pos_m, neg_m, sec = 6, -1.5, "Logical Reasoning"
        elif i < 110:
            pos_m, neg_m, sec = 6, -1.5, "Computer Awareness"
        else:
            pos_m, neg_m, sec = 4, -1, "General English"

        if chosen and chosen != "--":
            if chosen == correct:
                status, marks = "Correct", pos_m
            else:
                status, marks = "Incorrect", neg_m

        # manual page break so the table header repeats on each page
        if pdf.get_y() + 7 > pdf.h - pdf.b_margin:
            pdf.add_page()
            q_header()
            shade = False

        pdf.set_font("helvetica", "", 9)
        pdf.set_fill_color(*(LIGHT if shade else WHITE))
        pdf.cell(q_widths[0], 7, str(i + 1), align="C", fill=True)
        pdf.cell(q_widths[1], 7, f"  {sec}", fill=True)
        pdf.cell(q_widths[2], 7, str(chosen if chosen else "--"), align="C", fill=True)
        pdf.cell(q_widths[3], 7, str(correct if correct else "--"), align="C", fill=True)

        if status == "Correct":
            pdf.set_text_color(*GREEN)
        elif status == "Incorrect":
            pdf.set_text_color(*RED)
        else:
            pdf.set_text_color(*GRAY)
        pdf.set_font("helvetica", "B", 9)
        pdf.cell(q_widths[4], 7, status, align="C", fill=True)
        pdf.set_text_color(*(GREEN if marks > 0 else RED if marks < 0 else GRAY))
        pdf.cell(q_widths[5], 7, str(marks), align="C", fill=True)
        pdf.set_text_color(0, 0, 0)
        pdf.ln()
        shade = not shade

    # ── ACME Academy promotion banner ─────────────────────────────────────────
    pdf.ln(6)
    promo_h = 52
    if pdf.get_y() + promo_h > pdf.h - pdf.b_margin:
        pdf.add_page()
    py = pdf.get_y()
    pdf.set_fill_color(*INDIGO)
    pdf.rect(pdf.l_margin, py, pdf.epw, promo_h, style="F", round_corners=True, corner_radius=5)
    pdf.set_fill_color(*PINK)
    pdf.rect(pdf.l_margin, py, 4, promo_h, style="F")

    pdf.set_y(py + 8)
    pdf.set_text_color(*WHITE)
    pdf.set_font("helvetica", "B", 17)
    pdf.cell(0, 9, "Want to improve your NIMCET score?", ln=1, align="C")
    pdf.set_font("helvetica", "", 11)
    pdf.cell(0, 7, "Join ACME Academy - India's Most Trusted MCA Entrance Coaching", ln=1, align="C")
    pdf.ln(2)
    pdf.set_font("helvetica", "B", 12)
    pdf.set_text_color(*PINK)
    pdf.cell(0, 8, "Enroll Now   |   www.acmeacademy.in", ln=1, align="C")
    pdf.set_font("helvetica", "I", 9)
    pdf.set_text_color(210, 210, 230)
    pdf.cell(0, 6, "Expert faculty  -  Daily practice  -  Mock tests  -  Personal mentorship", ln=1, align="C")
    pdf.set_text_color(0, 0, 0)
    pdf.set_y(py + promo_h)

    pdf_out = pdf.output(dest="S")
    if isinstance(pdf_out, str):
        return pdf_out.encode("latin-1")
    return bytes(pdf_out)


# ---------- Save User Data to Google Sheets ----------

# Column order MUST match the headings already set up in the Google Sheet.
NIMCET_HEADER = [
    "DATE", "Application No.", "Name", "Score",
    "Math Correct", "Math Wrong", "Math Score",
    "Reasoning Correct", "Reasoning Wrong", "Reasoning Score",
    "Computer Correct", "Computer Wrong", "Computer Score",
    "English Correct", "English Wrong", "English Score",
    "Total Correct", "Total Wrong", "Total Unattempted",
    # Phone is appended at the END so existing sheet columns/rows stay aligned.
    # (If the live sheet already has the old 19-column header, add a "Phone"
    #  label in the next empty column — data is written there regardless.)
    "Phone",
]


def _nimcet_load_service_account_info():
    """Reuse the same service-account credentials the CUET sheet uses."""
    raw = os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON", "").strip()
    if not raw:
        raise RuntimeError("GOOGLE_SERVICE_ACCOUNT_JSON is empty or missing in your .env file.")

    if raw.endswith(".json") and not raw.startswith("{"):
        json_path = os.path.join(os.path.dirname(__file__), raw)
        if not os.path.exists(json_path):
            raise RuntimeError(f"Service account file not found: {json_path}")
        with open(json_path, "r") as f:
            return json.load(f)
    return json.loads(raw)


def get_nimcet_sheet():
    if not NIMCET_SHEET_ID:
        raise RuntimeError("NIMCET_SHEET_ID is empty or missing.")

    info   = _nimcet_load_service_account_info()
    creds  = Credentials.from_service_account_info(info, scopes=SCOPES)
    client = gspread.authorize(creds)

    try:
        spreadsheet = client.open_by_key(NIMCET_SHEET_ID)
    except gspread.exceptions.APIError as e:
        raise RuntimeError(
            f"Could not open the NIMCET Google Sheet. API error: {e}\n"
            f"  1. Is NIMCET_SHEET_ID correct? Current value: '{NIMCET_SHEET_ID}'\n"
            f"  2. Did you share the sheet (as Editor) with: {info.get('client_email', 'not found in JSON')}"
        )

    try:
        return spreadsheet.worksheet(NIMCET_WORKSHEET_NAME)
    except gspread.exceptions.WorksheetNotFound:
        # Auto-create the tab if it doesn't exist yet.
        return spreadsheet.add_worksheet(title=NIMCET_WORKSHEET_NAME, rows=1000, cols=len(NIMCET_HEADER))


def ensure_nimcet_header(sheet):
    if not sheet.get_all_values():
        sheet.append_row(NIMCET_HEADER, value_input_option="RAW")


def save_nimcet_to_sheet(user_name, user_phone, app_no, name, stats, total,
                         total_correct, total_wrong, total_unattempted):
    sheet = get_nimcet_sheet()
    ensure_nimcet_header(sheet)
    # Order matches NIMCET_HEADER exactly:
    # DATE, Application No., Name, Score, <Math c/w/s>, <Reasoning c/w/s>,
    # <Computer c/w/s>, <English c/w/s>, Total Correct, Total Wrong, Total Unattempted
    sheet.append_row(
        [
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            app_no or "N/A",
            name or user_name or "N/A",
            total,
            stats["Math"]["correct"], stats["Math"]["wrong"], stats["Math"]["score"],
            stats["LR"]["correct"], stats["LR"]["wrong"], stats["LR"]["score"],
            stats["Computer"]["correct"], stats["Computer"]["wrong"], stats["Computer"]["score"],
            stats["English"]["correct"], stats["English"]["wrong"], stats["English"]["score"],
            total_correct, total_wrong, total_unattempted,
            # OTP-verified mobile number from the Score Checker (last column).
            user_phone or "N/A",
        ],
        value_input_option="RAW",
    )


# ---------- NIMCET Routes ----------

@app.route("/nimcet")
def nimcet_index():
    return jsonify({"status": "NIMCET Flask API running ✅"})


@app.route("/nimcet/test-sheets", methods=["GET"])
def nimcet_test_sheets():
    """Verify the NIMCET sheet is reachable & writable. Hit this after sharing."""
    diagnostics = {
        "NIMCET_SHEET_ID":       NIMCET_SHEET_ID or "❌ NOT SET",
        "NIMCET_WORKSHEET_NAME": NIMCET_WORKSHEET_NAME,
    }
    try:
        info = _nimcet_load_service_account_info()
        diagnostics["share_this_email_as_Editor"] = info.get("client_email", "not found")
    except Exception as e:
        diagnostics["service_account"] = f"❌ {e}"
        return jsonify({"status": "FAILED", "diagnostics": diagnostics}), 500

    try:
        sheet = get_nimcet_sheet()
        diagnostics["worksheet_opened"] = sheet.title
        ensure_nimcet_header(sheet)
        diagnostics["header"] = "✅ present"
        sheet.append_row(
            [datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
             "TEST-APP", "Test Candidate", 0] + [0] * 15 + ["TEST-PHONE"],
            value_input_option="RAW",
        )
        diagnostics["test_row"] = "✅ written (you can delete it)"
        return jsonify({"status": "SUCCESS ✅", "diagnostics": diagnostics})
    except Exception as e:
        diagnostics["error"] = f"❌ {type(e).__name__}: {e}"
        diagnostics["fix"] = (
            f"Share the spreadsheet (Editor) with the service account email above, "
            f"then reload this URL."
        )
        return jsonify({"status": "FAILED", "diagnostics": diagnostics}), 500


@app.route("/nimcet/check", methods=["POST"])
def nimcet_check():
    app.logger.info("/nimcet/check called")

    if "response_sheet" not in request.files:
        app.logger.warning("Missing required file: response_sheet")
        return jsonify({"error": "NIMCET response sheet PDF is required."}), 400

    try:
        resp_file = request.files["response_sheet"]
        app.logger.info(f"response_sheet: filename={resp_file.filename}, content_type={resp_file.content_type}")

        pdf_bytes = resp_file.read()
        if not pdf_bytes:
            return jsonify({"error": "Uploaded response sheet is empty."}), 400

        with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
            text = "".join(page.get_text() for page in doc)

        app_no, name = nimcet_extract_candidate_info(text)
        questions = parse_nimcet_pdf(pdf_bytes)

        if not questions:
            app.logger.warning("Could not parse any questions from NIMCET response sheet.")
            return jsonify({
                "error": "Could not parse NIMCET Response Sheet PDF.",
                "debug_response_sample": text[:500],
            }), 400

        stats, total = nimcet_calculate_score(questions)
        rows = nimcet_build_question_rows(questions)

        total_correct = sum(s["correct"] for s in stats.values())
        total_wrong = sum(s["wrong"] for s in stats.values())
        total_unattempted = sum(s["unattempted"] for s in stats.values())

        user_name  = request.form.get("user_name", "").strip()
        user_phone = request.form.get("user_phone", "").strip()

        sheet_error = None
        try:
            save_nimcet_to_sheet(
                user_name, user_phone,
                app_no, name, stats, total,
                total_correct, total_wrong, total_unattempted,
            )
        except Exception as e:
            sheet_error = str(e)
            app.logger.warning(f"NIMCET Google Sheets save failed: {e}")

        response = {
            "candidate": {"app_no": app_no, "name": name},
            "total": total,
            "totals": {
                "correct": total_correct,
                "wrong": total_wrong,
                "unattempted": total_unattempted,
                "total_questions": len(questions),
            },
            "stats": stats,
            "results": rows,
        }
        if sheet_error:
            response["sheet_warning"] = f"Score calculated OK but sheet save failed: {sheet_error}"

        app.logger.info(f"NIMCET score: {total}, correct: {total_correct}, wrong: {total_wrong}, unattempted: {total_unattempted}")
        return jsonify(response)

    except Exception as e:
        app.logger.error(f"Exception in /nimcet/check: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@app.route("/nimcet/report", methods=["POST"])
def nimcet_report():
    app.logger.info("/nimcet/report called")

    if "response_sheet" not in request.files:
        return jsonify({"error": "NIMCET response sheet PDF is required."}), 400

    try:
        pdf_bytes = request.files["response_sheet"].read()
        if not pdf_bytes:
            return jsonify({"error": "Uploaded response sheet is empty."}), 400

        with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
            text = "".join(page.get_text() for page in doc)

        app_no, name = nimcet_extract_candidate_info(text)
        questions = parse_nimcet_pdf(pdf_bytes)

        if not questions:
            return jsonify({"error": "Could not parse NIMCET Response Sheet PDF."}), 400

        stats, total = nimcet_calculate_score(questions)
        pdf_report = nimcet_generate_pdf_report(app_no, name, stats, total, questions)

        filename = f"ACME_Academy_NIMCET_Report_{app_no if app_no else 'Student'}.pdf"
        return Response(
            pdf_report,
            mimetype="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )

    except Exception as e:
        app.logger.error(f"Exception in /nimcet/report: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@app.route("/nimcet/debug", methods=["POST"])
def nimcet_debug():
    if "response_sheet" not in request.files:
        return jsonify({"error": "response_sheet file required"}), 400
    try:
        pdf_bytes = request.files["response_sheet"].read()
        with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
            text = "".join(page.get_text() for page in doc)

        app_no, name = nimcet_extract_candidate_info(text)
        questions = parse_nimcet_pdf(pdf_bytes)
        return jsonify({
            "candidate": {"app_no": app_no, "name": name},
            "total_questions_parsed": len(questions),
            "sample_questions": questions[:5] and [
                {k: v for k, v in q.items() if k != "markers"} for q in questions[:5]
            ],
            "raw_text_sample": text[:800],
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5001)