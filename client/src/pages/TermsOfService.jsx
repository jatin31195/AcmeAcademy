import React from "react";

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: [
      "By accessing, browsing, or using the services provided on www.acmeacademy.in (Platform), you acknowledge that you have read, understood, and agreed to comply with these Terms of Use.",
      "Acme Academy reserves the right to revise, modify, or update these Terms at any time without prior notice. Continued use of the Platform after such updates constitutes your acceptance of the revised Terms.",
    ],
  },
  {
    title: "2. About Acme Academy",
    body: [
      "Acme Academy is an educational platform with its primary center located in Raipur, Chhattisgarh, providing academic support, competitive exam preparation, and learning resources.",
    ],
  },
  {
    title: "3. Scope of Services",
    body: [
      "Through this Platform, users may access online study materials and academic resources, prepare for competitive exams and educational programs, upload and share notes or study content (subject to moderation), and receive updates regarding admissions, results, job alerts, and notifications.",
      "Acme Academy reserves the right to modify, suspend, or discontinue any feature or service, restrict access to certain features without prior notice, and update content or system functionality at its sole discretion.",
    ],
  },
  {
    title: "4. User Responsibilities and Acceptable Use",
    body: [
      "By using this Platform, you agree that you will not engage in any unlawful, fraudulent, or abusive activity; attempt to disrupt or damage the Platform's functionality; attempt unauthorized access to systems, servers, or data; or misuse the Platform for spam, hacking, or data extraction.",
      "Any violation may result in immediate suspension or termination of access.",
    ],
  },
  {
    title: "5. User Content and License",
    body: [
      "If you upload, submit, or share any content (including notes, files, or materials), you confirm that you own or have rights to such content.",
      "You grant Acme Academy a non-exclusive, royalty-free license to use, display, and distribute such content for educational purposes.",
      "You agree that your content does not violate any intellectual property or legal rights.",
    ],
  },
  {
    title: "6. Privacy and Cookies",
    body: [
      "Your use of the Platform is also governed by our Privacy Policy (handling of personal data) and Cookie Policy (usage tracking and experience enhancement).",
      "By using our services, you consent to these policies.",
    ],
  },
  {
    title: "7. Third-Party Links and Services",
    body: [
      "The Platform may include links to external websites or services.",
      "Acme Academy does not control or endorse third-party websites and is not responsible for their content, accuracy, or policies. Accessing such links is at your own risk.",
    ],
  },
  {
    title: "8. Intellectual Property Rights",
    body: [
      "All content on this Platform, including logos, branding, design elements, study materials, graphics, and text, are the intellectual property of Acme Academy or its licensors.",
      "You may not reproduce, distribute, or modify content without permission, or use branding or trademarks without authorization.",
    ],
  },
  {
    title: "9. Copyright Infringement Policy",
    body: [
      "If you believe any content on the Platform infringes your copyright, you may submit a written notice including a description of the copyrighted work, location of the infringing material on the Platform, your contact details, a declaration of good faith belief of unauthorized use, and your signature (digital or physical).",
      "As per Section 51 of the Copyright Act, 1957, such claims will be reviewed.",
      "Contact: team@acmeacademy.in",
    ],
  },
  {
    title: "10. Termination of Access",
    body: [
      "Acme Academy reserves the right to suspend or terminate user accounts and restrict access without prior notice due to violations of Terms, misuse, or legal requirements.",
    ],
  },
  {
    title: "11. Disclaimer of Liability",
    body: [
      "Services are provided on an as-is basis.",
      "Acme Academy does not guarantee uninterrupted or error-free access.",
      "We are not liable for any direct or indirect damages arising from use of the Platform.",
    ],
  },
  {
    title: "12. Governing Law and Jurisdiction",
    body: [
      "These Terms shall be governed by the laws of India.",
      "Any disputes arising shall be subject to the jurisdiction of competent courts in Raipur, Chhattisgarh.",
    ],
  },
  {
    title: "13. Contact Information",
    body: [
      "For any questions, concerns, or legal notices:",
      "Email: team@acmeacademy.in",
      "Website: www.acmeacademy.in",
    ],
  },
];

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <section className="relative overflow-hidden py-14 sm:py-16 border-b border-slate-200">
        <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-red-100 blur-3xl opacity-60" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-blue-100 blur-3xl opacity-60" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-red-600 uppercase">
            Legal and Compliance
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
            Terms of Use and Service Agreement
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Effective Date: 5 April 2026 | Website: www.acmeacademy.in
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="space-y-5 sm:space-y-6">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 sm:p-6"
            >
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {section.title}
              </h2>
              <div className="mt-3 space-y-3 text-sm sm:text-base leading-relaxed text-slate-700">
                {section.body.map((line, index) => (
                  <p key={`${section.title}-${index}`}>{line}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
