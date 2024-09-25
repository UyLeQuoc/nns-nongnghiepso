import BackgroundAnimation from '@/components/background-animation'
import NavBar from '@/components/nav-bar'
import React from 'react'

export default function Page() {
  return (
    <div className="w-full overflow-x-hidden">
    <BackgroundAnimation />
    <div className="container mx-auto">
        <NavBar />
        <main className="container mx-auto py-12 px-2">
            <h2 className="text-3xl font-bold text-[#DCFFD7] mb-6">Giá sản phâm hôm nay</h2>

        </main>
        </div>
    </div>
  )
}
