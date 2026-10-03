import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Livendia Finance - Plataforma Financiera",
  description:
    "Livendia Finance: asesoramiento, calculadoras, base de clientes y colaboradores.",
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
