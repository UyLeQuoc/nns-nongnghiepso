"use client"

import BackgroundAnimation from '@/components/background-animation'
import NavBar from '@/components/nav-bar'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface User {
  id: number
  userId: number
  fullName: string
  email: string
  phoneNumber: string
  imageUrl: string
  thumbnailUrl: string
  description: string
  address: string
  roles: string[]
  agentProductPreferences: AgentProductPreference[]
}

interface AgentProductPreference {
  productTypeId: number
  description: string
  todayPrice: number
  productType: {
    name: string
    description: string
  }
}

export default function UserDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch('https://nns-api.uydev.id.vn/api/User/all')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error))
  }, [])

  return (
    <div className="w-full overflow-x-hidden">
      <BackgroundAnimation />
      <div className="container mx-auto">
      <NavBar />
      <main className="container mx-auto py-12 px-2">
      <h2 className="text-3xl font-bold text-[#DCFFD7] mb-6">Các Đại Lý</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user, index) => (
          <Card key={index} className="w-full">
            <CardHeader className="flex flex-row items-center gap-4 cursor-pointer" onClick={() => {
                router.push(`/dai-ly/${user.id}`)
            }}>
              <Avatar className="w-16 h-16 object-cover">
                <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} className=' object-cover'/>
                <AvatarFallback>{user.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{user.fullName || 'Unnamed User'}</CardTitle>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p><strong>Phone:</strong> {user.phoneNumber || 'N/A'}</p>
                <p><strong>Address:</strong> {user.address || 'N/A'}</p>
                <p><strong>Description:</strong> {user.description || 'N/A'}</p>
              </div>
              {user.agentProductPreferences.length > 0 ? (
                <div>
                  <strong>Sản phẩm thu mua:</strong>
                  <Table className="mt-2">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Today Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {user.agentProductPreferences.map((pref, prefIndex) => (
                        <TableRow key={prefIndex}>
                          <TableCell>{pref.productType.name}</TableCell>
                          <TableCell>{pref.description}</TableCell>
                          <TableCell>{pref.todayPrice}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ): (
                <p>Chưa đăng ký kinh doanh</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      </main>
        </div>
    </div>

  )
}