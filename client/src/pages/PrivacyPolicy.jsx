import React from "react";

const sections = [
  {
    title: "1. Introduction",
    body: [
      "Acme Academy is committed to safeguarding your privacy and ensuring a secure online learning environment. This Privacy Policy explains how we collect, use, store, and protect your information when you access or use our platform.",
      "By using www.acmeacademy.in or any associated services, you acknowledge that you have read, understood, and agreed to this Privacy Policy. If you do not agree, you must refrain from using our services.",
      "Acme Academy may update this Privacy Policy periodically to reflect operational, legal, or regulatory changes. Users are encouraged to review this page regularly.",
    ],
  },
  {
    title: "2. Information We Collect",
    body: [
      "2.1 Personal Information: Full name, email address, mobile number, profile photograph, academic details (course, class, exam preferences).",
      "2.2 Non-Personal Information: Preferences, interests, usage behavior, device type, browser type, operating system, IP address, access time, referring URLs.",
      "2.3 Automatically Collected Data: We may automatically collect technical data to enhance service performance, including analytics and system logs for all users visiting the Platform.",
    ],
  },
  {
    title: "3. Purpose of Data Collection",
    body: [
      "Your information is collected and used for the following purposes: providing educational services and academic support; managing enrollments, batches, and student records; personalizing user experience and recommendations; sending notifications related to classes, exams, results, or updates; improving platform functionality and service quality; maintaining internal records and analytics.",
    ],
  },
  {
    title: "4. Use and Disclosure of Information",
    body: [
      "Acme Academy may use or disclose your information to comply with applicable laws, regulations, or legal processes; enforce our Terms of Use or protect rights and safety; communicate important service-related updates; improve, modify, suspend, or discontinue services.",
      "If students upload notes or content to our platform and such content is approved, limited profile details (such as name or contact information, if permitted) may be visible to other users for academic collaboration.",
      "We do not sell your personal data to third parties.",
    ],
  },
  {
    title: "5. Cookies and Tracking Technologies",
    body: [
      "Our Platform uses cookies and similar technologies to enhance user experience, analyze traffic and usage patterns, and store user preferences.",
      "You may disable cookies through your browser settings; however, some features of the Platform may not function properly.",
    ],
  },
  {
    title: "6. Data Security",
    body: [
      "Acme Academy adopts appropriate technical and organizational measures to protect your personal information, including secure servers and restricted access controls, encryption protocols such as SSL (Secure Socket Layer), and regular monitoring to prevent unauthorized access.",
      "Despite our efforts, no system is completely secure, and users are advised to safeguard their login credentials.",
    ],
  },
  {
    title: "7. User Responsibilities",
    body: [
      "By using our Platform, you agree that the information provided by you is accurate and up to date, you will maintain confidentiality of your account credentials, and you will not misuse the Platform or engage in unlawful activities.",
      "Any misuse or misconduct may result in suspension or termination of access without prior notice.",
    ],
  },
  {
    title: "8. Student Policies and Institutional Rules",
    body: [
      "By enrolling or interacting with Acme Academy: fees once paid are non-refundable, except if a batch is cancelled by the Academy; students are expected to maintain discipline and respect faculty and peers; any misconduct may result in termination of enrollment without refund; Acme Academy reserves the right to modify schedules, faculty, or course structure without prior notice; by submitting forms or registering, you consent to receive communications (calls, messages, emails) from Acme Academy.",
    ],
  },
  {
    title: "9. Third-Party Links",
    body: [
      "Our Platform may contain links to third-party websites.",
      "These websites operate independently and are not controlled by Acme Academy.",
      "We are not responsible for their content, privacy practices, or policies.",
      "Users access such links at their own discretion.",
    ],
  },
  {
    title: "10. Data Retention",
    body: [
      "We retain your information only for as long as necessary to provide services, comply with legal obligations, resolve disputes, and enforce policies.",
    ],
  },
  {
    title: "11. Legal Compliance",
    body: [
      "This Privacy Policy is governed by the laws of India.",
      "We comply with applicable provisions of Indian laws relating to data protection and privacy.",
    ],
  },
  {
    title: "12. Updates to This Policy",
    body: [
      "Acme Academy reserves the right to revise this Privacy Policy at any time. Updated versions will be posted on this page with a revised effective date.",
    ],
  },
  {
    title: "13. Contact Us",
    body: [
      "For any questions, concerns, or requests related to this Privacy Policy:",
      "Email: team@acmeacademy.in",
      "Website: www.acmeacademy.in",
    ],
  },
];

const PrivacyPolicy = () => {
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
            Privacy Policy
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

export default PrivacyPolicy;
