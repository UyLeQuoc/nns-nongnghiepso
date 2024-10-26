"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface User {
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

  useEffect(() => {
    fetch('https://nns-api.uydev.id.vn/api/User/all')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error))
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user, index) => (
          <Card key={index} className="w-full">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} />
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
              <div className="mb-4">
                <strong>Roles:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.roles.map((role, roleIndex) => (
                    <Badge key={roleIndex} variant="secondary">{role}</Badge>
                  ))}
                </div>
              </div>
              {user.agentProductPreferences.length > 0 && (
                <div>
                  <strong>Product Preferences:</strong>
                  <Table className="mt-2">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Todays Price</TableHead>
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
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}