import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import Dashboard from './Dashboard'
import Account from './Account'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Button } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import Modal from './Modal'

const DashboardStack = ({ navigation }) => {
  const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          headerRight: () => (
            <Button onPress={() => navigation.navigate('Add')} title="+" />
          ),
        }}
      />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name="Add"
          component={Modal}
          options={{ title: 'Add item' }}
        />
      </Stack.Group>
    </Stack.Navigator>
  )
}

const Router = () => {
  const Tab = createBottomTabNavigator()

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="DashboardStack"
          component={DashboardStack}
          options={{
            headerShown: false,
            title: 'Dashboard',
            tabBarIcon: (color) => (
              <MaterialIcons name="account-balance" size={24} color="black" />
            ),
          }}
        />
        <Tab.Screen
          name="Account"
          component={Account}
          options={{
            tabBarIcon: (color) => (
              <MaterialIcons name="account-circle" size={24} color="black" />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default Router
