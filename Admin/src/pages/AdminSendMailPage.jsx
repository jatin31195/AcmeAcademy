import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, Send, Users2, AtSign, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { BASE_URL } from "@/config";

const API = `${BASE_URL}/api/admin/mail/send-mail`;

const emptyForm = {
  subject: "",
  message: "",
  emails: "",
};

const AdminSendMailPage = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendToAll, setSendToAll] = useState(true);
  const [form, setForm] = useState(emptyForm);

  /* ---------------- CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    if (!form.subject || !form.message) {
      alert("Subject and message are required");
      return;
    }

    const payload = {
      subject: form.subject,
      message: form.message,
      sendToAll,
      emails: sendToAll
        ? []
        : form.emails
            .split(",")
            .map((e) => e.trim())
            .filter(Boolean),
    };

    setLoading(true);

    const res = await fetch(API, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Failed to send mail");
      setLoading(false);
      return;
    }

    alert("Mail sent successfully ✅");
    setForm(emptyForm);
    setOpen(false);
    setLoading(false);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Send Admin Mail"
        description="Send email notifications to all users or selected email IDs"
      >
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => setOpen(true)}
        >
          <Send className="h-4 w-4 mr-2" />
          Compose Mail
        </Button>
      </PageHeader>

      {/* ---------------- HERO / INFO ---------------- */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card-elevated lg:col-span-2 flex flex-col items-start gap-5 p-6 sm:p-8">
          <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-primary shadow-glow">
            <Mail className="h-7 w-7 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-tight">
              Broadcast an announcement
            </h3>
            <p className="mt-1 max-w-prose text-sm text-muted-foreground">
              Compose a notification and deliver it to your entire user base or a
              hand-picked list of recipients. Emails are sent securely from your
              official ACME Academy address.
            </p>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => setOpen(true)}
          >
            <Send className="h-4 w-4 mr-2" />
            Compose Mail
          </Button>
        </div>

        <div className="grid gap-4">
          {[
            {
              icon: Users2,
              title: "All Users",
              desc: "Reach every registered student at once.",
            },
            {
              icon: AtSign,
              title: "Selected Emails",
              desc: "Target specific recipients by email.",
            },
            {
              icon: ShieldCheck,
              title: "Secure Delivery",
              desc: "Sent from your verified admin account.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="card-elevated flex items-start gap-3 p-4"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[hsl(var(--primary)/0.12)]">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- MODAL ---------------- */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-2xl border-border/70 bg-card text-foreground shadow-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Send Notification Email
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            {/* SUBJECT */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Subject</label>
              <Input
                name="subject"
                placeholder="Email Subject"
                value={form.subject}
                onChange={handleChange}
              />
            </div>

            {/* MESSAGE */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                name="message"
                placeholder="Write your message here..."
                value={form.message}
                onChange={handleChange}
                rows={5}
              />
            </div>

            {/* RECIPIENT TOGGLE — segmented control */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Recipients</label>
              <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-secondary/50 p-1">
                <button
                  type="button"
                  onClick={() => setSendToAll(true)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    sendToAll
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Users2 className="h-4 w-4" />
                  All Users
                </button>
                <button
                  type="button"
                  onClick={() => setSendToAll(false)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    !sendToAll
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <AtSign className="h-4 w-4" />
                  Selected
                </button>
              </div>
            </div>

            {/* EMAIL INPUT */}
            {!sendToAll && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email addresses</label>
                <Textarea
                  name="emails"
                  placeholder="Comma-separated, e.g. user1@gmail.com, user2@yahoo.com"
                  value={form.emails}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                "Sending..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Mail
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSendMailPage;
