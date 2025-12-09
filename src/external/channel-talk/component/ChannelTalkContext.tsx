'use client'

import React, { useEffect } from 'react'
import { Chatbot } from '../chatbot-channeltalk'

const ChannelTalkChatbotContext = React.createContext<undefined>(undefined)

export default function ChannelTalkContextProvider({
  customerInfo,
  loginInfo,
  children,
}: {
  customerInfo?: {
    customerId: string
    customerName: string
    customerUse: string
  }
  loginInfo?: {
    loginId: string
    studentId: string
    name: string
  }
  children?: React.ReactNode
}) {
  const { customerId, customerName, customerUse } = customerInfo || {}
  const { loginId, studentId, name: studentName } = loginInfo || {}

  useEffect(() => {
    Chatbot.load()
  }, [])

  useEffect(() => {
    if (customerId && customerName && customerUse) {
      Chatbot.connect(customerId, customerName, customerUse.toLocaleLowerCase())
    }
    return () => {
      Chatbot.disconnect()
    }
  }, [customerId, customerName, customerUse])

  useEffect(() => {
    if (loginId && studentId && studentName && customerUse) {
      Chatbot.updateUserInfo({
        userid: studentId,
        loginId,
        name: studentName,
        customerUse,
      })
    }
  }, [loginId, studentId, studentName, customerUse])

  return (
    <ChannelTalkChatbotContext.Provider value={undefined}>
      {children}
    </ChannelTalkChatbotContext.Provider>
  )
}

export const useChannelTalkChatbotController = () => {
  return {
    showChat: Chatbot.showChat,
    hideChat: Chatbot.hideChat,
    showButton: Chatbot.showButton,
    hideButton: Chatbot.hideButton,
  }
}
