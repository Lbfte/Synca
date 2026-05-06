import { createClient } from "@/utils/supabase/client"

export async function linkHabitToReport(reportId: string, habitId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('report_habits')
    .insert({ report_id: reportId, habit_id: habitId })

  if (error) return { error: error.message }
  return { success: true }
}

export async function unlinkHabitFromReport(reportId: string, habitId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('report_habits')
    .delete()
    .eq('report_id', reportId)
    .eq('habit_id', habitId)

  if (error) return { error: error.message }
  return { success: true }
}

export async function linkTaskToReport(reportId: string, taskId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('report_tasks')
    .insert({ report_id: reportId, task_id: taskId })

  if (error) return { error: error.message }
  return { success: true }
}

export async function unlinkTaskFromReport(reportId: string, taskId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('report_tasks')
    .delete()
    .eq('report_id', reportId)
    .eq('task_id', taskId)

  if (error) return { error: error.message }
  return { success: true }
}

export async function getReportConnections(reportId: string) {
  const supabase = createClient()
  
  const { data: habits } = await supabase
    .from('report_habits')
    .select('habit_id, habits(*)')
    .eq('report_id', reportId)

  const { data: tasks } = await supabase
    .from('report_tasks')
    .select('task_id, daily_tasks(*)')
    .eq('report_id', reportId)

  return {
    habits: habits?.map(h => h.habits) || [],
    tasks: tasks?.map(t => t.daily_tasks) || []
  }
}

export async function shareReportWithEmail(reportId: string, email: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('report_shares')
    .insert({ report_id: reportId, shared_with_email: email })

  if (error) return { error: error.message }
  return { success: true }
}
