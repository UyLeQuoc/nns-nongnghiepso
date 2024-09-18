'use client'

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react"
import agriculturalProductApi, { AgriculturalProduct, ProductType } from "@/apis/agriculturalProductApi"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { uploadImage } from "@/lib/firebase"
import productTypeApi from "@/apis/productTypeApi"

export default function AgriculturalProductsManagementPage() {
  const [agriculturalProducts, setAgriculturalProducts] = useState<AgriculturalProduct[]>([])
  const [selectedProduct, setSelectedProduct] = useState<AgriculturalProduct | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    beginPrice: 0,
  })
  const [imageFile, setImageFile] = useState<File | null>(null) // Quản lý file ảnh
  const [imagePreview, setImagePreview] = useState<string | null>(null) // Xem trước ảnh

  // State cho ProductType CRUD
  const [selectedProductType, setSelectedProductType] = useState<ProductType | null>(null)
  const [openProductTypeDialog, setOpenProductTypeDialog] = useState(false)

  useEffect(() => {
    fetchAgriculturalProducts()
  }, [])

  const fetchAgriculturalProducts = async () => {
    const data = await agriculturalProductApi.getAll()
    setAgriculturalProducts(data)
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
    setOpenProductTypeDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenProductTypeDialog(false)
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
      } catch (error: any) {
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

  // Mở dialog để chỉnh sửa ProductType
  const handleOpenProductTypeDialog = (productType: ProductType | null = null) => {
    setSelectedProductType(productType)
    setOpenProductTypeDialog(true)
  }

  // Lưu ProductType
  const handleSaveProductType = async () => {
    if (selectedProductType) {
      // Update ProductType
      await productTypeApi.update(selectedProductType.id, selectedProductType)
      toast({
        title: "Product Type updated successfully",
        description: "The product type has been updated successfully",
      })
    } else {
      // Create new ProductType
      await productTypeApi.create({
        name: selectedProductType!.name || "",
        description: selectedProductType!.description || "",
        agriculturalProductId: selectedProduct?.id || 0,
      })
      toast({
        title: "Product Type created successfully",
        description: "The product type has been created successfully",
      })
    }
    setOpenProductTypeDialog(false)
    if (selectedProduct) fetchAgriculturalProducts() // Cập nhật danh sách sản phẩm
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

              {/* Hiển thị tất cả Product Types */}
              <h3 className="text-lg font-semibold mb-2 mt-4">Product Types</h3>
              <ul className="space-y-2">
                {product?.productTypes?.map((type) => (
                  <li key={type.id} className="bg-gray-100 p-2 rounded flex justify-between">
                    <div>
                      <p className="font-medium">{type.name}</p>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenProductTypeDialog(type)}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={async () => {
                          await productTypeApi.delete(type.id)
                          toast({
                            title: "Product Type deleted",
                            description: "The product type has been deleted successfully",
                          })
                          fetchAgriculturalProducts() // Cập nhật danh sách sản phẩm
                        }}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenProductTypeDialog(null)}
                className="mt-4"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Product Type
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog for creating/updating AgriculturalProduct */}
      <Dialog open={openProductTypeDialog} onOpenChange={setOpenProductTypeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProductType ? "Update Product Type" : "Create Product Type"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input
              id="name"
              name="name"
              value={selectedProductType?.name || ""}
              onChange={(e) => setSelectedProductType({ ...selectedProductType!, name: e.target.value })}
              placeholder="Enter product type name"
              className="w-full"
            />
            <Input
              id="description"
              name="description"
              value={selectedProductType?.description || ""}
              onChange={(e) => setSelectedProductType({ ...selectedProductType!, description: e.target.value })}
              placeholder="Enter product type description"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenProductTypeDialog(false)}>Cancel</Button>
            <Button variant="default" onClick={handleSaveProductType}>
              {selectedProductType ? "Update Product Type" : "Create Product Type"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
