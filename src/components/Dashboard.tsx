import React from 'react'
import { StyleSheet, TextInput, Platform } from 'react-native'
import { Text, View } from './Themed'

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Posts</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 30
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  }
})
