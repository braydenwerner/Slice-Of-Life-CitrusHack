import { Ionicons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'
import { Image } from 'react-native'

import { HomeScreen, ProfileScreen, PostScreen } from '../screens/exports'
import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import {
  BottomTabParamList,
  HomeScreenParamList,
  ProfileScreenParamList,
  PostScreenParamList
} from '../../types'

const BottomTab = createBottomTabNavigator<BottomTabParamList>()
export default function BottomTabNavigator() {
  const colorScheme = useColorScheme()

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreenNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />
        }}
      />
      <BottomTab.Screen
        name="Posts"
        component={PostScreenNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="add-circle-outline" color={color}></TabBarIcon>
          )
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreenNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="person-outline" color={color} />
          )
        }}
      />
    </BottomTab.Navigator>
  )
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name']
  color: string
}) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const HomeScreenStack = createStackNavigator<HomeScreenParamList>()
function HomeScreenNavigator() {
  return (
    <HomeScreenStack.Navigator>
      <HomeScreenStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerTitle: 'Slice of Life',
          headerTitleStyle: {
            fontStyle: 'italic',
            color: '#f5b133',
            fontSize: 20
          },
          headerRight: () => (
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ marginRight: 15, width: 40, height: 40 }}
            />
          )
        }}
      />
    </HomeScreenStack.Navigator>
  )
}

const ProfileScreenStack = createStackNavigator<ProfileScreenParamList>()
function ProfileScreenNavigator() {
  return (
    <ProfileScreenStack.Navigator>
      <ProfileScreenStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerTitle: 'Profile',
          headerTitleStyle: {
            fontStyle: 'italic',
            color: '#f5b133',
            fontSize: 20
          },
          headerRight: () => (
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ marginRight: 15, width: 40, height: 40 }}
            />
          )
        }}
      />
    </ProfileScreenStack.Navigator>
  )
}

const PostScreenStack = createStackNavigator<PostScreenParamList>()
function PostScreenNavigator() {
  return (
    <PostScreenStack.Navigator>
      <PostScreenStack.Screen
        name="PostScreen"
        component={PostScreen}
        options={{
          headerTitle: 'Posts',
          headerTitleStyle: {
            fontStyle: 'italic',
            color: '#f5b133',
            fontSize: 20
          },
          headerRight: () => (
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ marginRight: 15, width: 40, height: 40 }}
            />
          )
        }}
      />
    </PostScreenStack.Navigator>
  )
}
