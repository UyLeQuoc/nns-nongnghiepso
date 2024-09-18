"use client"

import blogApi, { Blog } from "@/apis/blogApi";
import AveragePriceByProduct from "@/components/AveragePriceByProduct";
import AveragePriceByProductAndType from "@/components/AveragePriceByProductAndType";
import BackgroundAnimation from "@/components/background-animation";
import NavBar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { TractorIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const data = await blogApi.getAll();
    if(data) {
      setBlogs(data.slice(0,4));
    }
  };

  return (
    <div className="w-full overflow-x-hidden">
      <BackgroundAnimation />
      <div className="container mx-auto">
      <NavBar />
      <main className="container mx-auto py-12 px-2">
        <section className="mb-12">
          <div className="flex items-center justify-between gap-2 mb-6">
            <h2 className="text-3xl font-bold text-[#DCFFD7]">Tin tức mới</h2>
            <Button className="bg-[#DCFFD7] text-[#0F4026] hover:bg-[#DCFFD7] hover:opacity-60"
              onClick={() => router.push("/blogs")}>Xem thêm</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-[#0F4026]">
            {
              blogs.length > 0 ? (
                blogs.map((blog) => (
                  <div key={blog.id} className="bg-[#DCFFD7] rounded-lg shadow-md overflow-hidden">
                    <iframe width="100%" height="200" src={blog.youtubeLink.replace("watch?v=", "embed/")} title={blog.title} allowFullScreen />
                    <div className="p-4">
                      <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                      <p className="text-gray-500 mb-4">{blog.caption}</p>
                    </div>
                  </div>
                ))
              ) : (
                "Không có tin tức nào"
              )
            }
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
              <AveragePriceByProduct/>
            </div>
          </section>
      </main>
      </div>
    </div>
  );
}
