"use client"

import { useAuth } from "@/hooks/useAuth"

export default function Hello() {
    const { user } = useAuth()
  return <h1>Hello {user.firstName}</h1>
}