import React, { useState, useEffect } from 'react'
import { StyleSheet, TextInput, Platform, Image } from 'react-native'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'

import { Text, View } from '../components/Themed'
import Dashboard from '../components/Dashboard'
import { ScrollView } from 'react-native-gesture-handler'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
})

export default function HomeScreen() {
  const [imageURLs, setImageUrls] = useState<any>([])

  const sendToken = async (token: any) => {
    await fetch('https://citrushack-aaron-backend.herokuapp.com/data', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    })
  }

  const getImageUrls = async () => {
    const res = await fetch(
      'https://citrushack-aaron-backend.herokuapp.com/getImageUrls'
    )
    const content = await res.json()
    setImageUrls(content)
  }

  useEffect(() => {
    //  send token for notifications every 5 minutes
    registerForPushNotificationsAsync().then((token: any) => {
      sendToken(token)
    })

    //  get web scraping images
    getImageUrls()
  }, [])

  async function registerForPushNotificationsAsync() {
    let token
    if (Constants.isDevice) {
      const {
        status: existingStatus
      } = await (Notifications as any).getPermissionsAsync()
      let finalStatus = existingStatus
      if (existingStatus !== 'granted') {
        const {
          status
        } = await (Notifications as any).requestPermissionsAsync()
        finalStatus = status
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!')
        return
      }
      token = (await Notifications.getExpoPushTokenAsync()).data
    } else {
      alert('Must use physical device for Push Notifications')
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C'
      })
    }

    return token
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Daily Motivation</Text>
        </View>
        <Text style={styles.body}>
          “It’s hard to beat a person who never gives up.” – Babe Ruth
        </Text>
        {imageURLs.map((imageUrl: any, i: number) => {
          return (
            <View style={styles.frame}>
              <Image
                key={i}
                style={styles.stretch}
                source={{
                  uri: imageUrl
                }}
              />
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D6DDD5',
    textAlign: 'center'
  },
  headerContainer: {
    backgroundColor: '#c0c7bf',
    width: '100%',
    height: 60
  },
  header: {
    alignSelf: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginTop: 13
  },
  frame: {
    marginTop: 25,
    marginBottom: 25,
    borderRadius: 7,
    backgroundColor: '#f1f5f0'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  body: {
    fontSize: 16,
    marginTop: 4,
    paddingLeft: 20,
    paddingRight: 20
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%'
  },
  input: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  stretch: {
    margin: 30,
    width: 250,
    height: 250,
    resizeMode: 'contain'
  }
})
