"use client"

import { fetchPreferencesByUserId } from "@/apis/analystApi"
import { getUserById } from "@/apis/userApi"
import BackgroundAnimation from "@/components/background-animation"
import NavBar from "@/components/nav-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface ProductType {
  id: number
  name: string
  description: string
}

interface AgentProductPreferenceResponseDTO {
  userId: number
  productTypeId: number
  description: string
  todayPrice: number
  createdAt: string
  updatedAt: string
  productType: ProductType
  user?: any
}

interface UserInfo {
  userId: number
  fullName: string
  email: string
  dob: string
  phoneNumber: string
  imageUrl: string
  thumbnailUrl: string
  description: string
  address: string
}

export default function AgentProductPreferences({ params }: { params: { agentId: string } }) {
  const router = useRouter()
  const [userPreferences, setUserPreferences] = useState<AgentProductPreferenceResponseDTO[]>([])
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchPreferences = async () => {
    try {
      const currentUserPreferences = await fetchPreferencesByUserId(+params.agentId)
      setUserPreferences(currentUserPreferences)
    } catch (error) {
      console.error("Error fetching preferences:", error)
      toast({
        title: "Error",
        description: "Failed to fetch preferences. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchUserInfo = async () => {
    try {
      const data = await getUserById(+params.agentId)
      setUserInfo(data)
    } catch (error) {
      console.error("Error fetching user info:", error)
      toast({
        title: "Error",
        description: "Failed to fetch user information. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    Promise.all([fetchPreferences(), fetchUserInfo()]).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <LoadingSkeleton />
  }

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
          <PreferenceCard key={pref.productTypeId} preference={pref} />
        ))}
      </div>
      </main>

    </div>
    </div>
  )
}

function UserInfoCard({ userInfo }: { userInfo: UserInfo | null }) {
  if (!userInfo) return null

  return (
    <Card>
      <div className=" flex-shrink-0 h-52 relative">
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
          <div className="self-end py-4">
            <h2 className="text-3xl font-bold mb-2">{userInfo.fullName}</h2>
            <p className="text-gray-500">Số điện thoại: {userInfo.phoneNumber}</p>
            <p className="text-gray-500">Email: {userInfo.email}</p>
          </div>
        </div>
      </div>
      <CardContent className="flex items-center space-x-4 p-6">
        <div className="flex flex-col mt-24 gap-1">
          <h2 className="text-xl font-bold">Địa chỉ</h2>
          <p className="text-gray-500">
            {userInfo.address}
          </p>
          <h2 className="text-xl font-bold mt-2">Miêu tả đại lý</h2>
          <p className="text-gray-500">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptate doloribus, deleniti necessitatibus, quibusdam cumque error aliquid similique velit repellat officiis minus vel asperiores eius assumenda laboriosam dignissimos. Adipisci, rem suscipit?
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function PreferenceCard({ preference }: { preference: AgentProductPreferenceResponseDTO }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{preference.productType.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-2">{preference.productType.description}</p>
        <p className="font-semibold">Today's Price: ${preference.todayPrice.toFixed(2)}</p>
        <p className="mt-2">{preference.description}</p>
      </CardContent>
    </Card>
  )
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
  )
}