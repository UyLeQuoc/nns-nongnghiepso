"use client";

import { fetchPreferencesByUserId, fetchPriceDifferencesByUserId } from "@/apis/analystApi";
import { getUserById } from "@/apis/userApi";
import BackgroundAnimation from "@/components/background-animation";
import NavBar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ArrowDown, ArrowUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ProductType {
  id: number;
  name: string;
  description: string;
}

interface AgentProductPreferenceResponseDTO {
  userId: number;
  productTypeId: number;
  description: string;
  todayPrice: number;
  createdAt: string;
  updatedAt: string;
  productType: ProductType;
  yesterdayPrice: number;
  priceDifference: number;
  agentProductPreference: any;
}

interface UserInfo {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  imageUrl: string;
  thumbnailUrl: string;
  address: string;
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardContent className="flex items-center space-x-4 p-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </CardContent>
      </Card>
      <Skeleton className="h-8 w-[300px]" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function ClientAgentProductPreferences({ params }: { params: { agentId: string } }) {
  const [userPreferences, setUserPreferences] = useState<AgentProductPreferenceResponseDTO[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [preferences, user] = await Promise.all([
          fetchPriceDifferencesByUserId(+params.agentId),
          getUserById(+params.agentId),
        ]);
        setUserPreferences(preferences);
        setUserInfo(user);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.agentId, toast]);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="w-full overflow-x-hidden">
      <BackgroundAnimation />
      <div className="container mx-auto">
        <NavBar />
        <main className="container mx-auto py-12 px-2 pt-6">
          <UserInfoCard userInfo={userInfo} />
          <h2 className="text-3xl font-bold text-[#DCFFD7] mb-6 mt-8">Nông sản kinh doanh</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPreferences.map((pref) => (
              <PreferenceCard key={pref.productTypeId} preference={pref} agentId={params.agentId} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function UserInfoCard({ userInfo }: { userInfo: UserInfo | null }) {
  if (!userInfo) return null;

  return (
    <Card>
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
            className="rounded-full object-cover border-[5px] border-white"
          />
          <div className="self-end py-3">
            <h2 className="text-3xl font-bold mb-2">{userInfo.fullName}</h2>
            <p className="text-gray-500">Số điện thoại: {userInfo.phoneNumber}</p>
            <p className="text-gray-500">Email: {userInfo.email}</p>
          </div>
        </div>
      </div>
      <CardContent className="flex flex-col mt-24 gap-1">
        <h2 className="text-xl font-bold">Địa chỉ</h2>
        <p className="text-gray-500">{userInfo.address}</p>
      </CardContent>
    </Card>
  );
}

function PreferenceCard({ preference, agentId }: { preference: AgentProductPreferenceResponseDTO; agentId: string }) {
  const isPriceIncreased = preference.priceDifference > 0;
  const isPriceDecreased = preference.priceDifference < 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{preference.productType.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <p className="text-sm text-gray-600 mb-4">{preference.productType.description}</p>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Giá hôm nay:</span>
            <span className="text-lg font-bold">{preference.todayPrice.toLocaleString()} VND</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Giá hôm qua:</span>
            <span className="text-lg font-semibold text-gray-600">{preference.yesterdayPrice.toLocaleString()} VND</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Chênh lệch giá:</span>
            <span
              className={`text-lg font-bold flex items-center ${
                isPriceIncreased ? "text-green-600" : isPriceDecreased ? "text-red-600" : "text-gray-600"
              }`}
            >
              {isPriceIncreased && <ArrowUp className="w-4 h-4 mr-1" />}
              {isPriceDecreased && <ArrowDown className="w-4 h-4 mr-1" />}
              {preference.priceDifference >= 0 ? "+" : ""}
              {preference.priceDifference.toLocaleString()} VND
            </span>

            
          </div>
          <div className="mt-4 flex items-center justify-between">
                <Link href={`/dai-ly/${agentId}/${preference.productTypeId}`}>
                    <Button>Xem lịch sử giá</Button>
                </Link>
                <p className="text-xs text-gray-500">
                    Cập nhật lần cuối: {format(new Date(preference?.agentProductPreference?.updatedAt), "dd/MM/yyyy HH:mm")}
                </p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
