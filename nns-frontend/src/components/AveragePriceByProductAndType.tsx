import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { agriculturalProducts, calculateAverage, formatPrice } from '../app/data'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function AveragePriceByProductAndType() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Giá Trung Bình Hàng Ngày của Nông Sản và Loại Nông Sản</h1>
      <Accordion type="single" collapsible className="w-full">
        {agriculturalProducts.map((product:any) => {
          const averagePrice = calculateAverage(
            product.types.flatMap((type:any) => type.prices.map((p:any) => p.price))
          );
          return (
            <AccordionItem key={product.name} value={product.name}>
              <AccordionTrigger>
                <div className="flex justify-between w-full">
                  <span>{product.name}</span>
                  <span>{formatPrice(averagePrice)}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {product.types.map((type:any) => {
                    const typeAveragePrice = calculateAverage(type.prices.map((p:any) => p.price));
                    return (
                      <Card key={type.name}>
                        <CardHeader>
                          <CardTitle>{type.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xl font-semibold">{formatPrice(typeAveragePrice)}</p>
                          <p className="text-sm text-muted-foreground">Giá trung bình</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Biểu Đồ Giá Hàng Ngày</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" allowDuplicatedCategory={false} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {product.types.map((type:any, index:any) => (
                          <Line
                            key={type.name}
                            type="monotone"
                            dataKey="price"
                            data={type.prices}
                            name={type.name}
                            stroke={`hsl(${index * 60}, 70%, 50%)`}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  )
}