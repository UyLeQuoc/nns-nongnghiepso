"use client"

import BackgroundAnimation from '@/components/background-animation'
import NavBar from '@/components/nav-bar'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Price {
  userId: number
  price: number
  note: string
}

interface ProductType {
  id: number
  name: string
  description: string
  prices: Price[]
}

interface Product {
  id: number
  name: string
  description: string
  imageUrl: string
  beginPrice: number
  productTypes: ProductType[]
}

export default function Page() {
  const [products, setProducts] = useState<Product[]>([])
  const [expandedProducts, setExpandedProducts] = useState<number[]>([])

  useEffect(() => {
    fetch('https://nongnghiepso.uydev.id.vn/api/AgentProductPreference/products-with-prices')
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
          <div className="space-y-6">
            {products.map(product => (
              <div key={product.id} className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleProductExpansion(product.id)}>
                  <div className="flex items-center space-x-4">
                    <Image src={product.imageUrl} alt={product.name} width={80} height={80} className="rounded-full" />
                    <div>
                      <h3 className="text-xl font-semibold text-[#DCFFD7]">{product.name}</h3>
                      <p className="text-sm text-gray-300">{product.description}</p>
                    </div>
                  </div>
                  {expandedProducts.includes(product.id) ? <ChevronUp className="text-[#DCFFD7]" /> : <ChevronDown className="text-[#DCFFD7]" />}
                </div>
                {expandedProducts.includes(product.id) && (
                  <div className="mt-4 space-y-4">
                    {product.productTypes.map(type => (
                      <div key={type.id} className="bg-white bg-opacity-5 rounded p-4">
                        <h4 className="text-lg font-medium text-[#DCFFD7] mb-2">{type.name}</h4>
                        <p className="text-sm text-gray-300 mb-2">{type.description}</p>
                        <div className="space-y-2">
                          {type.prices.map((price, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-gray-300">{price.note}</span>
                              <span className="text-[#DCFFD7] font-medium">{formatPrice(price.price)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}