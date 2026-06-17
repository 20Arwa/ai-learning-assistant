import RecentAndStats from './RecentAndStats'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import serverApi from "@/lib/serverApi"
import { StatsType, recentType } from '@/lib/types'

const Dashboard = async () => {
  const api = await serverApi()

  const statsRes = await api.get("dashboard/stats")
  const recentRes = await api.get("dashboard/recent") 

  const stats: StatsType = statsRes.data
  const recents: recentType[] = recentRes.data
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Track your learning progress and activity</p>
      <RecentAndStats stats={stats} recents={recents}></RecentAndStats>
    </div>
  )
}

export default Dashboard