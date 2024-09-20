"use client"

import React, { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { fetchDailyAveragePrice } from "@/apis/analystApi"

export function DailyAveragePriceChart({ productTypeId }:{
    productTypeId : number
}) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the chart data
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDailyAveragePrice(productTypeId);
        setChartData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    loadData();
  }, [productTypeId]);

  const chartConfig = {
    averagePrice: {
      label: "Average Price",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Average Price Chart</CardTitle>
        <CardDescription>
          Showing the average price of the product type for each day
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="averagePrice"
                stroke={chartConfig.averagePrice.color}
                fillOpacity={0.3}
                fill={chartConfig.averagePrice.color}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
