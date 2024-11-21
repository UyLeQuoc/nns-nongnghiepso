"use client";

import blogApi, { Blog } from "@/apis/blogApi";
import BackgroundAnimation from "@/components/background-animation";
import NavBar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
          <section className="mb-12">
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
