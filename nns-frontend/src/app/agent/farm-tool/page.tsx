'use client'

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react"
import farmToolApi, { FarmTool } from "@/apis/farmToolApi"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { uploadImage } from "@/lib/firebase"

export default function FarmToolManagementPage() {
  const [farmTools, setFarmTools] = useState<FarmTool[]>([])
  const [selectedTool, setSelectedTool] = useState<FarmTool | null>(null)
  const [toolFormData, setToolFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    price: 0,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [openToolDialog, setOpenToolDialog] = useState(false)

  useEffect(() => {
    fetchFarmTools()
  }, [])

  const fetchFarmTools = async () => {
    const data = await farmToolApi.getByUserId(JSON.parse(localStorage.getItem("user") || '{}').userId)
    setFarmTools(data)
  }

  const handleDeleteTool = async (id: number) => {
    await farmToolApi.delete(id)
    toast({
      title: "Tool deleted successfully",
      description: "The tool has been deleted successfully",
    })
    fetchFarmTools()
  }

  const handleOpenToolDialog = (tool: FarmTool | null = null) => {
    setSelectedTool(tool)
    if (tool) {
      setToolFormData({
        name: tool.name,
        description: tool.description,
        imageUrl: tool.imageUrl,
        price: tool.price,
      })
      setImagePreview(tool.imageUrl)
    } else {
      setToolFormData({ name: "", description: "", imageUrl: "", price: 0 })
      setImagePreview(null)
    }
    setOpenToolDialog(true)
  }

  const handleCloseToolDialog = () => {
    setOpenToolDialog(false)
    setImagePreview(null)
  }

  const handleToolFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setToolFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSaveTool = async () => {
    let imageUrl = toolFormData.imageUrl

    if (imageFile) {
      try {
        imageUrl = await uploadImage(imageFile)
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

    if (selectedTool) {
      await farmToolApi.update(selectedTool.id, {
        ...toolFormData,
        imageUrl,
        createdAt: selectedTool.createdAt,
        userId: JSON.parse(localStorage.getItem("user") || '{}').userId,
      })
      toast({
        title: "Tool updated successfully",
        description: "The tool has been updated successfully",
      })
    } else {
      await farmToolApi.create({
        ...toolFormData,
        imageUrl,
        userId: JSON.parse(localStorage.getItem("user") || '{}').userId,
        createdAt: new Date().toISOString(),
      })
      toast({
        title: "Tool created successfully",
        description: "The tool has been created successfully",
      })
    }

    handleCloseToolDialog()
    fetchFarmTools()
  }

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <div className="flex items-center justify-between w-full gap-2 mb-6">
        <h2 className="text-2xl font-bold flex-1">Farm Tools</h2>
        <Button variant="default" onClick={() => handleOpenToolDialog(null)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          <span>Create Farm Tool</span>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farmTools.map((tool) => (
          <Card key={tool.id} className="w-full">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{tool.name}</span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenToolDialog(tool)}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteTool(tool.id)}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tool.imageUrl && (
                <img src={tool.imageUrl} alt={tool.name} className="mb-4 w-full h-40 object-cover rounded-sm" />
              )}
              <p className="text-sm text-gray-600 mb-2">{tool.description}</p>
              <p className="font-semibold">Price: {tool.price} VND</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog for FarmTool */}
      <Dialog open={openToolDialog} onOpenChange={setOpenToolDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTool ? "Update Tool" : "Create Tool"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input
              id="name"
              name="name"
              value={toolFormData.name}
              onChange={handleToolFormChange}
              placeholder="Enter tool name"
              className="w-full"
            />
            <Input
              id="description"
              name="description"
              value={toolFormData.description}
              onChange={handleToolFormChange}
              placeholder="Enter tool description"
              className="w-full"
            />
            <Input
              id="imageFile"
              type="file"
              onChange={handleImageChange}
              className="w-full"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-4 w-full h-40 object-cover" />
            )}
            <Input
              id="price"
              name="price"
              type="number"
              value={toolFormData.price}
              onChange={handleToolFormChange}
              placeholder="Enter price"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseToolDialog}>Cancel</Button>
            <Button variant="default" onClick={handleSaveTool}>
              {selectedTool ? "Update Tool" : "Create Tool"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
