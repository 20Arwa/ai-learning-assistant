import RecentAndStats from './RecentAndStats'
import serverApi from "@/lib/serverApi"
import api from '@/lib/api'
import { StatsType, recentType } from '@/lib/types'
import { cookies } from 'next/headers'

const Dashboard = async () => {
  
  const cookieStore = await cookies()
  
  console.log("TOKEN:",cookieStore.get("token")?.value)
  
  const api = await serverApi()
  // const statsRes = await api.get("dashboard/stats")
  let statsRes = null
  const recentRes = await api.get("dashboard/recent") 



  try {
    statsRes = await api.get("dashboard/stats")
    console.log("STATS", statsRes.data)
  } catch (err) {
    console.log("ERROR", err)
  }

  console.log(
    "TOKEN",
    (await cookies()).get("token")
  )

  const stats: StatsType = statsRes?.data
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