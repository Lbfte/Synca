"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card"
import { X, Calendar } from "lucide-react"
import { createEvent, updateEvent } from "@/app/actions/events"
import { format, parseISO } from "date-fns"

export function CreateEventModal({ 
  isOpen, 
  onClose, 
  onSave,
  selectedDate,
  initialData
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSave: () => void,
  selectedDate: Date,
  initialData?: { id: string, title: string, start_time: string, end_time: string, category: string }
}) {
  const [title, setTitle] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [category, setCategory] = useState<'trabalho' | 'estudo' | 'pessoal'>('trabalho')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setStartTime(format(parseISO(initialData.start_time), "HH:mm"))
      setEndTime(format(parseISO(initialData.end_time), "HH:mm"))
      setCategory(initialData.category as any)
    } else {
      setTitle("")
      setStartTime("09:00")
      setEndTime("10:00")
      setCategory("trabalho")
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const start = new Date(selectedDate)
    const [startH, startM] = startTime.split(':')
    start.setHours(parseInt(startH), parseInt(startM))

    const end = new Date(selectedDate)
    const [endH, endM] = endTime.split(':')
    end.setHours(parseInt(endH), parseInt(endM))

    let result
    if (initialData) {
      result = await updateEvent(initialData.id, {
        title,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        category
      })
    } else {
      result = await createEvent(title, start.toISOString(), end.toISOString(), category)
    }
    
    setLoading(false)
    if (result.success) {
      setTitle("")
      onSave()
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-md shadow-2xl border-none bg-surface">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
          <CardTitle className="flex items-center gap-2 font-bold text-foreground">
            <Calendar className="w-5 h-5 text-indigo" />
            {initialData ? "Editar Compromisso" : "Novo Compromisso"}
          </CardTitle>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted">Título</label>
              <Input 
                placeholder="Ex: Reunião de Planejamento" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted">Início</label>
                <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted">Fim</label>
                <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted">Categoria</label>
              <select 
                className="flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-indigo/20 transition-all cursor-pointer"
                value={category}
                onChange={e => setCategory(e.target.value as any)}
              >
                <option value="trabalho">Trabalho</option>
                <option value="estudo">Estudo</option>
                <option value="pessoal">Pessoal</option>
              </select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t border-border pt-6">
            <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : (initialData ? "Salvar Alterações" : "Agendar Evento")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
