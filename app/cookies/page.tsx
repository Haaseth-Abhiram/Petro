import LegalPage from "@/components/common/LegalPage";

export const metadata = { title: "Cookie Policy | Petro Engineering" };

export default function Page() {
  return (
    <LegalPage
      crumb="Cookie Policy"
      title="Cookie Policy"
      intro="What cookies this website uses and how you can control them."
      sections={[
        { h: "What are cookies", p: ["Cookies are small text files stored on your device that help a website work and remember your choices."] },
        { h: "Strictly necessary", p: ["Required for the site to function, for example remembering your language and cookie choices. These are always on."] },
        { h: "Analytics", p: ["Help us understand how the site is used so we can improve it. Used only if you accept them."] },
        { h: "Marketing", p: ["Used to personalise content and measure campaigns. Used only if you accept them."] },
        { h: "Managing your choice", p: ["Use the cookie banner to accept, decline or customise. You can also clear cookies in your browser settings; the banner will then appear again."] },
      ]}
    />
  );
}
