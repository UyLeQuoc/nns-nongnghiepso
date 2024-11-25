"use client";

import blogApi, { Blog } from "@/apis/blogApi";
import BackgroundAnimation from "@/components/background-animation";
import NavBar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Smartphone, Zap } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await blogApi.getAll();
      if (data) {
        setBlogs(data.slice(0, 4));
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full overflow-x-hidden">
      <BackgroundAnimation />
      <div className="container mx-auto">
        <NavBar />
        <main className="container mx-auto py-12 px-2">
          {/* Hero Section */}
          <section className="mb-4">
            <div className="text-center py-28 px-4">
              <h1 className="text-4xl md:text-6xl font-bold text-[#DCFFD7] mb-6">
                Thông Tin Giá Nông Sản Trực Tuyến
              </h1>
              <p className="text-xl md:text-2xl text-[#DCFFD7] mb-8 max-w-3xl mx-auto">
                Kết nối nông dân và đại lý, cung cấp thông tin giá cả nông sản cập nhật hàng ngày cho cà phê, chè và
                nhiều loại nông sản khác.
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  className="bg-[#FAFE44] text-[#0F4026] hover:bg-[#FAFE44] hover:opacity-60 px-6 py-3"
                  onClick={() => router.push("/chat")}
                >
                  Chat với AI
                </Button>
                <Button
                  className="bg-transparent border-2 border-[#DCFFD7] text-[#DCFFD7] hover:bg-[#DCFFD7] hover:text-[#0F4026] px-6 py-3"
                  onClick={() => router.push("/gia-ca")}
                >
                  Xem Giá Nông Sản
                </Button>
              </div>
            </div>
          </section>

          {/* mobile app showcase section */}
          <section className="py-16 relative overflow-hidden mb-10 rounded-md">
            <div className="absolute inset-0 bg-grid-[#0F4026]/[0.05] -z-10" />
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#DCFFD7]">
                    Ứng dụng Nông Nghiệp Số đã có trên Mobile
                  </h2>
                  <p className="text-lg text-[#DCFFD7]/80">
                    Trải nghiệm ứng dụng Nông Nghiệp Số ngay hôm nay để cập nhật giá cả nông sản nhanh chóng và tiện lợi! Tải ngay hoặc chờ đợi ứng dụng được phát hành chính thức trên các nền tảng Store.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a href="/app-nongnghiepso-android.apk" className="w-40">
                      <Image
                        src="/google-play-badge.png"
                        alt="Get it on Google Play"
                        width={646}
                        height={250}
                        className="w-full h-auto"
                      />
                    </a>
                    <a href="#" onClick={() => alert("Ứng dụng đã có. Sẽ sớm có mặt trên App Store")} className="w-40">
                      <Image
                        src="/app-store-badge.png"
                        alt="Download on the App Store"
                        width={646}
                        height={250}
                        className="w-full h-auto"
                      />
                    </a>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-6 h-6 text-[#DCFFD7]" />
                      <span className="text-sm text-[#DCFFD7]/80">Dễ sử dụng</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-6 h-6 text-[#DCFFD7]" />
                      <span className="text-sm text-[#DCFFD7]/80">Cập nhật nhanh</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Download className="w-6 h-6 text-[#DCFFD7]" />
                      <span className="text-sm text-[#DCFFD7]/80">Tải miễn phí</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <Image
                    src="/mockup.png"
                    alt="Nông Nghiệp Số App Mockup"
                    width={400}
                    height={800}
                    className="w-full h-auto max-w-sm mx-auto"
                  />
                </div>
              </div>
            </div>
          </section>


          {/* News Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between gap-2 mb-6">
              <h2 className="text-3xl font-bold text-[#DCFFD7]">Tin tức mới</h2>
              <Button
                className="bg-[#DCFFD7] text-[#0F4026] hover:bg-[#DCFFD7] hover:opacity-60"
                onClick={() => router.push("/blogs")}
              >
                Xem thêm
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-[#0F4026]">
              {loading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-[#DCFFD7] rounded-lg shadow-md overflow-hidden p-4"
                    >
                      <Skeleton className="w-full h-48 rounded-md mb-4" />
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  ))
                : blogs.length > 0 ? (
                    blogs.map((blog) => (
                      <div
                        key={blog.id}
                        className="bg-[#DCFFD7] rounded-lg shadow-md overflow-hidden"
                      >
                        <iframe
                          width="100%"
                          height="200"
                          src={blog.youtubeLink.replace("watch?v=", "embed/")}
                          title={blog.title}
                          allowFullScreen
                        />
                        <div className="p-4">
                          <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                          <p className="text-gray-500 mb-4">{blog.caption}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Không có tin tức nào</p>
                  )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
