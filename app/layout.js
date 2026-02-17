export const metadata = {
  title: "Smart Bookmark",
  description: "Private real-time updating bookmark manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
