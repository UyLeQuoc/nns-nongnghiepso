'use client'

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, ChevronDownIcon, ChevronUpIcon, PencilIcon, TrashIcon } from "lucide-react"
import agriculturalProductApi, { AgriculturalProduct, ProductType } from "@/apis/agriculturalProductApi"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function AgriculturalProductsManagementPage() {
  const [agriculturalProducts, setAgriculturalProducts] = useState<AgriculturalProduct[]>([])
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null)
  const [productTypes, setProductTypes] = useState<{ [key: number]: ProductType[] }>({})

  useEffect(() => {
    fetchAgriculturalProducts()
  }, [])

  const fetchAgriculturalProducts = async () => {
    const data = await agriculturalProductApi.getAll()
    setAgriculturalProducts(data)
  }

  const handleExpandProduct = async (productId: number) => {
    if (expandedProduct === productId) {
      setExpandedProduct(null)
    } else {
      if (!productTypes[productId]) {
        const types = await agriculturalProductApi.getProductTypesByAgriculturalProductId(productId)
        setProductTypes((prev) => ({ ...prev, [productId]: types }))
      }
      setExpandedProduct(productId)
    }
  }

  const handleDeleteProduct = async (id: number) => {
    await agriculturalProductApi.delete(id)
    toast({
      title: "Product deleted successfully",
      description: "The product has been deleted successfully",
    })
    fetchAgriculturalProducts()
  }

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <div className="flex items-center justify-between w-full gap-2 mb-6">
        <h2 className="text-2xl font-bold flex-1">Agricultural Products</h2>
        <Button variant="default">Create Product</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agriculturalProducts.map((product) => (
          <Card key={product.id} className="w-full">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{product.name}</span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleExpandProduct(product.id)}
                  >
                    {expandedProduct === product.id ? (
                      <ChevronUpIcon className="w-4 h-4" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {/* handleEditProduct(product) */}}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{product.description}</p>
              <p className="font-semibold">Price: ${product.beginPrice}</p>
              {expandedProduct === product.id && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Product Types</h3>
                  <ul className="space-y-2">
                    {productTypes[product.id]?.map((type) => (
                      <li key={type.id} className="bg-gray-100 p-2 rounded">
                        <p className="font-medium">{type.name}</p>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="w-[48%]">
                <PlusIcon className="w-4 h-4 mr-2" /> Add Item
              </Button>
              <Button variant="outline" className="w-[48%]">
                <PlusIcon className="w-4 h-4 mr-2" /> Add Mini Item
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}