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
# This tells Python to read your .env file from the same folder as this script
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"), override=True)

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024
CORS(app, resources={r"/*": {"origins": "*"}})

# ── Google Sheets Setup ───────────────────────────────────────────────────────

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]

SHEET_ID               = os.environ.get("GOOGLE_SHEET_ID", "").strip()
WORKSHEET_NAME        = os.environ.get("GOOGLE_WORKSHEET_NAME", "Results").strip()
VERIFICATION_SHEET_NAME = os.environ.get("GOOGLE_VERIFICATION_SHEET_NAME", "Sheet1").strip()



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

    # Accept either a file path (e.g. service_account.json) or raw JSON string
    if raw.endswith(".json") and not raw.startswith("{"):
        # It's a file path — resolve relative to this script's directory
        json_path = os.path.join(os.path.dirname(__file__), raw)
        if not os.path.exists(json_path):
            raise RuntimeError(
                f"Service account file not found: {json_path}\n"
                f"Make sure '{raw}' is in the same folder as app.py."
            )
        with open(json_path, "r") as f:
            info = json.load(f)
    else:
        # It's a raw JSON string
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


def save_verification_to_sheet(fullname, email, phone, address, target_exam, target_year, course_enrolled, 
                               father_name, mother_name, state, city, id_type, submission_date):
    """Save verification profile data to verification sheet"""
    try:
        raw = os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON", "").strip()
        if not raw:
            raise RuntimeError("GOOGLE_SERVICE_ACCOUNT_JSON is empty or missing in .env file.")
        if not SHEET_ID:
            raise RuntimeError("GOOGLE_SHEET_ID is empty or missing in .env file.")
        
        # Load credentials
        if raw.endswith(".json") and not raw.startswith("{"):
            json_path = os.path.join(os.path.dirname(__file__), raw)
            if not os.path.exists(json_path):
                raise RuntimeError(f"Service account file not found: {json_path}")
            with open(json_path, "r") as f:
                info = json.load(f)
        else:
            info = json.loads(raw)
        
        creds = Credentials.from_service_account_info(info, scopes=SCOPES)
        client = gspread.authorize(creds)
        spreadsheet = client.open_by_key(SHEET_ID)
        
        # Try to get verification sheet, create if doesn't exist
        try:
            sheet = spreadsheet.worksheet(VERIFICATION_SHEET_NAME)
        except gspread.exceptions.WorksheetNotFound:
            # Create new sheet if it doesn't exist
            sheet = spreadsheet.add_worksheet(VERIFICATION_SHEET_NAME, rows=1000, cols=12)
            # Add headers
            sheet.append_row(
                [
                    "Submission Date", "Full Name", "Email", "Phone", "Address", 
                    "Target Exam", "Target Year", "Course", "Father Name", 
                    "Mother Name", "State", "City", "ID Type"
                ],
                value_input_option="RAW",
            )
        
        # Check if headers exist, if not add them
        all_values = sheet.get_all_values()
        if not all_values:
            sheet.append_row(
                [
                    "Submission Date", "Full Name", "Email", "Phone", "Address", 
                    "Target Exam", "Target Year", "Course", "Father Name", 
                    "Mother Name", "State", "City", "ID Type"
                ],
                value_input_option="RAW",
            )
        
        # Append verification data
        sheet.append_row(
            [
                submission_date,
                fullname,
                email,
                phone,
                address,
                target_exam,
                target_year,
                course_enrolled,
                father_name,
                mother_name,
                state,
                city,
                id_type,
            ],
            value_input_option="RAW",
        )
        
        return True
    except Exception as e:
        print(f"Error saving verification to sheet: {e}")
        return False


# ── Parsers ───────────────────────────────────────────────────────────────────

def extract_text(file_stream):
    with fitz.open(stream=file_stream.read(), filetype="pdf") as doc:
        return "\n".join(page.get_text() for page in doc)


def parse_answer_key(text):
    result = dict(re.findall(r"(\d{10})\s+(\d{10})", text))
    if result:
        return result
    return dict(re.findall(r"(\d{8,12})\s+(\d{8,12})", text))


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
                m = re.search(r"(\d{8,12})", line)
                qid = m.group(1) if m else None
            for idx in range(4):
                if f"Option {idx+1} ID" in line:
                    m = re.search(r"(\d{8,12})", line)
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


# ── TEST ROUTE — open this in browser to check if sheets is working ───────────
# Visit: http://127.0.0.1:5001/test-sheets
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


@app.route("/save-verification", methods=["POST"])
def save_verification():
    """Save verification profile to Google Sheet"""
    try:
        data = request.json
        
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
        
        # Extract required fields
        fullname = data.get("fullname", "")
        email = data.get("email", "")
        phone = data.get("phone", "")
        address = data.get("address", "")
        target_exam = data.get("targetExam", "")
        target_year = data.get("targetYear", "")
        course = data.get("courseEnrolled", "")
        father_name = data.get("fatherName", "")
        mother_name = data.get("motherName", "")
        state = data.get("state", "")
        city = data.get("city", "")
        id_type = data.get("idType", "")
        
        submission_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        success = save_verification_to_sheet(
            fullname, email, phone, address, target_exam,
            target_year, course, father_name, mother_name,
            state, city, id_type, submission_date
        )
        
        if success:
            return jsonify({"success": True, "message": "Verification profile saved to sheet"})
        else:
            return jsonify({"success": False, "error": "Failed to save to sheet"}), 500
    
    except Exception as e:
        print(f"Error in /save-verification: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/check", methods=["POST"])
def check():
    if "response_sheet" not in request.files or "answer_key" not in request.files:
        return jsonify({"error": "Both PDF files are required."}), 400

    try:
        response_text = extract_text(request.files["response_sheet"])
        answer_text   = extract_text(request.files["answer_key"])

        answer_map   = parse_answer_key(answer_text)
        response_map = parse_response_sheet(response_text)

        if not answer_map:
            return jsonify({
                "error": "Could not parse Answer Key PDF.",
                "debug_answer_sample": answer_text[:500]
            }), 400

        if not response_map:
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

        return jsonify(response)

    except Exception as e:
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


if __name__ == "__main__":
    app.run(debug=True, port=5001)