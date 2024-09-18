'use client'

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, ChevronDownIcon, ChevronUpIcon, PencilIcon, TrashIcon } from "lucide-react"
import agriculturalProductApi, { AgriculturalProduct, ProductType } from "@/apis/agriculturalProductApi"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { uploadImage } from "@/lib/firebase"

export default function AgriculturalProductsManagementPage() {
  const [agriculturalProducts, setAgriculturalProducts] = useState<AgriculturalProduct[]>([])
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null)
  const [productTypes, setProductTypes] = useState<{ [key: number]: ProductType[] }>({})
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<AgriculturalProduct | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    beginPrice: 0,
  })
  const [imageFile, setImageFile] = useState<File | null>(null) // Quản lý file ảnh
  const [imagePreview, setImagePreview] = useState<string | null>(null) // Xem trước ảnh

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

  const handleOpenDialog = (product: AgriculturalProduct | null = null) => {
    setSelectedProduct(product)
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        beginPrice: product.beginPrice,
      })
      setImagePreview(product.imageUrl) // Hiển thị ảnh hiện tại
    } else {
      setFormData({ name: "", description: "", imageUrl: "", beginPrice: 0 })
      setImagePreview(null) // Xóa ảnh preview khi tạo mới
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setImagePreview(null) // Xóa ảnh preview khi đóng dialog
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file)) // Hiển thị preview ảnh
    }
  }

  const handleSaveProduct = async () => {
    let imageUrl = formData.imageUrl

    // Nếu người dùng đã chọn file ảnh, tiến hành upload
    if (imageFile) {
      try {
        imageUrl = await uploadImage(imageFile) // Upload ảnh lên Firebase và lấy URL
        toast({
          title: "Image uploaded successfully",
          description: "The image has been uploaded successfully",
        })
      } catch (error:any) {
        toast({
          title: "Image upload failed",
          description: error.message,
        })
        return
      }
    }

    if (selectedProduct) {
      // Update product
      await agriculturalProductApi.update(selectedProduct.id, {
        ...formData,
        imageUrl,
        createdAt: new Date().toUTCString()
      })
      toast({
        title: "Product updated successfully",
        description: "The product has been updated successfully",
      })
    } else {
      // Create new product
      await agriculturalProductApi.create({
        ...formData,
        imageUrl,
        createdAt: new Date().toUTCString()
      })
      toast({
        title: "Product created successfully",
        description: "The product has been created successfully",
      })
    }

    handleCloseDialog()
    fetchAgriculturalProducts()
  }

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <div className="flex items-center justify-between w-full gap-2 mb-6">
        <h2 className="text-2xl font-bold flex-1">Agricultural Products</h2>
        <Button variant="default" onClick={() => handleOpenDialog(null)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          <span>Create Agricultural Product</span>
        </Button>
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
                    onClick={() => handleOpenDialog(product)}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {product.imageUrl && (
                <img src={product.imageUrl} alt={product.name} className="mb-4 w-full h-40 object-cover rounded-sm" />
              )}
              <p className="text-sm text-gray-600 mb-2">{product.description}</p>
              <p className="font-semibold">Price: {product.beginPrice} VND/Kg</p>
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
              <Button variant="outline">
                <PlusIcon className="w-4 h-4 mr-2" />
                <span>Add Product Type</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Dialog for creating/updating products */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProduct ? "Update Product" : "Create Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="Enter product name"
              className="w-full"
            />
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Enter product description"
              className="w-full"
            />
            <Input
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              placeholder="Enter image URL"
              className="w-full hidden"
              readOnly
            />
            <Input
              id="imageFile"
              type="file"
              onChange={handleImageChange} // Bắt sự kiện chọn file
              className="w-full"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-4 w-full h-40 object-cover" />
            )}
            <Input
              id="beginPrice"
              name="beginPrice"
              type="number"
              value={formData.beginPrice}
              onChange={handleFormChange}
              placeholder="Enter price per Kg"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button variant="default" onClick={handleSaveProduct}>
              {selectedProduct ? "Update Product" : "Create Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
