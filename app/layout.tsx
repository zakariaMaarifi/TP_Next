import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pokédex",
  description: "Browse all Pokémons",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-[#eff8ff]" suppressHydrationWarning>
        <header className="bg-gradient-to-r from-blue-800 to-cyan-600 text-white py-4 shadow-lg sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-2xl font-bold tracking-wide drop-shadow">Pokédex</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
