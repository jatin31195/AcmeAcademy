import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const terms = [
  {
    id: "acme1",
    text: "Acme Academy has the right to publish your Rank.",
  },
  {
    id: "acme2",
    text: "Fees is not refundable.",
  },
  {
    id: "acme3",
    text: "Acme Academy has complete right and access of your Course/Performance.",
  },
  {
    id: "acme4",
    text: "Student should not be enrolled in any other institute (for claiming its Gifts/Goodies).",
  },
];

const detailedTerms = [
  "In case a Tutor decides to remove a Student/Subscriber from an online course for any reason whatsoever, it is at the sole discretion of the Tutor and the responsibility of the tutor. The online content hosted by the Tutors is meant for educational purposes and should not be circulated without the permission of the Content Creator. It is agreed and clarified that the Student/Subscriber shall not have any recourse, claims, or grievance in law, tort, or equity against Bunch.",
  "The online content hosted by the Tutor is meant for educational purposes and should not be circulated without the permission of the Content Creator. The Subscriber shall be strictly liable for any unlawful or unauthorized publication, forwarding, distribution or dissemination of any content hosted by a Tutor, without the express consent of the Tutor or Content Creator as the case maybe. It shall be open to the Tutor/Content Creator or Bunch to take legal action against the Subscriber for the same.",
  "Bunch bears absolutely no responsibility for the content and updates released in relation to the subscription of the Subscriber, which shall be the sole responsibility and liability of the Tutor publishing such information. Any claims, losses, damages, compensation or any proceedings in relation to the content hosted by the Tutor, may only lie against the Tutor and the Subscriber agrees not to proceed against Bunch in relation to any content whatsoever.",
  "In case any payment is deducted from the Subscriber's account incorrectly, i.e. without access to course, the amount will be refunded to your account in four (4) to seven (7) business days subsequent to Bunch being intimated as to the same.",
  "The only way to subscribe to any online course is via online payment, and no offline modes of payments or subscription is permissible. Any such subscription will be deemed illegal and invalid and no compensation or refund shall be provided by Bunch in related to such illegal and unauthorized subscriptions.",
  "The transactions will be liable for refund as per the refund policy. In scenarios where there is no separate refund Policy, such transaction will be non-refundable.",
];

const TermsAndConditions = ({ accepted, onChange }) => {
  return (
    <div className="space-y-4">

      {/* Short Terms */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        {terms.map((t) => (
          <div key={t.id} className="flex items-start gap-2">
            <span className="text-primary font-bold mt-0.5">•</span>
            <p className="text-sm text-foreground">{t.text}</p>
          </div>
        ))}
      </div>

      {/* Detailed Terms */}
      <ScrollArea className="h-48 border border-border rounded-lg p-4">
        <h4 className="font-heading font-semibold text-sm text-foreground mb-3">
          Terms and Conditions Applicable to Students/Subscribers
        </h4>

        <div className="space-y-3">
          {detailedTerms.map((text, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-xs font-bold text-muted-foreground mt-0.5 flex-shrink-0">
                {String(i + 1).padStart(2, "0")}.
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {text}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Checkbox */}
      <div className="flex items-start gap-3 p-4 bg-card border border-border rounded-lg">
        <Checkbox
          id="accept-terms"
          checked={accepted}
          onCheckedChange={(v) => onChange(v === true)}
          className="mt-0.5"
        />

        <label
          htmlFor="accept-terms"
          className="text-sm text-foreground cursor-pointer leading-relaxed"
        >
          I have read and agree to all the Terms and Conditions of ACME Academy.
          I understand that fees are non-refundable and ACME Academy has the
          right to publish my rank and access my course/performance data.
        </label>
      </div>

    </div>
  );
};

export default TermsAndConditions;