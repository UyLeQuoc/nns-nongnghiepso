"use client";

import React, { useEffect, useState } from "react";
import BackgroundAnimation from "@/components/background-animation";
import NavBar from "@/components/nav-bar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import agriculturalProductApi from "@/apis/agriculturalProductApi";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp } from "lucide-react";

interface PriceData {
  date: string;
  [user: string]: number | string; // Values are numbers for users, strings for `date`
}

export default function ProductTypePriceTrend({
  params,
}: {
  params: { productTypeId: string };
}) {
  const [chartData, setChartData] = useState<PriceData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const data = await agriculturalProductApi.getDailyPricesForProductType(
          +params.productTypeId
        );
        setChartData(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Unable to fetch price trend data. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchPriceData();
  }, [params.productTypeId]);

  // Create chart configuration for different users
  const chartConfig: ChartConfig =
    chartData.length > 0
      ? Object.keys(chartData[0])
          .filter((key) => key !== "date")
          .reduce((acc, userName, index) => {
            acc[userName] = {
              label: userName,
              color: `hsl(${index * 45}, 70%, 60%)`, // Generate unique colors for each user
            };
            return acc;
          }, {} as ChartConfig)
      : {};

  return (
    <div className="w-full overflow-x-hidden">
      <BackgroundAnimation />
      <div className="container mx-auto">
        <NavBar />
        <main className="container mx-auto py-12 px-2 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Price Trend Chart</CardTitle>
              <CardDescription>
                The price trend of the product by different users
              </CardDescription>
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
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString()
                    }
                  />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
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
                    Price Trend Summary <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2 leading-none text-muted-foreground">
                    Data from multiple users for this product
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  );
}
