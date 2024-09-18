import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { agriculturalProducts, calculateAverage, formatPrice } from '../app/data'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Button } from './ui/button'

export default function AveragePriceByProduct() {
  const chartData = agriculturalProducts.map((product:any) => {
    const averagePrices = product.types[0].prices.map((priceData:any, index:any) => ({
      date: priceData.date,
      [product.name]: calculateAverage(product.types.map((type:any) => type.prices[index].price))
    }))
    return { name: product.name, data: averagePrices }
  })

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Giá Trung Bình Hàng Ngày của Nông Sản</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {agriculturalProducts.map((product:any) => {
          const averagePrice = calculateAverage(
            product.types.flatMap((type:any) => type.prices.map((p:any) => p.price))
          );
          return (
            <Card key={product.name}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">150.000 Vnd/Kg</p>
                <p className="text-sm text-muted-foreground">Giá trung bình</p>
                <Button>Xem Thêm</Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  )
}