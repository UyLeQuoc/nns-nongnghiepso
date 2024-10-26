'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import BackgroundAnimation from '@/components/background-animation'
import NavBar from '@/components/nav-bar'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData({ ...loginData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await axios.post('https://nns-api.uydev.id.vn/api/User/login', loginData)
      setSuccessMessage('Login successful!')

      console.log('Login Response:', response.data)
      if(response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
        console.log((response.data?.roles[0] as string).toUpperCase() == 'ADMIN')
        if((response.data?.roles[0] as string).toUpperCase() == 'ADMIN') {
          router.push('/admin/blogs')
        }else if((response.data?.roles[0] as string).toUpperCase() == 'AGENT') {
          router.push('/agent')
        } else{
          router.push('/')
        }
      }
    } catch (error: any) {
      setError(error.response.data ? error.response.data : 'Login failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <BackgroundAnimation />
      <div className='container mx-auto'>
        <NavBar />
      </div>

      <form onSubmit={handleSubmit} className="w-full mx-auto container p-4 max-w-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" name="email" value={loginData.email} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" name="password" value={loginData.password} onChange={handleInputChange} required />
            </div>
          </div>

          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          {successMessage && <p className="text-green-500 mt-4 text-center">{successMessage}</p>}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 bg-[#FAFE44] text-[#0F4026] hover:bg-[#FAFE44] hover:opacity-60"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </div>
      </form>
    </div>
  )
}
