import LegalPage from "@/components/common/LegalPage";

export const metadata = { title: "Terms of Service | Petro Engineering" };

export default function Page() {
  return (
    <LegalPage
      crumb="Terms of Service"
      title="Terms of Service"
      intro="The terms that apply when you use the Petro Engineering website."
      sections={[
        { h: "Use of the website", p: ["The content on this website is provided for general information about our products and services. You agree to use it lawfully and not to disrupt or misuse it."] },
        { h: "Product information", p: ["Specifications, sizes and ratings shown are indicative. Final specifications, pricing and delivery are confirmed in a written quotation or order acceptance."] },
        { h: "Quotations and orders", p: ["A website enquiry or RFQ is not a binding order. Orders are governed by the commercial terms stated in our quotation and purchase order documents."] },
        { h: "Intellectual property", p: ["The Petro Engineering name, logo and website content are our property or used with permission and may not be copied without consent."] },
        { h: "Limitation of liability", p: ["We make reasonable efforts to keep information accurate, but provide the website as is and are not liable for losses arising from reliance on it, to the extent permitted by law."] },
        { h: "Governing law", p: ["These terms are governed by the laws of India, with jurisdiction in Mumbai, Maharashtra."] },
      ]}
    />
  );
}
