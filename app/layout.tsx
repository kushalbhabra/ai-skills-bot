import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Skills Bot",
  description: "A Vercel AI SDK chatbot with bash skills",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f5f5f5" }}>
        {children}
      </body>
    </html>
  );
}
