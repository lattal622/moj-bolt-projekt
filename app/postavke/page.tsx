"use client";

import * as React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { loadSettings, saveSettings, loadPredictions, clearPredictions } from "@/lib/settings";
import { AISettings, DEFAULT_SETTINGS, GROQ_MODELS } from "@/lib/types";
import { toast } from "sonner";
import { Sparkles, Cloud, HardDrive, Key, Database, Save, Trash2, ExternalLink, Info, Palette, Shield, Moon, Sun, Monitor, Wifi, CircleCheck as CheckCircle2, Circle as XCircle, Loader as Loader2, Download, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import { testOllamaConnection, testGroqConnection } from "@/lib/ai";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SettingsPage() {
  const [settings, setSettings] = React.useState<AISettings>(DEFAULT_SETTINGS);
  const [mounted, setMounted] = React.useState(false);
  const [predCount, setPredCount] = React.useState(0);
  const [ollamaTest, setOllamaTest] = React.useState<{ ok: boolean; message: string; models?: string[] } | null>(null);
  const [ollamaTesting, setOllamaTesting] = React.useState(false);
  const [groqTest, setGroqTest] = React.useState<{ ok: boolean; message: string } | null>(null);
  const [groqTesting, setGroqTesting] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setSettings(loadSettings());
    setPredCount(loadPredictions().length);
    setMounted(true);
  }, []);

  function handleSave() {
    saveSettings(settings);
    toast.success("Postavke spremljene!");
  }

  function updateField(field: keyof AISettings, value: string) {
    setSettings((prev) => ({ ...prev, [field]: value }));
  }

  function handleClearPredictions() {
    clearPredictions();
    setPredCount(0);
    toast.success("Sva predviđanja obrisana.");
  }

  async function handleTestOllama() {
    setOllamaTesting(true);
    setOllamaTest(null);
    try {
      const result = await testOllamaConnection(settings);
      setOllamaTest(result);
      if (result.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch {
      setOllamaTest({ ok: false, message: "Greška pri spajanju na Ollama." });
    } finally {
      setOllamaTesting(false);
    }
  }

  async function handleTestGroq() {
    setGroqTesting(true);
    setGroqTest(null);
    try {
      const result = await testGroqConnection(settings);
      setGroqTest(result);
      if (result.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch {
      setGroqTest({ ok: false, message: "Greška pri spajanju na Groq." });
    } finally {
      setGroqTesting(false);
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col pitch-bg">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8" />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pitch-bg">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Postavke</h1>
            <p className="text-muted-foreground mt-1">
              Konfigurirajte AI izvor, API ključeve i izgled aplikacije.
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="max-w-2xl space-y-6">
          {/* AI Source */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI izvor za predviđanje
              </CardTitle>
              <CardDescription>
                Odaberite AI izvor za predviđanje. Groq je preporučen — besplatan, brz i najprecizniji.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={settings.aiSource}
                onValueChange={(v) => updateField("aiSource", v)}
                className="gap-3"
              >
                <label
                  htmlFor="groq"
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-all ${
                    settings.aiSource === "groq" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                  }`}
                >
                  <RadioGroupItem value="groq" id="groq" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <span className="font-medium">Groq (preporučeno)</span>
                      <Badge variant="default" className="text-xs">Besplatno</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Najbrži AI. 14.400 zahtjeva/dan besplatno. Modeli: Llama 3.3 70B, Qwen, GPT-OSS. Potreban API ključ.
                    </p>
                  </div>
                </label>

                <label
                  htmlFor="gemini"
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-all ${
                    settings.aiSource === "gemini" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                  }`}
                >
                  <RadioGroupItem value="gemini" id="gemini" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Cloud className="h-4 w-4 text-primary" />
                      <span className="font-medium">Google Gemini</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Cloud AI, model gemini-2.5-flash. Besplatno do 1500 zahtjeva/dan. Potreban API ključ.
                    </p>
                  </div>
                </label>

                <label
                  htmlFor="ollama"
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-all ${
                    settings.aiSource === "ollama" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                  }`}
                >
                  <RadioGroupItem value="ollama" id="ollama" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-primary" />
                      <span className="font-medium">Ollama (lokalno)</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Potpuno besplatno, neograničeno. Pokrenite Ollama na svom računalu.
                    </p>
                  </div>
                </label>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Groq Settings */}
          {settings.aiSource === "groq" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5 text-primary" />
                  Groq API postavke
                </CardTitle>
                <CardDescription>
                  Besplatno 14.400 zahtjeva/dan. Najbrži AI za predviđanje.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="groqKey">API ključ</Label>
                  <Input
                    id="groqKey"
                    type="password"
                    placeholder="gsk_..."
                    value={settings.groqApiKey}
                    onChange={(e) => updateField("groqApiKey", e.target.value)}
                  />
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    Nabavi besplatni Groq API ključ
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="groqModel">Model</Label>
                  <Select
                    value={settings.groqModel}
                    onValueChange={(v) => updateField("groqModel", v)}
                  >
                    <SelectTrigger id="groqModel">
                      <SelectValue placeholder="Odaberi model" />
                    </SelectTrigger>
                    <SelectContent>
                      {GROQ_MODELS.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Llama 3.3 70B je preporučen za najpreciznije predviđanje.
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 w-full"
                  onClick={handleTestGroq}
                  disabled={groqTesting}
                >
                  {groqTesting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Testiranje veze...</>
                  ) : (
                    <><Wifi className="h-4 w-4" /> Testiraj vezu s Groq</>
                  )}
                </Button>

                {groqTest && (
                  <div className={`flex items-start gap-2 rounded-lg p-3 text-sm ${groqTest.ok ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                    {groqTest.ok ? <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" /> : <XCircle className="h-4 w-4 shrink-0 mt-0.5" />}
                    <p>{groqTest.message}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Gemini API Key */}
          {settings.aiSource === "gemini" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Key className="h-5 w-5 text-primary" />
                  Google Gemini API ključ
                </CardTitle>
                <CardDescription>
                  Obavezno. Potrebno za AI predviđanje (gemini-2.5-flash). Besplatni tier: 1500 zahtjeva/dan.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="geminiKey">API ključ</Label>
                  <Input
                    id="geminiKey"
                    type="password"
                    placeholder="AIza..."
                    value={settings.geminiApiKey}
                    onChange={(e) => updateField("geminiApiKey", e.target.value)}
                  />
                </div>
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  Nabavi besplatni Gemini API ključ
                  <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>
          )}

          {/* Ollama Settings */}
          {settings.aiSource === "ollama" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <HardDrive className="h-5 w-5 text-primary" />
                  Ollama postavke
                </CardTitle>
                <CardDescription>
                  Konfigurirajte vezu s lokalnim Ollama poslužiteljem.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ollamaUrl">Ollama URL</Label>
                  <Input
                    id="ollamaUrl"
                    type="text"
                    placeholder="http://localhost:11434"
                    value={settings.ollamaUrl}
                    onChange={(e) => updateField("ollamaUrl", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ollamaModel">Model</Label>
                  <Input
                    id="ollamaModel"
                    type="text"
                    placeholder="llama3.2"
                    value={settings.ollamaModel}
                    onChange={(e) => updateField("ollamaModel", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Preporučeni modeli: llama3.2, mistral, qwen2.5
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 w-full"
                  onClick={handleTestOllama}
                  disabled={ollamaTesting}
                >
                  {ollamaTesting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Testiranje veze...</>
                  ) : (
                    <><Wifi className="h-4 w-4" /> Testiraj vezu s Ollama</>
                  )}
                </Button>

                {ollamaTest && (
                  <div className={`flex items-start gap-2 rounded-lg p-3 text-sm ${ollamaTest.ok ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                    {ollamaTest.ok ? <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" /> : <XCircle className="h-4 w-4 shrink-0 mt-0.5" />}
                    <div>
                      <p>{ollamaTest.message}</p>
                      {ollamaTest.models && ollamaTest.models.length > 0 && (
                        <p className="text-xs mt-1 opacity-80">Instalirani modeli: {ollamaTest.models.join(", ")}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p><b>Upute:</b> 1) Instalirajte Ollama s ollama.com 2) Pokrenite "ollama serve" u terminalu 3) Preuzmite model: "ollama pull llama3.2"</p>
                    <p>Ako je Ollama na drugom računalu, promijenite URL gore (npr. http://192.168.1.100:11434).</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* SportsDB Key */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Database className="h-5 w-5 text-primary" />
                TheSportsDB ključ
              </CardTitle>
              <CardDescription>
                Opcionalno. Otključava pretraživanje momčadi po imenu, veći rate limit i livescores.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="sportsDbKey">API ključ</Label>
                <Input
                  id="sportsDbKey"
                  type="text"
                  placeholder="3 (besplatni)"
                  value={settings.sportsDbApiKey}
                  onChange={(e) => updateField("sportsDbApiKey", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Bez ključa, aplikacija radi s besplatnim podacima (lige, raspored, tablice, forma).
                </p>
              </div>
              <a
                href="https://www.thesportsdb.com/api.php"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                Nabavi TheSportsDB ključ
                <ExternalLink className="h-3 w-3" />
              </a>
            </CardContent>
          </Card>

          {/* API-Football Key */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Database className="h-5 w-5 text-muted-foreground" />
                API-Football ključ
              </CardTitle>
              <CardDescription>
                Opcionalno. Alternativni izvor podataka: 2000+ natjecanja, H2H, ozljede.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="apiFootballKey">API ključ</Label>
                <Input
                  id="apiFootballKey"
                  type="password"
                  placeholder="Opcionalno"
                  value={settings.apiFootballKey}
                  onChange={(e) => updateField("apiFootballKey", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button onClick={handleSave} size="lg" className="w-full gap-2">
            <Save className="h-4 w-4" /> Spremi postavke
          </Button>

          <Separator />

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Palette className="h-5 w-5 text-primary" />
                Izgled
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                  onClick={() => setTheme("light")}
                >
                  <Sun className="h-4 w-4" /> Svijetlo
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="h-4 w-4" /> Tamno
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                  onClick={() => setTheme("system")}
                >
                  <Monitor className="h-4 w-4" /> Sustav
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-primary" />
                Upravljanje podacima
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium text-sm">Spremljena predviđanja</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {predCount} predviđanja u lokalnoj pohrani
                  </p>
                </div>
                {predCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-destructive"
                    onClick={handleClearPredictions}
                  >
                    <Trash2 className="h-4 w-4" /> Obriši
                  </Button>
                )}
              </div>

              <div className="flex gap-2 rounded-lg bg-muted/50 p-4 text-xs text-muted-foreground">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p>API ključevi se spremaju isključivo u vašem pregledniku (localStorage) i nikada se ne šalju na vanjske poslužitelje osim službenih API servisa (Google Gemini, TheSportsDB).</p>
                  <p>Ollama radi potpuno lokalno — podaci o utakmici se šalju samo na vaše računalo, bez vanjskih poziva.</p>
                  <p>Besplatni podaci: TheSportsDB besplatni ključ omogućuje pregled liga, rasporeda, tablica i forme momčadi bez registracije.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PWA Install */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Download className="h-5 w-5 text-primary" />
                Instaliraj aplikaciju
              </CardTitle>
              <CardDescription>
                Instalirajte aplikaciju na radnu površinu ili telefon za brži pristup.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground space-y-2">
                <p className="font-medium text-foreground">Chrome / Edge (PC i Android):</p>
                <p>Kliknite ikonu "Instaliraj" u adresnoj traci ili odaberite "Instaliraj aplikaciju" iz izbornika preglednika.</p>
                <p className="font-medium text-foreground mt-3">Safari (iPhone / iPad):</p>
                <p>1. Dodirnite gumb "Podijeli" 2. Odaberite "Dodaj na početni zaslon" 3. Potvrdite.</p>
                <p className="font-medium text-foreground mt-3">Safari (Mac):</p>
                <p>Odaberite "Dodaj u Dock" iz izbornika Datoteka.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
