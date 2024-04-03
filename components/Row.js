import { Text, View } from 'react-native'
import { categoryForCategory, colorForCategory } from '../utils'

const Row = ({ item }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      width: '90%',
      alignSelf: 'center',
      padding: 10,
    }}
  >
    <View
      style={{
        width: 20,
        height: 20,
        borderRadius: 100,
        backgroundColor: colorForCategory(item.category),
        marginRight: 10,
      }}
    />
    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
      <Text style={{ fontSize: 18 }}>{item.expense ? '-' : '+'}</Text>
      <Text style={{ fontSize: 18 }}>{item.amount}</Text>
      <Text>&nbsp;HUF</Text>
    </View>
    <Text style={{ fontVariant: ['tabular-nums'], marginLeft: 'auto' }}>
      {categoryForCategory(item.category)}
    </Text>
    <Text
      style={{
        fontVariant: ['tabular-nums'],
        fontSize: 10,
        marginLeft: 'auto',
      }}
    >
      {new Date(item.created_at).toLocaleDateString()}
    </Text>
  </View>
)

export default Row
