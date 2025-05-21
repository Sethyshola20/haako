"use client"

import { useAuth } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"

export default function Hello() {
    const { user, isLoading, error } = useAuth()
    if (isLoading) return <Loader2/>
    if (error) return <div>Error: {error.message}</div>
    console.log("user",user)
  return <h1>Hello {user.firstName}</h1>
}