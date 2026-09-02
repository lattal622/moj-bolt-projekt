import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { AllLeagues } from "@/components/all-leagues";
import { POPULAR_LEAGUES } from "@/lib/types";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Globe, Sparkles, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col pitch-bg">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nogometne lige svijeta</h1>
            <p className="text-muted-foreground mt-1">
              Pretražite sve dostupne nogometne lige svijeta i pronađite nadolazeće utakmice.
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Hero features */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card className="border-primary/20">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">AI predviđanje</p>
                <p className="text-xs text-muted-foreground">Gemini ili Ollama</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <Shield className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium">Privatnost</p>
                <p className="text-xs text-muted-foreground">Ključevi u pregledniku</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Zap className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium">Sve lige svijeta</p>
                <p className="text-xs text-muted-foreground">Besplatni podaci</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8">
          <PopularLeagues />
          <AllLeagues />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function PopularLeagues() {
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Popularne lige</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {POPULAR_LEAGUES.map((league) => (
          <Link key={league.id} href={`/liga/${league.id}`}>
            <Card className="group cursor-pointer transition-all hover:border-primary/50 hover:shadow-md">
              <CardContent className="flex items-center justify-between p-4">
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{league.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{league.country}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <Link href="/pretraga">
          <Card className="group cursor-pointer border-dashed transition-all hover:border-primary/50">
            <CardContent className="flex items-center justify-center gap-2 p-6 text-muted-foreground group-hover:text-primary">
              <Globe className="h-5 w-5" />
              <span className="font-medium">Pretraži sve momčadi po imenu</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
