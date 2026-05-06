"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { getPublicReport } from "@/app/actions/reports"
import { getReportConnections } from "@/app/actions/report-links"
import ReactMarkdown from "react-markdown"
import { Flame, Calendar, User, Loader2, CheckCircle2, Link as LinkIcon, Lock, Key } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"

function ShareContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [report, setReport] = useState<any>(null)
  const [connections, setConnections] = useState<{ habits: any[], tasks: any[] }>({ habits: [], tasks: [] })
  const [loading, setLoading] = useState(true)
  const [isLocked, setIsLocked] = useState(false)
  const [pin, setPin] = useState("")
  const [error, setError] = useState(false)

  useEffect(() => {
    async function load() {
      if (id) {
        const data = await getPublicReport(id as string)
        if (data) {
          setReport(data)
          if (data.access_code) {
            setIsLocked(true)
          } else {
            const conn = await getReportConnections(id as string)
            setConnections(conn)
          }
        }
      }
      setLoading(false)
    }
    load()
  }, [id])

  const handleUnlock = async () => {
    if (pin === report.access_code) {
      setIsLocked(false)
      const conn = await getReportConnections(id as string)
      setConnections(conn)
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 text-indigo animate-spin" />
    </div>
  )

  if (!report) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Relatório não encontrado</h1>
        <p className="text-gray-500">Este relatório pode não existir ou não estar marcado como público.</p>
        <Link href="/">
          <Button>Voltar para o Início</Button>
        </Link>
      </div>
    )
  }

  if (isLocked) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8 border-none shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-indigo/5 rounded-3xl flex items-center justify-center mx-auto text-indigo">
            <Lock className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Relatório Protegido</h1>
            <p className="text-gray-500 text-sm">Este relatório requer um código de acesso para ser visualizado.</p>
          </div>
          <div className="space-y-4">
            <Input 
              type="password" 
              placeholder="Digite o código..." 
              className={cn("text-center text-2xl tracking-[1em] font-black h-16", error && "border-red-500 animate-shake")}
              value={pin}
              onChange={e => setPin(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleUnlock()}
            />
            {error && <p className="text-red-500 text-xs font-bold">Código incorreto. Tente novamente.</p>}
            <Button className="w-full h-12 text-lg" onClick={handleUnlock}>
              Acessar Relatório
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] selection:bg-indigo/10 selection:text-indigo pb-24">
      <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-indigo">
          <div className="bg-indigo p-1.5 rounded-lg">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span>HabitFlow</span>
        </Link>
        <Link href="/register">
          <Button size="sm">Criar meu HabitFlow</Button>
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <article className="space-y-12">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              {report.title || "Relatório sem título"}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo/10 flex items-center justify-center text-indigo">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span>Usuário HabitFlow</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{format(new Date(report.created_at), "d 'de' MMMM, yyyy", { locale: ptBR })}</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          <div className="prose prose-lg prose-indigo max-w-none prose-headings:font-bold prose-p:leading-relaxed prose-p:text-gray-700">
            <ReactMarkdown>{report.content || "*Este relatório não possui conteúdo.*"}</ReactMarkdown>
          </div>

          {/* Dados Vinculados */}
          {(connections.habits.length > 0 || connections.tasks.length > 0) && (
            <div className="mt-16 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="flex items-center gap-2 text-indigo">
                <LinkIcon className="w-5 h-5" />
                <h3 className="font-bold text-lg uppercase tracking-tight">Dados Vinculados</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hábitos */}
                {connections.habits.map(habit => (
                  <Card key={habit.id} className="p-4 border-none shadow-sm bg-white ring-1 ring-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                        <Flame className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{habit.name}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                          Sequência: {habit.streak_count} dias
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Tarefas */}
                {connections.tasks.map(task => (
                  <Card key={task.id} className="p-4 border-none shadow-sm bg-white ring-1 ring-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-green/5 p-2 rounded-lg text-green">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{task.title}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                          {task.is_completed ? "Concluída" : "Pendente"}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </article>

        <footer className="mt-24 pt-12 border-t border-gray-100 text-center">
          <div className="bg-indigo/5 rounded-3xl p-8 md:p-12 space-y-6">
            <h3 className="text-2xl font-bold text-indigo">Inspirado por este progresso?</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              O HabitFlow ajuda você a construir micro-hábitos e documentar sua jornada rumo ao sucesso.
            </p>
            <Link href="/register">
              <Button size="lg" className="px-8 shadow-lg shadow-indigo/20">
                Começar Minha Jornada Agora
              </Button>
            </Link>
          </div>
        </footer>
      </main>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

export default function PublicReportPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo" /></div>}>
      <ShareContent />
    </Suspense>
  )
}
