"use client"

import blogApi, { Blog } from '@/apis/blogApi'
import BackgroundAnimation from '@/components/background-animation'
import NavBar from '@/components/nav-bar'
import { useEffect, useState } from 'react'

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const data = await blogApi.getAll();
    if(data) {
        setBlogs(data);
      }
  };
  return (
    <div className="w-full overflow-x-hidden">
      <BackgroundAnimation />
      <div className="container mx-auto">
      <NavBar />
      <main className="container mx-auto py-12 px-2">
        <section className="mb-12">
          <div className="flex items-center justify-between gap-2  mb-6">
            <h2 className="text-3xl font-bold text-[#DCFFD7]">Tin tức</h2>
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
                <span className='text-[#DCFFD7] font-bold'>Không có tin tức nào</span>
              )
            }
          </div>
        </section>
      </main>
      </div>
    </div>
  )
}
