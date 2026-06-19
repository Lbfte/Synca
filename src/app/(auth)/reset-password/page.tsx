"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { KeyRound } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      // Redirect after a moment
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md border border-border shadow-xl shadow-indigo/5 bg-surface text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight text-green">Senha atualizada!</CardTitle>
            <CardDescription className="pt-2 text-muted">
              Sua senha foi alterada com sucesso. Redirecionando para o painel...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md border border-border shadow-xl shadow-indigo/5 bg-surface">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <div className="bg-indigo/10 p-3 rounded-2xl mb-2">
            <KeyRound className="w-8 h-8 text-indigo" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Nova senha</CardTitle>
          <CardDescription className="text-muted">
            Digite sua nova senha abaixo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80 leading-none" htmlFor="password">
                Nova Senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background/50 border-border focus:border-indigo"
              />
            </div>
            {error && (
              <div className="text-sm text-red-500 font-medium bg-red-500/10 px-3 py-2 rounded-xl border border-red-500/20">
                {error}
              </div>
            )}
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Atualizando..." : "Atualizar senha"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/login" className="text-sm text-indigo font-semibold hover:underline">
            Voltar para o login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
