'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import BackgroundAnimation from '@/components/background-animation'
import NavBar from '@/components/nav-bar'
import Image from 'next/image'
import { uploadImage } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

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

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [agriculturalProducts, setAgriculturalProducts] = useState<AgriculturalProduct[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const router = useRouter()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://nns-api.uydev.id.vn/AgriculturalProduct')
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

  // Handle file input change for image uploads
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      try {
        const imageUrl = await uploadImage(file) // Upload image and get the URL
        setAgentData({ ...agentData, [field]: imageUrl })

        // Preview the image
        const previewUrl = URL.createObjectURL(file)
        if (field === 'imageUrl') setImagePreview(previewUrl)
        if (field === 'thumbnailUrl') setThumbnailPreview(previewUrl)
      } catch (uploadError) {
        setError('Failed to upload image')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await axios.post(`https://nns-api.uydev.id.vn/api/User/signup-agent`, agentData)
      console.log('Agent created:', response.data)
      alert('Agent created successfully!')
      router.push('/login')
    } catch (error: any) {
      setError(error.response ? error.response.data.message : 'An error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <BackgroundAnimation />
      <div className='container mx-auto'>
        <NavBar />
      </div>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full mx-auto container p-4">
          <ProfileHeader imagePreview={imagePreview} thumbnailPreview={thumbnailPreview} />
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
                  <Label htmlFor="imageUrl">Profile Picture</Label>
                  <Input id="imageUrl" type="file" onChange={(e) => handleFileChange(e, 'imageUrl')} />
                  {imagePreview && <img src={imagePreview} alt="Profile Preview" className="mt-2 w-32 h-32 object-cover" />}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnailUrl">Thumbnail Image</Label>
                  <Input id="thumbnailUrl" type="file" onChange={(e) => handleFileChange(e, 'thumbnailUrl')} />
                  {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail Preview" className="mt-2 w-32 h-32 object-cover" />}
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

          <Button type="submit" disabled={isSubmitting} className="w-full mt-6 bg-[#FAFE44] text-[#0F4026] hover:bg-[#FAFE44] hover:opacity-60">
            {isSubmitting ? 'Submitting...' : 'Signup'}
          </Button>
        </form>
      )}
    </div>
  )
}

function ProfileHeader({ imagePreview, thumbnailPreview }: { imagePreview: string | null, thumbnailPreview: string | null }) {
  return (
    <Card className="relative w-full overflow-hidden mb-6">
      <div className="relative max-h-[200px] overflow-hidden bg-center">
        {thumbnailPreview ? (
          <img src={thumbnailPreview} alt="Thumbnail Preview" className="object-cover w-full h-full" />
        ) : (
          <Image
            src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
            alt="Wireframe heart background"
            width={1200}
            height={300}
            className="object-cover w-full h-full"
          />
        )}
      </div>
      <div className="relative z-10 p-6 flex items-start">
        <div className='mr-4'>
          {imagePreview ? (
            <img src={imagePreview} alt="Profile Preview" className="rounded-full h-32 w-32 object-cover" />
          ) : (
            <Image
              src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
              alt="Profile picture"
              width={100}
              height={100}
              className="rounded-full aspect-square h-full w-full object-cover"
            />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">Lê Quốc Uy</h1>
          <p className="text-sm text-gray-700">Email: lequocuyit@gmail.com</p>
          <p className="text-sm text-gray-700">Phone Number: 090909090</p>
          <p className="mt-2 text-sm max-w-2xl">
            Description
          </p>
        </div>
      </div>
    </Card>
  )
}
