'use client'

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronUp, TrendingUp, Calendar } from 'lucide-react'
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import BackgroundAnimation from "@/components/background-animation"
import NavBar from "@/components/nav-bar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import agriculturalProductApi from "@/apis/agriculturalProductApi"

interface Price {
  userId: string
  user: {
    imageUrl: string
    fullName: string
  }
  note: string
  price: number
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
  averagePrice: number | null
  todayMinPrice: number | null
  todayMaxPrice: number | null
  productTypes: ProductType[]
}

interface PriceData {
  date: string
  [user: string]: number | string
}

export default function ProductTypePriceTrend({ params }: { params: { productTypeId: string } }) {
  const [chartData, setChartData] = useState<PriceData[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [product, setProduct] = useState<Product | null>(null)
  const [expandedTypes, setExpandedTypes] = useState<Record<number, number[]>>({})
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetch('https://nns-api.uydev.id.vn/api/AgentProductPreference/products-with-prices')
      .then(response => response.json())
      .then(data => {
        setProducts(data)
        const foundProduct = data.find((p: Product) => p.productTypes.some((type: ProductType) => type.id === +params.productTypeId))
        setProduct(foundProduct || null)
      })
      .catch(error => {
        console.error('Error fetching products:', error)
        toast({
          title: "Error",
          description: "Unable to fetch product data. Please try again.",
          variant: "destructive",
        })
      })
  }, [params.productTypeId, toast])

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const data = await agriculturalProductApi.getDailyPricesForProductType(+params.productTypeId)
        setChartData(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Unable to fetch price trend data. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchPriceData()
  }, [params.productTypeId, toast])

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

  const chartConfig: ChartConfig = chartData.length > 0
    ? Object.keys(chartData[0])
        .filter(key => key !== "date")
        .reduce((acc, userName, index) => {
          acc[userName] = {
            label: userName,
            color: `hsl(${index * 45}, 70%, 60%)`,
          }
          return acc
        }, {} as ChartConfig)
    : {}

  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full overflow-x-hidden">
      <BackgroundAnimation />
      <div className="container mx-auto">
        <NavBar />
        <main className="container mx-auto py-12 px-2 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Price Trend Chart</CardTitle>
              <CardDescription>The price trend of the product by different users</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <LineChart
                  width={800}
                  height={400}
                  data={chartData}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  {Object.keys(chartConfig).map((userName) => (
                    <Line
                      key={userName}
                      dataKey={userName}
                      type="monotone"
                      stroke={chartConfig[userName].color}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-start gap-2 text-sm">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 font-medium leading-none">
                    Price Trend Summary <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2 leading-none text-muted-foreground">
                    Data from multiple users for this product
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
          { product.productTypes.map(type => {
            if (type.id.toString() != params.productTypeId) return null

            return (
              <div key={type.id} className="bg-white rounded-lg p-4 mt-4">
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
                        <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm bg-green-50 p-3 rounded-md space-y-2 sm:space-y-0">
                          <div className="flex items-center space-x-2 w-full sm:w-auto">
                            <Image
                              src={price.user.imageUrl}
                              alt={price.user.fullName}
                              width={24}
                              height={24}
                              className="rounded-full aspect-square object-cover overflow-hidden"
                            />
                            <Link href={`/dai-ly/${price.userId}`}>
                              <span className="text-gray-700 hover:underline cursor-pointer truncate max-w-[150px]">
                                {price.user.fullName}
                              </span>
                            </Link>
                          </div>
                          <div className="flex justify-between items-center w-full sm:w-auto">
                            <span className="text-gray-600 items-center flex sm:mr-4">
                              <Calendar className="w-4 h-4 mr-1 text-green-600" />
                              <span className="truncate max-w-[120px]">{price.note}</span>
                            </span>
                            <span className="text-green-700 font-medium flex items-center">
                              {formatPrice(price.price)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </main>
      </div>
    </div>
  )
}