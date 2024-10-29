"use client"

import BackgroundAnimation from '@/components/background-animation'
import NavBar from '@/components/nav-bar'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Calendar, ChevronDown, ChevronUp, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface Price {
  userId: number;
  price: number;
  note: string;
  user: {
    fullName: string;
    imageUrl: string;
  };
}

interface ProductType {
  id: number;
  name: string;
  description: string;
  prices: Price[];
}

interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  beginPrice: number;
  averagePrice: number | null;
  todayMinPrice: number | null;
  todayMaxPrice: number | null;
  productTypes: ProductType[];
}

export default function Page() {
  const [products, setProducts] = useState<Product[]>([])
  const [expandedProducts, setExpandedProducts] = useState<number[]>([])
  const [expandedTypes, setExpandedTypes] = useState<{ [key: number]: number[] }>({})
  const router = useRouter()

  useEffect(() => {
    fetch('https://nns-api.uydev.id.vn/api/AgentProductPreference/products-with-prices')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error))
  }, [])

  const toggleProductExpansion = (productId: number) => {
    setExpandedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const toggleTypeExpansion = (productId: number, typeId: number) => {
    setExpandedTypes(prev => ({
      ...prev,
      [productId]: prev[productId]?.includes(typeId)
        ? prev[productId].filter(id => id !== typeId)
        : [...(prev[productId] || []), typeId]
    }))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  return (
    <div className="w-full overflow-x-hidden">
      <BackgroundAnimation />
      <div className="container mx-auto">
        <NavBar />
        <main className="container mx-auto py-12 px-2">
          <h2 className="text-3xl font-bold text-[#DCFFD7] mb-6">Giá sản phẩm hôm nay</h2>
          <div className="grid grid-cols-1 gap-4 h-auto">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden h-auto">
            <div className="flex flex-col md:flex-row flex-1">
              <div className="md:w-1/3 relative aspect-video">
                <Image 
                  src={product.imageUrl} 
                  alt={product.name} 
                  layout="fill" 
                  objectFit="cover"
                  className="transition-transform duration-300 e"
                />
              </div>
              <div className="md:w-2/3 p-6">
                <h2 className="text-2xl font-semibold text-green-700 mb-2">{product.name}</h2>
                <p className="text-lg font-medium text-green-600 mb-2">Giá thấp nhất: {formatPrice(product?.todayMinPrice ?? 0)}</p>
                <p className="text-lg font-medium text-green-600 mb-2">Giá trung bình: {formatPrice(product?.averagePrice ?? 0)}</p>
                <p className="text-lg font-medium text-green-600 mb-2">Giá cao nhất: {formatPrice(product?.todayMaxPrice ?? 0)}</p>
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>
              </div>
            </div>
            <div className="p-6 bg-green-50">
              <button
                onClick={() => toggleProductExpansion(product.id)}
                className="flex items-center justify-between w-full bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors duration-200"
              >
                <span>Chi tiết sản phẩm</span>
                {expandedProducts.includes(product.id) ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              {expandedProducts.includes(product.id) && (
                <div className="mt-4 space-y-4">
                  {product.productTypes.map(type => (
                    <div key={type.id} className="bg-white rounded-lg p-4">
                      <div 
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggleTypeExpansion(product.id, type.id)}
                      >
                        <h3 className="text-lg font-medium text-green-700">{type.name}</h3>
                        {expandedTypes[product.id]?.includes(type.id) ? (
                          <ChevronUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      {expandedTypes[product.id]?.includes(type.id) && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                          <div className="space-y-2">
                            {type.prices.map((price, index) => (
                              <div key={index} className="flex justify-between items-center text-sm bg-green-50 p-2 rounded-md">
                                <div className="flex items-center space-x-2 flex-1">
                                  <Image
                                    src={price.user.imageUrl}
                                    alt={price.user.fullName}
                                    width={24}
                                    height={24}
                                    className="rounded-full aspect-square object-cover"
                                  />
                                  <span className="text-gray-700 hover:underline cursor-pointer">{price.user.fullName}</span>
                                </div>
                                <span className="text-gray-600 flex items-center mr-2 md:mr-10">
                                  <Calendar className="w-4 h-4 mr-1 text-green-600" />
                                  {price.note}
                                </span>
                                <span className="text-green-700 font-medium flex items-center">
                                  {formatPrice(price.price)}
                                </span>
                              </div>
                            ))}
                          </div>
                          {/* button xem lich su gia*/}
                          <Button
                            className="mt-4"
                            onClick={() =>router.push(`/gia-ca/${type.id}`)}
                          >Xem lịch sử giá</Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
        </main>
      </div>
    </div>
  )
}
