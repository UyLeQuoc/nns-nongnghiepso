import { DailyAveragePriceChart } from '@/components/DailyAveragePriceChart'
import React from 'react'

export default function AgentDashboardPage() {
  return (
    <div>
      <DailyAveragePriceChart productTypeId={1} />
      <DailyAveragePriceChart productTypeId={2} />
    </div>
  )
}
