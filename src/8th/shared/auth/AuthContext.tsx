'use client'

import { createContext, useContext, useState } from 'react'

export type AuthStatus = 'unknown' | 'active' | 'inactive'

interface AuthContextProps {
  student: AuthStatus
  staff: AuthStatus
  setStudent?: (status: AuthStatus) => void
  setStaff?: (status: AuthStatus) => void
}
const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export default function AuthContextProvider({
  studentLogin,
  staffLogin,
  children,
}: {
  studentLogin: boolean
  staffLogin: boolean
  children: React.ReactNode
}) {
  const [student, setStudent] = useState<AuthStatus>(
    studentLogin ? 'active' : 'inactive',
  )
  const [staff, setStaff] = useState<AuthStatus>(
    staffLogin ? 'active' : 'inactive',
  )

  return (
    <AuthContext.Provider
      value={{
        student,
        staff,
        setStudent,
        setStaff,
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('AuthContextComponent is not binded.')
  }
  return {
    student: context.student,
    staff: context.staff,
  }
}

export function useChangeStudentAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('AuthContextComponent is not binded.')
  }
  return context.setStudent
}

export function useChangeStaffAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('AuthContextComponent is not binded.')
  }
  return context.setStaff
}
