import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { CheckSquare, FileText, Calendar, ArrowRight, Flame, Palette, Timer } from "lucide-react"
import { Logo } from "@/components/Logo"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2.5 font-black text-xl text-indigo">
          <div className="bg-indigo/10 p-1.5 rounded-xl">
            <Logo className="w-5 h-5 text-indigo" />
          </div>
          <span className="tracking-tight text-foreground">Synca</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-muted hover:text-indigo font-semibold">Entrar</Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="font-bold px-5">Começar Agora</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-24 md:py-36 max-w-5xl mx-auto text-center space-y-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo/10 border border-indigo/20 text-indigo text-sm font-semibold">
            <Flame className="w-4 h-4" />
            Vença a resistência cerebral
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground leading-[1.05]">
              Pequenos Hábitos,
              <br />
              <span className="text-indigo">Grandes Resultados.</span>
            </h1>
            <p className="text-xl text-muted max-w-2xl mx-auto leading-relaxed">
              Uma plataforma minimalista baseada na ciência para transformar sua rotina através de micro-metas diárias.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full gap-2 h-12 px-8 font-bold text-base shadow-lg shadow-indigo/20 hover:opacity-95 transition-all">
                Começar gratuitamente <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full h-12 px-8 font-semibold border-border text-foreground hover:bg-indigo/5 transition-colors">
                Já tenho uma conta
              </Button>
            </Link>
          </div>

        </section>

        {/* Features Grid */}
        <section className="bg-surface/30 py-24 border-y border-border">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14 space-y-3">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                Menos distração, mais evolução.
              </h2>
              <p className="text-muted max-w-xl mx-auto">
                O ecossistema essencial para transformar pequenas ações diárias em grandes resultados.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={Flame}
                title="Micro-Hábitos"
                description="Metas ridiculamente pequenas para vencer a procrastinação e criar momentum real."
              />
              <FeatureCard
                icon={CheckSquare}
                title="Gestão de Tarefas"
                description="Organize seu dia com checklists simples e eficazes que realmente saem do papel."
              />
              <FeatureCard
                icon={Palette}
                title="Quadros Visuais"
                description="Desenhe, conecte e estruture suas ideias livremente em quadros dinâmicos."
              />
              <FeatureCard
                icon={Timer}
                title="Foco"
                description="Mantenha a atenção plena no seu trabalho utilizando o timer Pomodoro integrado."
              />
              <FeatureCard
                icon={FileText}
                title="Relatórios"
                description="Escreva e compartilhe seus progressos em Markdown de forma clara e profissional."
              />
              <FeatureCard
                icon={Calendar}
                title="Calendário"
                description="Visualize sua jornada e planeje suas semanas com precisão cirúrgica."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 border-t border-border text-center text-muted text-sm bg-background">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Logo className="w-4 h-4 text-indigo/80" />
          <span className="font-semibold text-foreground/80">Synca</span>
        </div>
        <p>© 2026 Synca. Feito para quem valoriza o progresso constante.</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-surface border border-border shadow-sm hover:shadow-md hover:border-indigo/35 transition-all group">
      <div className="bg-indigo/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo group-hover:text-white transition-all">
        <Icon className="w-6 h-6 text-indigo group-hover:text-white transition-colors" />
      </div>
      <h3 className="font-bold text-lg mb-2 text-foreground">{title}</h3>
      <p className="text-muted text-sm leading-relaxed">{description}</p>
    </div>
  )
}
