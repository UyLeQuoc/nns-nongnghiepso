'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, DollarSign, Store, Package, Newspaper } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Trang chủ', href: '/', icon: Home },
    { name: 'Giá cả', href: '/gia-ca', icon: DollarSign },
    { name: 'Đại lý', href: '/dai-ly', icon: Store },
    { name: 'Vật dụng', href: '/vat-dung', icon: Package },
    { name: 'Về chúng tôi', href: '/about', icon: Newspaper },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0F4026] text-[#DCFFD7] xl:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center w-full h-full ${
              pathname === item.href ? 'text-[#FAFE44]' : ''
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}