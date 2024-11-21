import BackgroundAnimation from "@/components/background-animation";
import NavBar from "@/components/nav-bar";
import Image from "next/image";
import React from "react";

export default function AboutPage() {
  return (
    <div className="w-full overflow-x-hidden">
      <BackgroundAnimation />
      <div className="container mx-auto">
        <NavBar />
        <main className="container mx-auto py-12 px-4">
          {/* Section: About the Project */}
          <section className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#DCFFD7] mb-4">Về Dự Án NNS</h1>
            <p className="text-lg text-white">
              NNS là dự án khởi nghiệp với sứ mệnh mang lại sự đổi mới và hiệu quả cho ngành nông nghiệp Việt Nam. 
              Hành trình của chúng tôi là câu chuyện về sự kiên trì, những bài học từ thất bại, và niềm tin rằng 
              ý tưởng khởi nghiệp có thể thay đổi cuộc sống.
            </p>
          </section>

          {/* Section: Team Members */}
          <section className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#DCFFD7] mb-6">Thành Viên Nhóm</h2>
            <div className="flex flex-wrap justify-center gap-8">
              {[
                {
                  name: "Đỗ Văn Hoàng Anh",
                  role: "FOUNDER",
                  description: "Trí tuệ nhân tạo - FPTU",
                  image: "/1.jpg",
                },
                {
                  name: "Kiều Thị Phương Trinh",
                  role: "CO-FOUNDER",
                  description: "Kinh doanh quốc tế - UEH",
                  image: "/2.jpg",
                },
                {
                  name: "Lê Quốc Uy",
                  role: "CO-FOUNDER",
                  description: "Kỹ thuật phần mềm - FPTU",
                  image: "/3.jpg",
                },
                {
                  name: "Võ Trần Vĩ Thảo",
                  role: "CO-FOUNDER",
                  description: "Tài chính - Ngân hàng - SGU",
                  image: "/4.jpg",
                },
              ].map((member, index) => (
                <div key={index} className="text-center">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={150}
                    height={150}
                    className="rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold text-[#FAFE44]">{member.name}</h3>
                  <p className="text-md font-medium text-gray-300">{member.role}</p>
                  <p className="text-sm text-white">{member.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Founder Talk */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-[#DCFFD7] mb-6">Hành Trình NNS</h2>
            <p className="text-lg text-white mb-4 leading-relaxed">
              Xin chào mọi người! Mình là <strong>Hoàng Anh</strong>, là founder của dự án NNS. Hiện tại, mình
              là sinh viên năm nhất trường đại học FPT. Thật may mắn vì dự án của tụi mình đã lọt vào chung kết
              một trong những cuộc thi khởi nghiệp lớn nhất của UEH. Hành trình tạo ra NNS là một câu chuyện đầy cảm hứng...
            </p>
            <p className="text-lg text-white mb-4 leading-relaxed">
              <strong>Khởi đầu</strong> của NNS cách đây 2 năm khi mình còn là học sinh lớp 11. Lúc ấy, mặc dù kinh nghiệm chưa
              nhiều, nhưng mình và người đồng sáng lập đầu tiên đã dành hàng chục tiếng mỗi ngày để xây dựng bản MVP
              đầu tiên. Thế nhưng, những khó khăn và thất bại ban đầu đã dạy cho mình rất nhiều bài học quý giá...
            </p>
            <p className="text-lg text-white leading-relaxed">
              Đến hôm nay, đội ngũ NNS tự hào vì đã không ngừng cố gắng, vượt qua vô số thất bại để mang dự án của
              chúng mình đến được với nhiều người hơn. Chúng mình hy vọng rằng NNS sẽ không chỉ giúp ngành nông nghiệp
              Việt Nam phát triển, mà còn truyền cảm hứng cho các bạn trẻ đang ấp ủ giấc mơ khởi nghiệp!
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
