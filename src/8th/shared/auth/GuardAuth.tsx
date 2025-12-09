'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from './AuthContext'

export function GuardStudent({
  children,
  redirectTo,
}: {
  children: React.ReactNode
  redirectTo?: string
}) {
  const { student: status } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (redirectTo && status === 'inactive') {
      router.replace(redirectTo)
    }
  }, [status, redirectTo, router])

  if (status === 'active') {
    return <>{children}</>
  }
  return null
}

export function GuardStaff({
  children,
  redirectTo,
}: {
  children: React.ReactNode
  redirectTo?: string
}) {
  const { staff: status } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (redirectTo && status === 'inactive') {
      router.replace(redirectTo)
    }
  }, [status, redirectTo, router])

  if (status === 'active') {
    return <>{children}</>
  }
  return null
}

export function GuardGuestOnly({
  children,
  redirectTo,
}: {
  children: React.ReactNode
  redirectTo?: string
}) {
  const { student, staff } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (redirectTo && (student === 'active' || staff === 'active')) {
      router.replace(redirectTo)
    }
  }, [student, staff, redirectTo, router])

  if (student === 'inactive' && staff === 'inactive') {
    return <>{children}</>
  }
  return null
}
