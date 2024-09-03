"use client"

import BackgroundAnimation from '@/components/background-animation'
import NavBar from '@/components/nav-bar'
import { Button } from '@/components/ui/button'
import { TractorIcon } from 'lucide-react'

export default function LoginPage() {

  return (
    <div className="w-full overflow-x-hidden">
      <BackgroundAnimation />
      <div className="container mx-auto">
      <NavBar />
      <main className="container mx-auto py-12">
        <section className="mb-12">
          <div className="flex items-center justify-between gap-2  mb-6">
            <h2 className="text-3xl font-bold text-[#DCFFD7]">Tin tức</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-[#0F4026]">
          
          </div>
        </section>
      </main>
      </div>
    </div>
  )
}
