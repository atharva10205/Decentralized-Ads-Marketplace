import "./globals.css";

export const metadata = {
  title: "Ads Blog Demo",
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
