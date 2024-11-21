"use client"

import { useState } from 'react';
import { TractorIcon, MenuIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="flex items-center justify-between py-4 px-4 xl:px-2 text-[#DCFFD7]">
      <div className="flex items-center space-x-2 cursor-pointer">
        <TractorIcon className="w-8 h-8 text-[#DCFFD7]" />
        <span className="text-2xl font-bold">NNS</span>
      </div>
      
      <nav className="hidden xl:flex items-center space-x-6">
        <Link href="/" className="text-lg font-medium" prefetch={false}>
          Trang chủ
        </Link>
        <Link href="/gia-ca" className="text-lg font-medium" prefetch={false}>
          Giá cả
        </Link>
        <Link href="/dai-ly" className="text-lg font-medium" prefetch={false}>
          Các đại lý
        </Link>
        <Link href="/vat-dung" className="text-lg font-medium" prefetch={false}>
          Vật dụng
        </Link>
        <Link href="/blogs" className="text-lg font-medium" prefetch={false}>
          Tin tức
        </Link>
        <Link href="/pricing" className="text-lg font-medium" prefetch={false}>
          Nâng cấp
        </Link>
        <Link href="/about" className="text-lg font-medium" prefetch={false}>
          Về chúng tôi
        </Link>
      </nav>

      <div className="hidden xl:flex items-center space-x-4">
        <Link href="/login" className="w-full">
          <Button className="w-full bg-[#DCFFD7] text-[#0F4026] hover:bg-[#DCFFD7] hover:opacity-60">Đăng nhập</Button>
        </Link>
        <Link href="/register" className="w-full">
          <Button className="w-full bg-[#FAFE44] text-[#0F4026] hover:bg-[#FAFE44] hover:opacity-60">Đăng ký đại lý</Button>
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="xl:hidden flex items-center">
        <button onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? (
            <XIcon className="w-8 h-8 text-[#DCFFD7]" />
          ) : (
            <MenuIcon className="w-8 h-8 text-[#DCFFD7]" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="xl:hidden absolute top-16 left-0 right-0 bg-[#0F4026] p-4 shadow-lg space-y-4 z-50">
          <nav className="flex flex-col items-start space-y-4">
            <Link href="/" className="text-lg font-medium" prefetch={false}>
              Trang chủ
            </Link>
            <Link href="/gia-ca" className="text-lg font-medium" prefetch={false}>
              Giá cả
            </Link>
            <Link href="/dai-ly" className="text-lg font-medium" prefetch={false}>
              Các đại lý
            </Link>
            <Link href="/vat-dung" className="text-lg font-medium" prefetch={false}>
              Vật dụng
            </Link>
            <Link href="/blogs" className="text-lg font-medium" prefetch={false}>
              Tin tức
            </Link>
            <Link href="/pricing" className="text-lg font-medium" prefetch={false}>
              Nâng cấp
            </Link>
            <Link href="/about" className="text-lg font-medium" prefetch={false}>
              Về chúng tôi
            </Link>
          </nav>
          <div className="flex flex-col items-start space-y-4 mt-4">
            <Link href="/login" className="w-full">
              <Button className="w-full bg-[#DCFFD7] text-[#0F4026] hover:bg-[#DCFFD7] hover:opacity-60">Đăng nhập</Button>
            </Link>
            <Link href="/register" className="w-full">
              <Button className="w-full bg-[#FAFE44] text-[#0F4026] hover:bg-[#FAFE44] hover:opacity-60">Đăng ký đại lý</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
