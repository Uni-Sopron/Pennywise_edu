import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { StyleSheet, View, Alert, ScrollView, Button } from 'react-native'
import { Input } from 'react-native-elements'
import Avatar from './Avatar'
import { useSession } from '../hooks/useSession'

export default function Account() {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const session = useSession()

  useEffect(() => {
    if (session) {
      getProfile()
    }
  }, [session])

  const getProfile = async () => {
    try {
      setLoading(true)
      if (!session?.user) {
        throw new Error('No user on the session!')
      }

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, avatar_url`)
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async ({ username, avatar_url }) => {
    try {
      setLoading(true)
      if (!session?.user) {
        throw new Error('No user on the session!')
      }

      const updates = {
        id: session?.user.id,
        username,
        avatar_url,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={{ ...styles.container }}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Avatar
          size={200}
          url={avatarUrl}
          onUpload={(url) => {
            setAvatarUrl(url)
            updateProfile({ username, avatar_url: url })
          }}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Email" value={session?.user?.email} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Username"
          value={username || ''}
          onChangeText={(text) => setUsername(text)}
        />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? 'Loading ...' : 'Update'}
          onPress={() => updateProfile({ username, avatar_url: avatarUrl })}
          disabled={loading}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  mt20: {
    marginTop: 20,
  },
})
