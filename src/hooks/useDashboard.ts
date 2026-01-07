import { useState, useEffect } from 'react'
import { DashboardData, DashboardSummary, ChartData } from '@/app/dashboard/_types'

export function useDashboard(): DashboardData {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [charts, setCharts] = useState<ChartData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch summary and charts data in parallel
      const [summaryRes, chartsRes] = await Promise.all([
        fetch('/api/dashboard/summary'),
        fetch('/api/dashboard/charts'),
      ])

      if (!summaryRes.ok || !chartsRes.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const [summaryData, chartsData] = await Promise.all([
        summaryRes.json(),
        chartsRes.json(),
      ])

      setSummary(summaryData)
      setCharts(chartsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    summary,
    charts,
    isLoading,
    error,
  }
}
