"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  isSupabaseConfigured: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const isSupabaseConfigured = true // Demo mode
  const router = useRouter()

  // Check if user is "logged in" on page load
  useEffect(() => {
    const demoUser = localStorage.getItem("demoUser")
    if (demoUser) {
      setUser(JSON.parse(demoUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Demo validation
    if (!email || !password) {
      throw new Error("Please fill in all fields")
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long")
    }

    // Create demo user
    const demoUser: User = {
      id: "demo-user-123",
      email: email,
      user_metadata: {
        full_name: "Demo User",
        avatar_url: "/placeholder.svg",
      },
    }

    // Save to localStorage for persistence
    localStorage.setItem("demoUser", JSON.stringify(demoUser))
    setUser(demoUser)
  }

  const signUp = async (email: string, password: string) => {
    // Same as sign in for demo
    await signIn(email, password)
  }

  const signOut = async () => {
    localStorage.removeItem("demoUser")
    setUser(null)
    router.push("/auth")
  }

  const signInWithGoogle = async () => {
    // Create demo Google user
    const demoUser: User = {
      id: "demo-google-user-123",
      email: "demo@google.com",
      user_metadata: {
        full_name: "Google Demo User",
        avatar_url: "/placeholder.svg",
      },
    }

    localStorage.setItem("demoUser", JSON.stringify(demoUser))
    setUser(demoUser)
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    isSupabaseConfigured,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
