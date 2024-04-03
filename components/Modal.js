import { useEffect, useState } from 'react'
import { Alert, Pressable, Text, TextInput, View } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import categories from '../utils/categories.json'
import { useSession } from '../hooks/useSession'
import { supabase } from '../utils/supabase'

const Select = ({ onPress, title, selected }) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: selected ? 'lightblue' : 'transparent',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
      }}
    >
      <Text style={{ fontSize: 16 }}>{title}</Text>
    </Pressable>
  )
}

const Modal = ({ navigation }) => {
  const [category, setCategory] = useState(null)
  const [direction, setDirection] = useState('expense')
  const [amount, setAmount] = useState('100')
  const [tip, setTip] = useState(0)
  const [finalPrice, setFinalPrice] = useState(0)
  const session = useSession()
  const [users, setUsers] = useState([])
  const [name, setName] = useState('')

  useEffect(() => {
    const price = Number(amount) + Number(amount) * (Number(tip) / 100)
    setFinalPrice(price / (users.length + 1))
  }, [amount, tip, finalPrice, users])

  const logExpense = async () => {
    const { error } = await supabase.from('expenses').insert(
      [...users, { id: session.user.id }].map((u) => ({
        category,
        expense: direction === 'expense',
        amount: finalPrice,
        user: u.id,
      }))
    )

    if (error) {
      Alert.alert(error.message)
    } else {
      navigation.goBack()
    }
  }

  const searchUser = async () => {
    if (name == session.user) {
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('username, id')
      .ilike('username', name)
      .limit(1)
      .single()
    if (error) {
      Alert.alert(error.message)
    }
    if (!users.find((u) => u === data.username)) {
      setUsers([...users, data])
    }
    setName('')
  }

  const removeUser = (id) => {
    setUsers(users.filter((u) => u.id !== id))
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'start',
        marginTop: 30,
      }}
    >
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <Select
          title="Expense"
          onPress={() => setDirection('expense')}
          selected={direction === 'expense'}
        />
        <Select
          title="Income"
          onPress={() => setDirection('income')}
          selected={direction === 'income'}
        />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text>Category: </Text>
        <RNPickerSelect
          onValueChange={(value) => setCategory(value)}
          value={category}
          placeholder={{ label: 'Select a category', value: null }}
          items={categories}
        />
      </View>
      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}
      >
        <TextInput
          value={amount}
          onChangeText={setAmount}
          style={{
            borderWidth: 1,
            borderRadius: 5,
            padding: 5,
            width: 200,
            fontSize: 30,
            textAlign: 'right',
          }}
          placeholder="Amount"
          keyboardType="numeric"
        />
        <Text style={{ fontSize: 30, marginLeft: 5 }}>HUF</Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        {[0, 10, 15, 20].map((percent) => (
          <Select
            key={percent}
            title={`+${percent}%`}
            onPress={() => setTip(percent)}
            selected={tip === percent}
          />
        ))}
      </View>
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <TextInput
          value={name}
          placeholder="username"
          onChangeText={setName}
          autoCapitalize="none"
          style={{
            borderWidth: 1,
            borderRadius: 5,
            padding: 5,
            width: '80%',
          }}
        />
        <Pressable
          style={{
            borderRadius: 100,
            backgroundColor: 'aqua',
            opacity: name ? 1 : 0.5,
            width: 30,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 10,
          }}
          onPress={searchUser}
          disabled={!name}
        >
          <Text style={{ fontSize: 20, textAlign: 'center' }}>+</Text>
        </Pressable>
      </View>
      <View>
        {users.map((user) => (
          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'space-between',
              width: '90%',
              marginTop: 10,
            }}
            key={user.id}
          >
            <Text style={{ paddingTop: 10 }}>{user.username}</Text>
            <Pressable
              onPress={() => removeUser(user.id)}
              style={{
                borderRadius: 100,
                backgroundColor: 'red',
                opacity: name ? 1 : 0.5,
                width: 30,
                height: 30,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 10,
              }}
            >
              <Text>-</Text>
            </Pressable>
          </View>
        ))}
      </View>
      <Pressable
        style={{
          backgroundColor: 'blue',
          marginTop: 30,
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderRadius: 10,
          width: '90%',
          opacity: category && amount ? 1 : 0.5,
        }}
        disabled={!category || !amount}
        onPress={logExpense}
      >
        <Text style={{ fontSize: 30, textAlign: 'center', color: 'white' }}>
          Log {finalPrice.toFixed(2)} HUF
        </Text>
      </Pressable>
    </View>
  )
}

export default Modal
