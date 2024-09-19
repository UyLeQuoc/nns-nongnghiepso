'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ProductType {
  id: number
  name: string
}

interface AgriculturalProduct {
  id: number
  name: string
  productTypes: ProductType[]
}

const initialProductPreference = { productTypeId: '', description: '' }

export default function AgentSignupForm() {
  const [agentData, setAgentData] = useState({
    email: '',
    fullName: '',
    dob: '',
    phoneNumber: '',
    imageUrl: '',
    thumbnailUrl: '',
    description: '',
    address: '',
    password: '',
    agentProductPreferenceCreateDTOs: [initialProductPreference],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [agriculturalProducts, setAgriculturalProducts] = useState<AgriculturalProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://nongnghiepso.uydev.id.vn/AgriculturalProduct')
        setAgriculturalProducts(response.data)
      } catch (error) {
        setError('Failed to fetch agricultural products')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAgentData({ ...agentData, [name]: value })
  }

  const handleProductPreferenceChange = (index: number, field: string, value: string) => {
    const updatedPreferences = [...agentData.agentProductPreferenceCreateDTOs]
    updatedPreferences[index] = { ...updatedPreferences[index], [field]: value }
    setAgentData({ ...agentData, agentProductPreferenceCreateDTOs: updatedPreferences })
  }

  const addProductPreference = () => {
    setAgentData({
      ...agentData,
      agentProductPreferenceCreateDTOs: [...agentData.agentProductPreferenceCreateDTOs, initialProductPreference],
    })
  }

  const removeProductPreference = (index: number) => {
    const updatedPreferences = agentData.agentProductPreferenceCreateDTOs.filter((_, i) => i !== index)
    setAgentData({ ...agentData, agentProductPreferenceCreateDTOs: updatedPreferences })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await axios.post('/api/User/signup-agent', agentData)
      console.log('Agent created:', response.data)
      alert('Agent created successfully!')
    } catch (error: any) {
      setError(error.response ? error.response.data.message : 'An error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="text-center">Loading...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Agent Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
          <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" name="email" value={agentData.email} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" type="text" name="fullName" value={agentData.fullName} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" name="dob" value={agentData.dob} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" type="text" name="phoneNumber" value={agentData.phoneNumber} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input id="imageUrl" type="text" name="imageUrl" value={agentData.imageUrl} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
              <Input id="thumbnailUrl" type="text" name="thumbnailUrl" value={agentData.thumbnailUrl} onChange={handleInputChange} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={agentData.description} onChange={handleInputChange} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" type="text" name="address" value={agentData.address} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" name="password" value={agentData.password} onChange={handleInputChange} required />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Product Type Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {agentData.agentProductPreferenceCreateDTOs.map((preference, index) => (
              <Card key={index}>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`productTypeId-${index}`}>Product Type</Label>
                    <Select
                      onValueChange={(value) => handleProductPreferenceChange(index, 'productTypeId', value)}
                      value={preference.productTypeId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product type" />
                      </SelectTrigger>
                      <SelectContent>
                        {agriculturalProducts.flatMap((product) =>
                          product.productTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {product.name} - {type.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`preferenceDescription-${index}`}>Description</Label>
                    <Input
                      id={`preferenceDescription-${index}`}
                      type="text"
                      value={preference.description}
                      onChange={(e) => handleProductPreferenceChange(index, 'description', e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeProductPreference(index)}
                    className="w-full"
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Button type="button" onClick={addProductPreference} variant="outline" className="w-full">
              Add Another Product Preference
            </Button>
          </CardContent>
        </Card>
      </div>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      <Button type="submit" disabled={isSubmitting} className="w-full mt-6">
        {isSubmitting ? 'Submitting...' : 'Signup'}
      </Button>
    </form>
  )
}