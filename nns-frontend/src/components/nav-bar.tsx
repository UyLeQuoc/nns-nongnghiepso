import { TractorIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'

export default function NavBar() {
  return (
    <header className="flex items-center justify-between p-4 text-[#DCFFD7]">
        <div className="flex items-center space-x-2 cursor-pointer">
          <TractorIcon className="w-8 h-8 text-[#DCFFD7]" />
          <span className="text-2xl font-bold">NNS</span>
        </div>
        <nav className="flex items-center space-x-6">
            <Link href="/" className="text-lg font-medium" prefetch={false}>
            Trang chủ
            </Link>
            <Link href="#" className="text-lg font-medium" prefetch={false}>
            Giá cả
            </Link>
            <Link href="#" className="text-lg font-medium" prefetch={false}>
            Các đại lý
            </Link>
            <Link href="/blogs" className="text-lg font-medium" prefetch={false}>
            Tin tức
            </Link>
            <Link href="#" className="text-lg font-medium" prefetch={false}>
            Về chúng tôi
            </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Button className="bg-[#DCFFD7] text-[#0F4026] hover:bg-[#DCFFD7] hover:opacity-60">Đăng nhập</Button>
          <Button className="bg-[#FAFE44] text-[#0F4026] hover:bg-[#FAFE44] hover:opacity-60">Đăng ký đại lý</Button>
        </div>
      </header>
  )
}
