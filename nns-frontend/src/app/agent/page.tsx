"use client"

import React, { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { fetchPreferencesByUserId, updateAgentProductPreference } from "@/apis/analystApi"
import axiosClient from "@/apis/axiosClient"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

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
  const [userPreferences, setUserPreferences] = useState<AgentProductPreferenceResponseDTO[]>([])
  const [userId, setUserId] = useState(0)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchPreferences = async () => {
    try {
      if(userId != 0) {
        const currentUserPreferences = await fetchPreferencesByUserId(userId)
        setUserPreferences(currentUserPreferences)
        setLoading(false)
      }
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
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    console.log(user)
    setUserId(user.userId)
    fetchPreferences()


  }, [userId])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    productTypeId: number,
    field: string
  ) => {
    setUserPreferences((prevState) =>
      prevState.map((pref) =>
        pref.productTypeId === productTypeId
          ? { ...pref, [field]: e.target.value }
          : pref
      )
    )
  }

  const handleUpdate = async (preference: AgentProductPreferenceResponseDTO) => {
    try {
      await updateAgentProductPreference(preference.userId, preference.productTypeId, {
        todayPrice: preference.todayPrice,
        description: preference.description,
      })
      toast({
        title: "Success",
        description: `Updated preference for ${preference.productType.name}`,
      })
      await fetchPreferences()

    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update preference for ${preference.productType.name}`,
        variant: "destructive",
      })
    }
  }

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

                <Input
                  type="number"
                  value={pref.todayPrice}
                  onChange={(e) => handleInputChange(e, pref.productTypeId, "todayPrice")}
                  placeholder="Todays Price"
                  className="mb-4"
                />

                <Input
                  type="text"
                  value={pref.description}
                  onChange={(e) => handleInputChange(e, pref.productTypeId, "description")}
                  placeholder="Description"
                  className="mb-4"
                />

                <Button onClick={() => handleUpdate(pref)} variant="default">
                  Update
                </Button>

                <OtherUserPreferences productTypeId={pref.productTypeId} />
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const OtherUserPreferences = ({ productTypeId }: { productTypeId: number }) => {
  const [loading, setLoading] = useState(true)
  const [otherUserPreferences, setOtherUserPreferences] = useState<AgentProductPreferenceResponseDTO[]>([])
  const { toast } = useToast()

  const fetchOtherUserPreferences = async () => {
    try {
      const data = await axiosClient.get("/api/product-types/" + productTypeId)
      setOtherUserPreferences(data.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching other users preferences:", error)
      setLoading(false)
      toast({
        title: "Error",
        description: "Failed to fetch other users preferences. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchOtherUserPreferences()
  }, [])

  return (
    <div id={`other-user-pref-${productTypeId}`} className="mt-4">
      <h2 className="text-2xl font-bold mb-2">Other Users Preferences</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {otherUserPreferences.map((pref) => (
            <Card key={pref.productTypeId + pref.userId} className="p-4 flex gap-2">
              <div>
                <h3 className="text-lg font-semibold">{pref.productType.name}</h3>
                <p className="text-sm">User: {pref.user?.fullName}</p>
                <p className="text-sm">Price: {pref.todayPrice} VND</p>
                <p className="text-sm">Description: {pref.description}</p>
                <div className="flex gap-2 items-center justify-center">
                  <img src={pref.user?.imageUrl} alt={pref.user?.fullName} className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{pref.user?.fullName}</h3>
                    <p className="text-sm text-gray-600 mb-4">{pref.user?.email}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Toaster />
    </div>
  )
}
