import { useEffect, useState } from 'react'
import { FlatList, Text, View } from 'react-native'
import { useSession } from '../hooks/useSession'
import { supabase } from '../utils/supabase'
import Row from './Row'
import { PieChart } from 'react-native-gifted-charts'
import { colorForCategory } from '../utils'
import { MaterialIcons } from '@expo/vector-icons'

const Dashboard = () => {
  const session = useSession()
  const [expenses, setExpenses] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [amountByCategories, setCategories] = useState([])

  useEffect(() => {
    ;(async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select()
        .eq('user', session.user.id)

      if (error) {
        Alert.alert(error.message)
      } else {
        setExpenses(data)
      }
    })()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'expenses',
          filter: `user=eq.${session.user.id}`,
        },
        (payload) => setExpenses((prev) => [...prev, payload.new])
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    setTotalAmount(
      expenses.reduce(
        (acc, curr) => acc + (curr.expense ? -curr.amount : curr.amount),
        0
      )
    )

    const grouped = expenses.reduce((acc, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = 0
      }
      if (curr.expense) {
        acc[curr.category] = acc[curr.category] - Number(curr.amount)
      } else {
        acc[curr.category] = acc[curr.category] + Number(curr.amount)
      }
      return acc
    }, {})
    const data = Object.keys(grouped).map((key) => ({
      name: key,
      value: Math.abs(grouped[key]),
      color: colorForCategory(key),
    }))
    setCategories(data)
  }, [expenses])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <PieChart
        data={amountByCategories}
        isAnimated
        autoShiftLabels
        donut
        sectionAutoFocus
        radius={150}
        innerRadius={100}
        innerCircleColor="white"
        centerLabelComponent={() => (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 40, marginTop: 20 }}>{totalAmount}</Text>
            <Text>&nbsp;HUF</Text>
          </View>
        )}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
        }}
      >
        <MaterialIcons name="balance" size={24} color="black" />
        <Text style={{ fontSize: 20, marginLeft: 10 }}>Balance</Text>
      </View>
      <View
        style={{
          width: '90%',
          height: 20,
          borderWidth: 2,
          borderRadius: 10,
          overflow: 'hidden',
          zIndex: 10,
          backgroundColor: 'transparent',
          flexDirection: 'row',
        }}
      >
        <View
          style={{
            width: `${
              (expenses.reduce(
                (acc, curr) => acc + (curr.expense ? curr.amount : 0),
                0
              ) /
                expenses.reduce(
                  (acc, curr) => acc + Math.abs(curr.amount),
                  0
                )) *
              100
            }%`,
            backgroundColor: 'red',
            height: '100%',
          }}
        />
        <View
          style={{
            width: `${
              (expenses.reduce(
                (acc, curr) => acc + (!curr.expense ? curr.amount : 0),
                0
              ) /
                expenses.reduce(
                  (acc, curr) => acc + Math.abs(curr.amount),
                  0
                )) *
              100
            }%`,
            backgroundColor: 'green',
            height: '100%',
          }}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
        }}
      >
        <MaterialIcons name="history" size={24} color="black" />
        <Text style={{ fontSize: 20, marginLeft: 10 }}>History</Text>
      </View>
      <FlatList
        style={{ width: '100%' }}
        data={expenses.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )}
        keyExtractor={(item) => item.id}
        renderItem={Row}
      />
    </View>
  )
}

export default Dashboard
