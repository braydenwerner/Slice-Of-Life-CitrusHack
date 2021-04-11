import React, { useState } from 'react'
import { StyleSheet, Picker, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { Text, View } from '../components/Themed'
import { ScrollView } from 'react-native-gesture-handler'

export default function ProfileScreen() {
  const [selectedValue, setSelectedValue] = useState('Every Minute')

  return (
    <ScrollView style={{ height: 1000, backgroundColor: '#D6DDD5' }}>
      <View style={styles.container}>
        <Ionicons name="person-outline" size={170} style={{ marginTop: 50 }} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>Aaron Jeffery</Text>
          <Text style={styles.bioText}>
            “The secret of getting ahead is getting started.” – Mark Twain
          </Text>
          <Text style={styles.separator}></Text>
          <View style={styles.innerContainer}>
            <View
              style={[styles.rowContainer, { justifyContent: 'space-around' }]}
            >
              <Text style={styles.title}>Total Posts: </Text>
              <View style={styles.rowSubContainer}>
                <Text style={styles.title}>1</Text>
                <Ionicons name="create-outline" size={30} />
              </View>
            </View>
            <View
              style={[styles.rowContainer, { justifyContent: 'space-around' }]}
            >
              <Text style={styles.title}>Total Upvotes: </Text>

              <View style={styles.rowSubContainer}>
                <Text style={styles.title}>3</Text>
                <Ionicons
                  name="checkmark-done-outline"
                  size={30}
                  style={{ marginRight: 10 }}
                />
              </View>
            </View>
            <View style={styles.innerContainer}>
              <Text style={styles.bioText}>
                Send me a motivational notification:{' '}
              </Text>
              <Picker
                selectedValue={selectedValue}
                style={{ height: 30, width: 150 }}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedValue(itemValue)
                }
              >
                <Picker.Item label="Every Minute" value="Every Minute" />
                <Picker.Item label="Every Hour" value="Every Hour" />
                <Picker.Item label="Every Day" value="Every Day" />
                <Picker.Item label="Every Week" value="Every Week" />
                <Picker.Item label="Never" value="Never" />
              </Picker>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#D6DDD5'
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#e9ede8',
    padding: 11,
    borderRadius: 7
  },
  textContainer: {
    width: '90%',
    alignItems: 'center',
    backgroundColor: '#e9ede8',
    padding: 15,
    borderRadius: 7
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    backgroundColor: '#e9ede8'
  },
  rowSubContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#e9ede8'
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    color: '#f5b133',
    paddingBottom: 10
  },
  bioText: {
    fontSize: 18,
    marginTop: 15
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '80%'
  }
})
