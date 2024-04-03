import { useContext } from 'react'
import { AppContext } from '../utils/AppContext'

export const useSession = () => {
  const { session } = useContext(AppContext)
  return session
}
