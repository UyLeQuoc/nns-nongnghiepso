"use client";

import React, { useEffect, useState } from "react";
import BackgroundAnimation from "@/components/background-animation";
import NavBar from "@/components/nav-bar";
import agriculturalProductApi, { DailyPrice } from "@/apis/agriculturalProductApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { format } from "date-fns";

interface ProductTypeInfo {
  id: number;
  name: string;
  description: string;
}

interface UserInfo {
  userId: number;
  fullName: string;
  email: string;
  dob: string;
  phoneNumber: string;
  imageUrl: string;
  thumbnailUrl: string;
  description: string;
  address: string;
}

export default function ChartProductTypeOfUserPage({
  params,
}: {
  params: { agentId: string; productTypeId: string };
}) {
  const [chartData, setChartData] = useState<DailyPrice[]>([]);
  const [productType, setProductType] = useState<ProductTypeInfo | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { toast } = useToast();

  const fetchProductTypeInfo = async () => {
    try {
      const data = await agriculturalProductApi.getProductTypesByAgriculturalProductId(
        parseInt(params.productTypeId)
      );
      setProductType(data[0]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch product type info.",
        variant: "destructive",
      });
    }
  };

  const fetchUserInfo = async () => {
    try {
      const data = await agriculturalProductApi.getUserById(
        parseInt(params.agentId)
      );
      setUserInfo(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user info.",
        variant: "destructive",
      });
    }
  };

  const fetchChartData = async () => {
    try {
      const data = await agriculturalProductApi.getDailyPricesForUserProductType(
        parseInt(params.agentId),
        parseInt(params.productTypeId)
      );
      setChartData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch chart data.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProductTypeInfo();
    fetchUserInfo();
    fetchChartData();
  }, [params.agentId, params.productTypeId]);

  return (
    <div className="w-full overflow-x-hidden">
      <BackgroundAnimation />
      <div className="container mx-auto">
        <NavBar />
        <main className="container mx-auto py-12 px-2 pt-6">
          {userInfo && <UserInfoCard userInfo={userInfo} />}
          {productType && (
            <ProductTypeCard productType={productType} agentId={params.agentId} />
          )}
          <h2 className="text-3xl font-bold text-[#DCFFD7] mb-6 mt-8">Xu hướng giá</h2>
          <PriceTrendChart chartData={chartData} />
        </main>
      </div>
    </div>
  );
}

function UserInfoCard({ userInfo }: { userInfo: UserInfo | null }) {
  if (!userInfo) return null;

  return (
    <Card className="mb-8 overflow-hidden">
      <div className="flex-shrink-0 h-52 relative">
        <Image
          src={userInfo.thumbnailUrl}
          alt={userInfo.fullName}
          width={500}
          height={500}
          className="w-full h-full object-cover rounded-t-md"
        />
        <div className="absolute bottom-0 left-8 -mb-28 flex gap-4">
          <Image
            src={userInfo.imageUrl}
            alt={userInfo.fullName}
            width={170}
            height={170}
            className="rounded-full aspect-square object-cover border-[5px] border-white"
          />
          <div className="self-end py-3">
            <h2 className="text-3xl font-bold mb-2">{userInfo.fullName}</h2>
            <p className="text-gray-500">Số điện thoại: {userInfo.phoneNumber}</p>
            <p className="text-gray-500">Email: {userInfo.email}</p>
          </div>
        </div>
      </div>
      <CardContent className="flex items-center space-x-4 p-6">
        <div className="flex flex-col mt-24 gap-1">
          <h2 className="text-xl font-bold">Địa chỉ</h2>
          <p className="text-gray-500">{userInfo.address}</p>
          <h2 className="text-xl font-bold mt-2">Miêu tả đại lý</h2>
          <p className="text-gray-500">{userInfo.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductTypeCard({
  productType,
  agentId,
}: {
  productType: ProductTypeInfo;
  agentId: string;
}) {
  return (
    <Card className="overflow-hidden mb-8">
      <CardHeader>
        <CardTitle>{productType.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <p className="text-sm text-gray-600 mb-4">{productType.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <Link href={`/dai-ly/${agentId}/${productType.id}`}>
            <Button>Xem lịch sử giá</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function PriceTrendChart({ chartData }: { chartData: DailyPrice[] }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Biểu đồ xu hướng giá</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{ desktop: { label: "Giá", color: "hsl(var(--chart-1))" } }}>
          <AreaChart
            width={600}
            height={300}
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
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Area
              dataKey="price"
              type="linear"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
