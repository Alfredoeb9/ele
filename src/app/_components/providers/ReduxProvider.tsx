'use client'
import React, { useRef } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { AppStore, makeStore, store } from '@/redux/store'
// import { useSession } from 'next-auth/react'
import { updateUser } from '@/redux/features/AuthContext'


export default function ReduxProvider({
  user,
  children
}: {
  user: any
  children: React.ReactNode
}) {

  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
    
    if (user && user.email?.length >= 0) storeRef.current.dispatch(updateUser(user))
    
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}