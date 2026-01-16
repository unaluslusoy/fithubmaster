import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard, LineChart, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-primary-green">
            <span className="text-2xl">⚡</span> FitHubPoint
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="#features" className="hover:text-primary-green transition-colors">Özellikler</Link>
            <Link href="#solutions" className="hover:text-primary-green transition-colors">Çözümler</Link>
            <Link href="#pricing" className="hover:text-primary-green transition-colors">Fiyatlandırma</Link>
          </nav>
          <div className="flex gap-4">
            <Link href="/api/auth/login">
              <Button variant="ghost">Giriş Yap</Button>
            </Link>
            <Link href="/api/auth/register">
              <Button variant="brand">Hemen Başla</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32 pb-16">
          <div className="container relative z-10 flex flex-col items-center text-center">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium border-border bg-secondary/50 text-secondary-foreground mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary-green mr-2"></span>
              Yeni Nesil Fitness Yönetimi
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl mb-6">
              Fitness İşinizi <span className="text-[var(--caribbean-green)]">Profesyonelleştirin</span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 mb-10">
              Hocalar, öğrenciler ve spor salonları için hepsi bir arada yönetim platformu. 
              Antrenman planları, beslenme takibi ve finansal yönetim tek panelde.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Button size="lg" variant="brand" className="h-12 px-8 text-base">
                Ücretsiz Deneyin <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                Demo İsteyin
              </Button>
            </div>
          </div>
          
          {/* Background Gradient */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[var(--caribbean-green)]/10 blur-[120px] rounded-full -z-10" />
        </section>

        {/* Features Grid */}
        <section id="features" className="py-16 md:py-24 bg-secondary/10">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-16">Neden FitHubPoint?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: LayoutDashboard,
                  title: "Kapsamlı Yönetim Paneli",
                  desc: "Öğrencilerinizi, ödemelerinizi ve programlarınızı tek bir yerden yönetin."
                },
                {
                  icon: LineChart,
                  title: "Gelişmiş İlerleme Takibi",
                  desc: "Öğrenci gelişimini grafiklerle takip edin, motivasyonu artırın."
                },
                {
                  icon: Users,
                  title: "Otomatik İletişim",
                  desc: "Randevu hatırlatmaları ve otomatik bildirimlerle zaman kazanın."
                },
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center text-center p-6 bg-background rounded-xl border border-border/50 hover:border-[var(--caribbean-green)]/50 transition-colors shadow-sm">
                  <div className="p-3 rounded-full bg-secondary mb-4">
                    <feature.icon className="h-8 w-8 text-[var(--caribbean-green)]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-12 md:py-16 bg-rich-black text-anti-flash-white">
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <span className="text-2xl font-bold flex items-center gap-2">⚡ FitHubPoint</span>
            <p className="mt-4 text-stone max-w-xs">
              Fitness profesyonelleri için geliştirilmiş en kapsamlı dijital asistan.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Ürün</h4>
            <ul className="space-y-2 text-sm text-stone">
              <li>Özellikler</li>
              <li>Fiyatlandırma</li>
              <li>Güvenlik</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Şirket</h4>
            <ul className="space-y-2 text-sm text-stone">
              <li>Hakkımızda</li>
              <li>Blog</li>
              <li>İletişim</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
