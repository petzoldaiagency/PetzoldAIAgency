import "./globals.css";

export const metadata = {
  title: "Petzold AI Agency | AI Search Visibility",
  description:
    "Helping local businesses understand and improve how they are represented in AI-powered search.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
