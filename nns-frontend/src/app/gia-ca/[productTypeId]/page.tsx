"use client"

import React, { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import agriculturalProductApi, { DailyPrice } from "@/apis/agriculturalProductApi"
import { useToast } from "@/hooks/use-toast"

interface UserPriceData {
  userName: string
  prices: DailyPrice[]
}

export default function ProductTypePriceTrend({
  params,
}: {
  params: {
    productTypeId: string
  }
}) {
  const [chartData, setChartData] = useState<any[]>([])
  const { toast } = useToast()

  // Fetch dữ liệu biểu đồ
  const fetchPriceTrendData = async () => {
    try {
      const data = await agriculturalProductApi.getDailyPricesForProductType(parseInt(params.productTypeId))
      setChartData(data)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể lấy dữ liệu xu hướng giá. Vui lòng thử lại.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchPriceTrendData()
  }, [params.productTypeId])

  // Tạo cấu hình màu sắc cho từng người dùng
  const chartConfig: ChartConfig = chartData.reduce((acc, userPriceData, index) => {
    acc[userPriceData.userName] = {
      label: userPriceData.userName,
      color: `hsl(${index * 45}, 70%, 60%)`, // Tạo màu khác nhau cho mỗi người dùng
    }
    return acc
  }, {} as ChartConfig)

  // Xử lý dữ liệu biểu đồ cho định dạng LineChart
  const processedChartData = chartData[0]?.prices.map((_:any, i:any) => {
    const date = chartData[0]?.prices[i].date
    return {
      date,
      ...chartData.reduce((acc, userPriceData) => {
        acc[userPriceData.userName] = userPriceData.prices[i]?.price ?? 0
        return acc
      }, {} as Record<string, number>)
    }
  })

  return (
    <div className="w-full overflow-x-hidden">
      <Card className="container mx-auto">
        <CardHeader>
          <CardTitle>Biểu đồ xu hướng giá</CardTitle>
          <CardDescription>Xu hướng giá của sản phẩm theo từng người dùng</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              width={800}
              height={400}
              data={processedChartData}
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
              {chartData.map((userPriceData) => (
                <Line
                  key={userPriceData.userName}
                  dataKey={userPriceData.userName}
                  type="monotone"
                  stroke={chartConfig[userPriceData.userName].color}
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
    </div>
  )
}
