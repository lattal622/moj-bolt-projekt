import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/40 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">Correct Score AI</span>
            <span className="text-muted-foreground">·</span>
            <span>Podaci: TheSportsDB</span>
            <span className="text-muted-foreground">·</span>
            <span>AI: Gemini / Ollama</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/postavke" className="hover:text-foreground transition-colors">
              Postavke
            </Link>
            <span>© 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
