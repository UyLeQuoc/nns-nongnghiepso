"use client";

import BackgroundAnimation from "@/components/background-animation";
import NavBar from "@/components/nav-bar";
import farmToolApi, { FarmTool } from "@/apis/farmToolApi";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const [farmTools, setFarmTools] = useState<FarmTool[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFarmTools = async () => {
      try {
        const data = await farmToolApi.getAll();
        setFarmTools(data);
      } catch (error) {
        console.error("Error fetching farm tools:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmTools();
  }, []);

  return (
    <div className="w-full overflow-x-hidden">
      <BackgroundAnimation />
      <div className="container mx-auto">
        <NavBar />
        <main className="container mx-auto py-12 px-2">
          <h2 className="text-3xl font-bold text-[#DCFFD7] mb-6">Vật dụng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="border rounded-lg shadow-lg">
                    <CardHeader>
                      <Skeleton className="w-full h-56 rounded" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                    <CardFooter className="flex items-center">
                      <Skeleton className="w-10 h-10 rounded-full mr-2" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-3/4 mb-1" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                      <Skeleton className="h-10 w-24 rounded" />
                    </CardFooter>
                  </Card>
                ))
              : farmTools.map((tool: any) => (
                  <Card key={tool.id} className="border rounded-lg shadow-lg">
                    <CardHeader>
                      <img
                        src={tool.imageUrl}
                        alt={tool.name}
                        className="w-full h-56 object-cover rounded"
                      />
                    </CardHeader>
                    <CardContent>
                      <h3 className="text-lg font-semibold mb-1">{tool.name}</h3>
                      <p className="text-sm text-gray-600">{tool.description}</p>
                      <p className="font-semibold">
                        Price: {formatVND(tool.price)}
                      </p>
                    </CardContent>
                    <CardFooter className="flex items-center">
                      {tool.user?.imageUrl && (
                        <img
                          src={tool.user.imageUrl}
                          alt={tool.user.fullName}
                          className="w-10 h-10 rounded-full mr-2"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{tool.user?.fullName}</p>
                        <p className="text-sm text-gray-500">{tool.user?.email}</p>
                      </div>
                      <Button
                        className="bg-[#DCFFD7] text-[#0F4026] hover:bg-[#DCFFD7] hover:opacity-60"
                        onClick={() => router.push(`/dai-ly/${tool.userId}`)}
                      >
                        Xem Đại Lý
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
          </div>
        </main>
      </div>
    </div>
  );
}
