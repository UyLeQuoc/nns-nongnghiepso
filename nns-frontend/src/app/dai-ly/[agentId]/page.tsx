"use client"

import { fetchPreferencesByUserId } from "@/apis/analystApi"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
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

export default function AgentProductPreferences() {
  const router = useRouter()
  const [userPreferences, setUserPreferences] = useState<AgentProductPreferenceResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchPreferences = async () => {
    try {
      const currentUserPreferences = await fetchPreferencesByUserId(2)
      console.log(currentUserPreferences)
      setUserPreferences(currentUserPreferences)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching preferences:", error)
      setLoading(false)
      toast({
        title: "Error",
        description: "Failed to fetch preferences. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchPreferences()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Your Product Preferences</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {userPreferences.map((pref) => (
              <Card key={pref.productTypeId} className="p-4">
                <h3 className="text-lg font-semibold">{pref.productType.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{pref.productType.description}</p>
                <h3>{pref.todayPrice}</h3>
                <p>{pref.description}</p>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
