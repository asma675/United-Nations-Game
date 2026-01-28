import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UN Nations Quiz",
  description: "Quiz game about the UN, SDGs, human rights, climate, and global health.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
