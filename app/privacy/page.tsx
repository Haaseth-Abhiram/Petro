import LegalPage from "@/components/common/LegalPage";

export const metadata = { title: "Privacy Policy | Petro Engineering" };

export default function Page() {
  return (
    <LegalPage
      crumb="Privacy Policy"
      title="Privacy Policy"
      intro="How Petro Engineering Private Limited collects, uses and protects the information you share with us."
      sections={[
        { h: "Information we collect", p: ["When you submit an enquiry, RFQ, career application or contact form, we collect the details you provide: name, company, email, phone number and the content of your message or attachments.", "We may also record basic technical data such as browser type and pages visited, only if you allow analytics cookies."] },
        { h: "How we use it", p: ["We use your information to respond to enquiries, prepare quotations, process career applications and send service-related confirmations. We do not sell your personal data."] },
        { h: "Sharing", p: ["We share information only with service providers who help us operate the website and email, and where required by law."] },
        { h: "Retention and security", p: ["We keep enquiry records for as long as needed to serve you and meet legal obligations, and use reasonable technical and organisational measures to protect them."] },
        { h: "Your choices", p: ["You may ask to access, correct or delete your information by writing to sales@petroeng.in. You can manage cookies through the cookie settings on the site."] },
      ]}
    />
  );
}
