"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import React, { useState } from "react"
import { cn } from "@/lib/utils"
import NavBar from "@/components/nav-bar"
import BackgroundAnimation from "@/components/background-animation"

type PricingSwitchProps = {
  onSwitch: (value: string) => void
}

type PricingCardProps = {
  isYearly?: boolean
  title: string
  monthlyPrice?: number
  yearlyPrice?: number
  description: string
  features: string[]
  actionLabel: string
  popular?: boolean
  exclusive?: boolean
}

const PricingHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <section className="text-center text-white">
    <h2 className="text-3xl font-bold">{title}</h2>
    <p className="text-xl pt-1">{subtitle}</p>
    <br />
  </section>
)

const PricingSwitch = ({ onSwitch }: PricingSwitchProps) => (
  <Tabs defaultValue="0" className="w-40 mx-auto" onValueChange={onSwitch}>
    <TabsList className="py-6 px-2">
      <TabsTrigger value="0" className="text-base">
        Tháng
      </TabsTrigger>
      <TabsTrigger value="1" className="text-base">
        Năm
      </TabsTrigger>
    </TabsList>
  </Tabs>
)

const PricingCard = ({ isYearly, title, monthlyPrice, yearlyPrice, description, features, actionLabel, popular, exclusive }: PricingCardProps) => (
  <Card
    className={cn(`w-72 flex flex-col justify-between py-1 ${popular ? "border-[#2db134]  border-[3px]" : "border-zinc-700"} mx-auto sm:mx-0`, {
      "animate-background-shine bg-white dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] transition-colors":
        exclusive,
    })}>
    <div>
      <CardHeader className="pb-8 pt-4">
        {isYearly && yearlyPrice && monthlyPrice ? (
          <div className="flex justify-between">
            <CardTitle className="text-zinc-700 dark:text-zinc-300 text-lg">{title}</CardTitle>
            <div
              className={cn("px-2.5 rounded-xl h-fit text-sm py-1 bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white", {
                "bg-gradient-to-r from-orange-400 to-[#FAFE44] dark:text-black ": popular,
              })}>
              {monthlyPrice * 12 - yearlyPrice} VND
            </div>
          </div>
        ) : (
          <CardTitle className="text-zinc-700 dark:text-zinc-300 text-lg">{title}</CardTitle>
        )}
        <div className="flex gap-0.5">
          <h3 className="text-3xl font-bold">{yearlyPrice && isYearly ?  yearlyPrice + "VND" : monthlyPrice ? monthlyPrice  + "VND" : (monthlyPrice == 0 && yearlyPrice == 0) ? "Miễn Phí" : "Liên hệ"}</h3>
          <span className="flex flex-col justify-end text-sm mb-1">{yearlyPrice && isYearly ? "/năm" : monthlyPrice ? "/tháng" : null}</span>
        </div>
        <CardDescription className="pt-1.5 h-12">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {features.map((feature: string) => (
          <CheckItem key={feature} text={feature} />
        ))}
      </CardContent>
    </div>
    <CardFooter className="mt-2">
      <Button className="relative inline-flex w-full items-center justify-center rounded-md bg-[#FAFE44] text-black hover:bg-[#FAFE44] hover:opacity-65 dark:bg-white px-6 font-medium  dark:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
        <div className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b from-[#c7d2fe] to-[#8678f9] opacity-75 blur" />
        {actionLabel}
      </Button>
    </CardFooter>
  </Card>
)

const CheckItem = ({ text }: { text: string }) => (
  <div className="flex gap-2">
    <CheckCircle2 size={18} className="my-auto text-green-400" />
    <p className="pt-0.5 text-zinc-700 dark:text-zinc-300 text-sm">{text}</p>
  </div>
)

export default function Page() {
  const [isYearly, setIsYearly] = useState(false)
  const togglePricingPeriod = (value: string) => setIsYearly(parseInt(value) === 1)

  const plans = [
    {
      title: "Cơ bản",
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: "Cung cấp các thông tin cơ bản về giá cả nông sản",
      features: [
        "Cập nhật giá nông sản theo thời gian thực",
        "Dự báo xu hướng thị trường cơ bản",
        "Hỗ trợ kỹ thuật qua email"
      ],
      actionLabel: "Dùng miễn phí",
    },
    {
      title: "Nâng cao",
      monthlyPrice: 20000, // 150,000 VND per month
      yearlyPrice: 400000, // 1,500,000 VND per year
      description: "Phù hợp cho nông dân chuyên nghiệp và các đại lý nông sản",
      features: [
        "Phân tích thị trường chuyên sâu",
        "Tư vấn canh tác tối ưu hóa",
        "Hỗ trợ kỹ thuật qua điện thoại",
        "Báo cáo xu hướng tiêu thụ"
      ],
      actionLabel: "Đăng ký ngay",
      popular: true,
    },
    {
      title: "Doanh nghiệp",
      price: "Tùy chỉnh",
      description: "Hỗ trợ hạ tầng và các dịch vụ đặc biệt theo nhu cầu của doanh nghiệp lớn",
      features: [
        "Hỗ trợ cá nhân hóa các báo cáo",
        "Phân tích thị trường toàn diện",
        "Tư vấn chiến lược kinh doanh",
        "Quản lý dữ liệu nông sản doanh nghiệp"
      ],
      actionLabel: "Liên hệ tư vấn",
      exclusive: true,
    },
  ];

  return (
      <div className="w-full overflow-x-hidden">
      <BackgroundAnimation />
      <div className="container mx-auto">
        <NavBar />
        <main className="container mx-auto py-12 px-2">
            <PricingHeader title="Gói nâng cấp" subtitle="Chọn gói phân tích để giúp bạn tăng năng suất" />
            <PricingSwitch onSwitch={togglePricingPeriod} />
            <section className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8 mt-8">
                {plans.map((plan) => {
                return <PricingCard key={plan.title} {...plan} isYearly={isYearly} />
                })}
            </section>
        </main>
      </div>
    </div>
  )
}