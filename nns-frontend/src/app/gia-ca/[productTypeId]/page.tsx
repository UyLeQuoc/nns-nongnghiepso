"use client"

import BackgroundAnimation from '@/components/background-animation'
import NavBar from '@/components/nav-bar'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import agriculturalProductApi from '@/apis/agriculturalProductApi'
import { useToast } from "@/hooks/use-toast"
import { TrendingUp } from 'lucide-react'

interface PriceData {
  date: string
  [user: string]: number | string // Giá trị là số cho mỗi người dùng, hoặc là chuỗi cho `date`
}

export default function ProductTypePriceTrend({ params }: { params: { productTypeId: string } }) {
  const [chartData, setChartData] = useState<PriceData[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const data = await agriculturalProductApi.getDailyPricesForProductType(+params.productTypeId)
        setChartData(data)
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể lấy dữ liệu xu hướng giá. Vui lòng thử lại.",
          variant: "destructive",
        })
      }
    }

    fetchPriceData()
  }, [params.productTypeId])

  // Tạo cấu hình màu sắc cho từng người dùng
  const chartConfig: ChartConfig = chartData.length > 0
    ? Object.keys(chartData[0])
        .filter((key) => key !== "date")
        .reduce((acc, userName, index) => {
          acc[userName] = {
            label: userName,
            color: `hsl(${index * 45}, 70%, 60%)`, // màu sắc khác nhau cho mỗi người dùng
          }
          return acc
        }, {} as ChartConfig)
    : {}

  return (
    <div className="w-full overflow-x-hidden">
      <BackgroundAnimation />
      <div className="container mx-auto">
        <NavBar />
        <main className="container mx-auto py-12 px-2 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Biểu đồ xu hướng giá</CardTitle>
              <CardDescription>Xu hướng giá của sản phẩm theo từng người dùng</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <LineChart
                  width={800}
                  height={400}
                  data={chartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  {Object.keys(chartConfig).map((userName) => (
                    <Line
                      key={userName}
                      dataKey={userName}
                      type="monotone"
                      stroke={chartConfig[userName].color}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-start gap-2 text-sm">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 font-medium leading-none">
                    Tổng hợp xu hướng giá <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2 leading-none text-muted-foreground">
                    Dữ liệu từ nhiều người dùng cho sản phẩm này
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  )
}
