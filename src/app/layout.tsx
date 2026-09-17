import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Los Guanachapines",
  description: "Sistema interno del comedor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}