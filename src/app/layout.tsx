import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

// ⚠️ REPLACE_ME: site-wide SEO metadata
export const metadata: Metadata = {
  title: {
    default: "MuzDevX — Websites, Software & AI Tools",
    template: "%s | YourSite",
  },
  description:
    "A personal digital hub showcasing websites, software, landing pages, a blog, news, and an AI assistant that knows every project.",
  metadataBase: new URL("https://muzdevx.dedyn.io"), // REPLACE_ME with your real domain
};

// Runs before paint so there's no light/dark flash on load.
const themeInitScript = `
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored || 'dark';
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <SplashScreen />
          <Navbar />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
          <Chatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}
