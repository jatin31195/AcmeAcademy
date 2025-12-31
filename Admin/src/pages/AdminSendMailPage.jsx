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
          className="bg-indigo-600 hover:bg-indigo-500 text-white"
          onClick={() => setOpen(true)}
        >
          Send Mail
        </Button>
      </PageHeader>

      {/* ---------------- MODAL ---------------- */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="
            max-w-lg
            bg-white dark:bg-slate-900
            text-foreground
            border border-border
            shadow-xl
            opacity-100
          "
        >
          <DialogHeader>
            <DialogTitle>Send Notification Email</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            {/* SUBJECT */}
            <Input
              name="subject"
              placeholder="Email Subject"
              value={form.subject}
              onChange={handleChange}
            />

            {/* MESSAGE */}
            <Textarea
              name="message"
              placeholder="Write your message here..."
              value={form.message}
              onChange={handleChange}
              rows={5}
            />

            {/* TOGGLE */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={sendToAll}
                  onChange={() => setSendToAll(true)}
                />
                <span>Send to All Users</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!sendToAll}
                  onChange={() => setSendToAll(false)}
                />
                <span>Send to Selected Emails</span>
              </label>
            </div>

            {/* EMAIL INPUT */}
            {!sendToAll && (
              <Textarea
                name="emails"
                placeholder="Enter email IDs separated by comma
example:
user1@gmail.com, user2@yahoo.com"
                value={form.emails}
                onChange={handleChange}
                rows={3}
              />
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-500 text-white"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Mail"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSendMailPage;
