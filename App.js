import 'react-native-url-polyfill/auto'
import { useEffect, useState } from 'react'
import Auth from './components/Auth'
import Router from './components/Router'
import { AppContext } from './utils/AppContext'
import { supabase } from './utils/supabase'

export default function App() {
  const [session, setSession] = useState()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AppContext.Provider value={{ session }}>
      {session && session.user ? <Router /> : <Auth />}
    </AppContext.Provider>
  )
}
