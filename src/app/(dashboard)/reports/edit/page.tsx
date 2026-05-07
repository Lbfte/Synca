"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { getReport, updateReport, deleteReport } from "@/app/actions/reports"
import { 
  getReportConnections, 
  linkHabitToReport, 
  unlinkHabitFromReport, 
  linkTaskToReport, 
  unlinkTaskFromReport 
} from "@/app/actions/report-links"
import { Report, Habit, DailyTask } from "@/types/database"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card } from "@/components/ui/Card"
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Globe, 
  Lock, 
  Eye, 
  Edit3, 
  Loader2, 
  Check, 
  Copy,
  ExternalLink,
  Link as LinkIcon,
  Flame,
  CheckCircle2,
  Share2
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import Link from "next/link"
import { cn } from "@/lib/utils"

function EditorContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const router = useRouter()
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')
  const [copied, setCopied] = useState(false)

  // Connections state
  const [allHabits, setAllHabits] = useState<Habit[]>([])
  const [allTasks, setAllTasks] = useState<DailyTask[]>([])
  const [linkedHabitIds, setLinkedHabitIds] = useState<string[]>([])
  const [linkedTaskIds, setLinkedTaskIds] = useState<string[]>([])
  const [showConnections, setShowConnections] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (id) {
      fetchReport()
      fetchUserData()
      fetchConnections()
    }
  }, [id])

  const fetchReport = async () => {
    const data = await getReport(id as string)
    if (data) {
      setReport(data)
    } else {
      router.push('/reports')
    }
    setLoading(false)
  }

  const fetchUserData = async () => {
    const { data: habits } = await supabase.from('habits').select('*').order('name')
    const { data: tasks } = await supabase.from('daily_tasks').select('*').order('created_at', { ascending: false }).limit(20)
    if (habits) setAllHabits(habits)
    if (tasks) setAllTasks(tasks)
  }

  const fetchConnections = async () => {
    const { habits, tasks } = await getReportConnections(id as string)
    setLinkedHabitIds(habits.map((h: any) => h.id))
    setLinkedTaskIds(tasks.map((t: any) => t.id))
  }

  const handleSave = async () => {
    if (!report) return
    setSaving(true)
    await updateReport(report.id, {
      title: report.title || "",
      content: report.content || "",
      is_public: report.is_public,
      access_code: report.access_code
    })
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este relatório?")) return
    await deleteReport(id as string)
    router.push('/reports')
  }

  const togglePublic = async () => {
    if (!report) return
    const newStatus = !report.is_public
    setReport({ ...report, is_public: newStatus })
    await updateReport(report.id, { is_public: newStatus })
  }

  const toggleHabitLink = async (habitId: string) => {
    if (linkedHabitIds.includes(habitId)) {
      await unlinkHabitFromReport(id as string, habitId)
      setLinkedHabitIds(linkedHabitIds.filter(hid => hid !== habitId))
    } else {
      await linkHabitToReport(id as string, habitId)
      setLinkedHabitIds([...linkedHabitIds, habitId])
    }
  }

  const toggleTaskLink = async (taskId: string) => {
    if (linkedTaskIds.includes(taskId)) {
      await unlinkTaskFromReport(id as string, taskId)
      setLinkedTaskIds(linkedTaskIds.filter(tid => tid !== taskId))
    } else {
      await linkTaskToReport(id as string, taskId)
      setLinkedTaskIds([...linkedTaskIds, taskId])
    }
  }

  const copyShareLink = () => {
    const url = `${window.location.origin}/HabitFlow/share/view/?id=${id}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <Loader2 className="w-8 h-8 text-indigo animate-spin" />
      <p className="text-gray-500">Abrindo editor...</p>
    </div>
  )

  if (!report) return null

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex-1 space-y-6">
        <header className="flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md py-4 z-10 border-b border-gray-50 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/reports">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setMode('edit')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${mode === 'edit' ? 'bg-white shadow-sm text-indigo' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Edit3 className="w-3.5 h-3.5" /> Escrever
              </button>
              <button 
                onClick={() => setMode('preview')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${mode === 'preview' ? 'bg-white shadow-sm text-indigo' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Eye className="w-3.5 h-3.5" /> Visualizar
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowConnections(!showConnections)}
              className={cn(showConnections && "bg-indigo/5 text-indigo border-indigo/20")}
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              Conexões
            </Button>
            <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={handleDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="sm" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Salvar
            </Button>
          </div>
        </header>

        <div className="space-y-8">
          <Input 
            className="text-4xl font-bold border-none bg-transparent px-0 focus-visible:ring-0 placeholder:text-gray-200 h-auto py-2"
            placeholder="Título do relatório..."
            value={report.title || ""}
            onChange={(e) => setReport({ ...report, title: e.target.value })}
          />

          <div className="flex items-center gap-4">
            <button 
              onClick={togglePublic}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${report.is_public ? 'bg-green/5 border-green/20 text-green' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
            >
              {report.is_public ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              {report.is_public ? 'Público (Com link)' : 'Privado'}
            </button>

            {report.is_public && (
              <div className="flex items-center gap-4 animate-in slide-in-from-left-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                  <Input 
                    placeholder="PIN de acesso (opcional)" 
                    className="h-8 w-40 text-xs"
                    value={report.access_code || ""}
                    onChange={(e) => setReport({ ...report, access_code: e.target.value })}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-indigo" onClick={copyShareLink}>
                    {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                    {copied ? 'Copiado!' : 'Copiar Link'}
                  </Button>
                  <Link href={`/share/view?id=${id}`} target="_blank">
                    <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-gray-500">
                      <ExternalLink className="w-3.5 h-3.5 mr-1" /> Ver Público
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {mode === 'edit' ? (
            <textarea 
              className="w-full min-h-[500px] bg-transparent border-none focus:ring-0 resize-none text-lg leading-relaxed placeholder:text-gray-200 outline-none"
              placeholder="Comece a escrever sua jornada... (Suporta Markdown)"
              value={report.content || ""}
              onChange={(e) => setReport({ ...report, content: e.target.value })}
            />
          ) : (
            <Card className="p-8 border-none shadow-sm bg-white min-h-[500px]">
              <article className="prose prose-indigo max-w-none">
                <ReactMarkdown>{report.content || "*Nenhum conteúdo para visualizar.*"}</ReactMarkdown>
              </article>
            </Card>
          )}
        </div>
      </div>

      {/* Sidebar de Conexões */}
      {showConnections && (
        <aside className="w-full lg:w-80 space-y-6 animate-in slide-in-from-right-4 duration-300">
          <Card className="border-none shadow-xl ring-1 ring-gray-100 p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-indigo" />
                Vincular Dados
              </h3>
              <button onClick={() => setShowConnections(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Seção de Hábitos */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Micro-Hábitos</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {allHabits.map(habit => (
                    <button
                      key={habit.id}
                      onClick={() => toggleHabitLink(habit.id)}
                      className={cn(
                        "w-full flex items-center gap-3 p-2 rounded-lg text-left text-sm transition-all",
                        linkedHabitIds.includes(habit.id) 
                          ? "bg-indigo/5 text-indigo ring-1 ring-indigo/20" 
                          : "hover:bg-gray-50 text-gray-600"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center transition-all",
                        linkedHabitIds.includes(habit.id) ? "bg-indigo border-indigo" : "border-gray-200"
                      )}>
                        {linkedHabitIds.includes(habit.id) && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="truncate">{habit.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Seção de Tarefas */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tarefas Recentes</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {allTasks.map(task => (
                    <button
                      key={task.id}
                      onClick={() => toggleTaskLink(task.id)}
                      className={cn(
                        "w-full flex items-center gap-3 p-2 rounded-lg text-left text-sm transition-all",
                        linkedTaskIds.includes(task.id) 
                          ? "bg-indigo/5 text-indigo ring-1 ring-indigo/20" 
                          : "hover:bg-gray-50 text-gray-600"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center transition-all",
                        linkedTaskIds.includes(task.id) ? "bg-indigo border-indigo" : "border-gray-200"
                      )}>
                        {linkedTaskIds.includes(task.id) && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="truncate">{task.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-8 text-[10px] text-gray-400 leading-relaxed italic">
              Os dados marcados aparecerão anexados ao final do seu relatório público.
            </p>
          </Card>
        </aside>
      )}
    </div>
  )
}

function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  )
}

export default function ReportEditorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo" /></div>}>
      <EditorContent />
    </Suspense>
  )
}
