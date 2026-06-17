"use client"

import Loading from '@/components/Loading'
import RecentAndStats from './RecentAndStats'
import api from '@/lib/api'
import { StatsType, recentType } from '@/lib/types'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const Dashboard = () => {    
  const [stats, setStats] = useState<StatsType | null>(null)
  const [recents, setRecents] = useState<recentType[] | null>(null)
  
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, recentRes] = await Promise.all([
          api.get("dashboard/stats"),
          api.get("dashboard/recent"),
        ])
        setStats(statsRes.data)
        setRecents(recentRes.data)
      } catch(err: any) {
        toast.error(err?.response?.data?.message)
      }
    }
    fetchDashboard() 
  }, [])
  
  if (!stats || !recents) return <Loading></Loading>
  return (
    
    <div>
      <h1>Dashboard</h1>
      <p>Track your learning progress and activity</p>
      <RecentAndStats stats={stats} recents={recents}></RecentAndStats>
    </div>
  )
}

export default Dashboard