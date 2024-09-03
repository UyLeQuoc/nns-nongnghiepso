import BackgroundAnimation from "@/components/background-animation";
import { Button } from "@/components/ui/button";
import { TractorIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full overflow-x-hidden">
      <BackgroundAnimation />
      <div className="container mx-auto">
      <header className="flex items-center justify-between p-4 text-[#DCFFD7]">
        <div className="flex items-center space-x-2 cursor-pointer">
          <TractorIcon className="w-8 h-8 text-[#DCFFD7]" />
          <span className="text-2xl font-bold">NNS</span>
        </div>
        <nav className="flex items-center space-x-6">
          <Link href="#" className="text-lg font-medium" prefetch={false}>
            Trang chủ
          </Link>
          <Link href="#" className="text-lg font-medium" prefetch={false}>
            Giá cả
          </Link>
          <Link href="#" className="text-lg font-medium" prefetch={false}>
            Các đại lý
          </Link>
          <Link href="#" className="text-lg font-medium" prefetch={false}>
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
      <main className="container mx-auto py-12">
        <section className="mb-12">
          <div className="flex items-center justify-between gap-2  mb-6">
            <h2 className="text-3xl font-bold text-[#DCFFD7]">Tin tức mới</h2>
            <Button className="bg-[#DCFFD7] text-[#0F4026] hover:bg-[#DCFFD7] hover:opacity-60">Xem thêm</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-[#0F4026]">
            <div className="bg-[#DCFFD7] rounded-lg shadow-md overflow-hidden">
              <img src="https://tranguyenlieu.vn/upload/elfinder/Topic%2072b/Tin%2035/Doi%20tra%20dep%20nhat%20lam%20dong%2015.jpg" alt="Blog Post 1" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">Blog Post 1</h3>
                <p className="text-gray-500 mb-4">This is a caption for Blog Post 1.</p>
              </div>
            </div>
            <div className="bg-[#DCFFD7] rounded-lg shadow-md overflow-hidden">
              <img src="https://tranguyenlieu.vn/upload/elfinder/Topic%2072b/Tin%2035/Doi%20tra%20dep%20nhat%20lam%20dong%2015.jpg" alt="Blog Post 2" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">Blog Post 2</h3>
                <p className="text-gray-500 mb-4">This is a caption for Blog Post 2.</p>
              </div>
            </div>
            <div className="bg-[#DCFFD7] rounded-lg shadow-md overflow-hidden">
              <img src="https://tranguyenlieu.vn/upload/elfinder/Topic%2072b/Tin%2035/Doi%20tra%20dep%20nhat%20lam%20dong%2015.jpg" alt="Blog Post 3" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">Blog Post 3</h3>
                <p className="text-gray-500 mb-4">This is a caption for Blog Post 3.</p>
              </div>
            </div>
            <div className="bg-[#DCFFD7] rounded-lg shadow-md overflow-hidden">
              <img src="https://tranguyenlieu.vn/upload/elfinder/Topic%2072b/Tin%2035/Doi%20tra%20dep%20nhat%20lam%20dong%2015.jpg" alt="Blog Post 4" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">Blog Post 4</h3>
                <p className="text-gray-500 mb-4">This is a caption for Blog Post 4.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-[#24613F]">Giá hôm nay</h2>
                <div className="flex items-center gap-2">
                  <TractorIcon className="w-8 h-8 text-[#1a3a1a]" />
                  <span className="text-2xl font-bold">NNS</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#f0f8f0] rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-bold mb-4">Cà phê</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-bold text-[#1a3a1a]">150.000 VND</span>
                    <span className="text-sm text-[#1a3a1a] line-through">175.000 VND</span>
                    <span className="text-sm text-green-500">-16.67%</span>
                  </div>
                  <button className="bg-[#1a3a1a] text-white rounded-lg px-4 py-2 hover:bg-[#2c5a2c] transition-colors">
                    Xem lịch sử giá
                  </button>
                </div>
                <div className="bg-[#f0f8f0] rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-bold mb-4">Trà</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-bold text-[#1a3a1a]">$29.99</span>
                    <span className="text-sm text-[#1a3a1a] line-through">$39.99</span>
                    <span className="text-sm text-green-500">-25%</span>
                  </div>
                  <button className="bg-[#1a3a1a] text-white rounded-lg px-4 py-2 hover:bg-[#2c5a2c] transition-colors">
                    Xem lịch sử giá
                  </button>
                </div>
                <div className="bg-[#f0f8f0] rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-bold mb-4">Lúa mì</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-bold text-[#1a3a1a]">$19.99</span>
                    <span className="text-sm text-[#1a3a1a] line-through">$39.99</span>
                    <span className="text-sm text-green-500">-20%</span>
                  </div>
                  <button className="bg-[#1a3a1a] text-white rounded-lg px-4 py-2 hover:bg-[#2c5a2c] transition-colors">
                    Xem lịch sử giá
                  </button>
                </div>
                <div className="bg-[#f0f8f0] rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center text-[#24613F]">
                  <span className="text-lg font-bold">Xem thêm sản phẩm nông nghiệp</span>
                </div>
              </div>
            </div>
          </section>

      </main>
      </div>
    </div>
  );
}
