"use client"

import BackgroundAnimation from '@/components/background-animation'
import NavBar from '@/components/nav-bar'
import React from 'react'

export default function ChartProductTypeOfUserPage({ params }: { params: { agentId: string, productTypeId: string } }) {
  return (
    <div className="w-full overflow-x-hidden">
      <BackgroundAnimation />
      <div className="container mx-auto">
      <NavBar />
      <main className="container mx-auto py-12 px-2 pt-6">
        
      </main>
    </div>
    </div>
  )
}
