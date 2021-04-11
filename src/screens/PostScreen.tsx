import React, { useRef, useState, useEffect } from 'react'
import { StyleSheet, Button, Modal, Animated } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { FloatingAction } from 'react-native-floating-action'

import { Text, View } from '../components/Themed'
import { ScrollView, TextInput } from 'react-native-gesture-handler'

export default function PostScreen() {
  const [isUpvoted, setIsUpvoted] = useState<any>({})
  const [isDownvoted, setIsDownvoted] = useState<any>({})
  const [posts, setPosts] = useState<any>([])
  const [change, setChange] = useState<boolean>(false)
  const [createPostVisible, setCreatePostVisible] = useState<boolean>(false)
  const [bounceValue, setBounceValue] = useState<any>(new Animated.Value(100))

  const titleRef = useRef<any>(null)
  const descriptionRef = useRef<any>(null)

  useEffect(() => {
    getPosts().then((posts) => {
      setPosts(posts)
    })
  }, [change])

  const getPosts = async () => {
    const res = await fetch(
      'https://citrushack-aaron-backend.herokuapp.com/getPosts'
    )
    const posts = await res.json()
    return posts
  }

  const addPost = async (title: string, description: string) => {
    if (title.length > 1 && description.length > 1) {
      await fetch('https://citrushack-aaron-backend.herokuapp.com/addPost', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description })
      })
    }
  }

  const upvotePost = async (id: string) => {
    await fetch('https://citrushack-aaron-backend.herokuapp.com/upvotePost', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    })
  }

  const removeUpvote = async (id: string) => {
    await fetch('https://citrushack-aaron-backend.herokuapp.com/removeUpvote', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    })
  }

  const downvotePost = async (id: string) => {
    await fetch('https://citrushack-aaron-backend.herokuapp.com/downvotePost', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    })
  }

  const removeDownvote = async (id: string) => {
    await fetch(
      'https://citrushack-aaron-backend.herokuapp.com/removeDownvote',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      }
    )
  }

  const handleSubmitPost = async () => {
    if (!titleRef || !descriptionRef) return

    await addPost(titleRef.current.value, descriptionRef.current.value)
    titleRef.current.value = ''
    descriptionRef.current.value = ''

    setChange((oldChange) => !oldChange)
  }

  const handleUpvote = async (id: string) => {
    if (isUpvoted[id]) {
      await removeUpvote(id)
      setIsUpvoted(false)
      setChange((oldChange) => !oldChange)
    } else if (isDownvoted[id]) {
      await upvotePost(id)
      await removeDownvote(id)

      setIsUpvoted((oldIsUpvoted: any) => {
        let dict = { ...oldIsUpvoted }
        dict[id] = true
        return dict
      })

      setIsDownvoted((oldIsDownvoted: any) => {
        let dict = { ...oldIsDownvoted }
        dict[id] = false
        return dict
      })

      setChange((oldChange) => !oldChange)
    } else {
      await upvotePost(id)
      setIsUpvoted((oldIsUpvoted: any) => {
        let dict = { ...oldIsUpvoted }
        dict[id] = true
        return dict
      })

      setChange((oldChange) => !oldChange)
    }
  }

  const handleDownVote = async (id: string) => {
    if (isDownvoted[id]) {
      await removeDownvote(id)

      setIsDownvoted((oldIsDownvoted: any) => {
        let dict = { ...oldIsDownvoted }
        dict[id] = false
        return dict
      })

      setChange((oldChange) => !oldChange)
    } else if (isUpvoted[id]) {
      await downvotePost(id)
      await removeUpvote(id)

      setIsDownvoted((oldIsDownvoted: any) => {
        let dict = { ...oldIsDownvoted }
        dict[id] = true
        return dict
      })

      setIsUpvoted((oldIsUpvoted: any) => {
        let dict = { ...oldIsUpvoted }
        dict[id] = false
        return dict
      })

      setChange((oldChange) => !oldChange)
    } else {
      await downvotePost(id)

      setIsDownvoted((oldIsDownvoted: any) => {
        let dict = { ...oldIsDownvoted }
        dict[id] = true
        return dict
      })

      setChange((oldChange) => !oldChange)
    }
  }

  const handleFloatingActionPress = () => {
    setCreatePostVisible((oldCreatePostVisible) => !oldCreatePostVisible)

    let toValue = 100
    if (!createPostVisible) toValue = 0
    Animated.spring(bounceValue, {
      toValue: toValue,
      velocity: 3,
      tension: 3,
      friction: 8
    } as any).start()
  }

  return (
    <>
      <Animated.View
        style={[
          styles.centeredView,
          { transform: [{ translateY: bounceValue }] }
        ]}
      >
        {createPostVisible && (
          <View
            style={{ width: '100%', height: 300, backgroundColor: '#fcfcfc' }}
          >
            <Text
              style={[
                (styles.title,
                {
                  fontSize: 20,
                  color: '#f5b133',
                  fontStyle: 'italic',
                  padding: 10,
                  fontWeight: '500'
                })
              ]}
            >
              Create a Post
            </Text>
            <TextInput
              ref={titleRef}
              style={[
                styles.textInput,
                {
                  paddingLeft: 10,
                  paddingTop: 10,
                  paddingBottom: 10,
                  width: '100%',
                  backgroundColor: '#f5f5f5'
                }
              ]}
              placeholder={'Title'}
            />
            <TextInput
              ref={descriptionRef}
              style={[
                styles.textInput,
                {
                  paddingLeft: 10,
                  paddingTop: 10,
                  paddingBottom: 90,
                  width: '100%',
                  backgroundColor: '#fcfcfc'
                }
              ]}
              placeholder={'Description'}
              textAlignVertical={'top'}
            />
            <Button
              title="Post"
              color="#91908e"
              accessibilityLabel=""
              onPress={handleSubmitPost}
            />
          </View>
        )}
      </Animated.View>
      <ScrollView style={{ height: 1000 }}>
        <View style={styles.container}>
          {posts.length > 0 &&
            posts.map((p: any, i: number) => {
              return (
                <View style={styles.postContainer} key={i}>
                  <Text style={[styles.title, { padding: 15 }]}>{p.title}</Text>
                  <Text style={[styles.postText, { padding: 15 }]}>
                    {p.description}
                  </Text>

                  <View style={styles.horizontalContainer}>
                    <View style={styles.horizontalSubContainer}>
                      {isUpvoted[p.id] && (
                        <Ionicons
                          name="checkmark-done-outline"
                          size={30}
                          color={'green'}
                          onPress={() => handleUpvote(p.id)}
                        />
                      )}
                      {!isUpvoted[p.id] && (
                        <Ionicons
                          name="checkmark-done-outline"
                          size={30}
                          onPress={() => handleUpvote(p.id)}
                        />
                      )}
                      <Text style={styles.postText}>{p.upvotes}</Text>
                    </View>
                    <View style={styles.horizontalSubContainer}>
                      {isDownvoted[p.id] && (
                        <Ionicons
                          name="flag-outline"
                          size={27}
                          color={'red'}
                          onPress={() => handleDownVote(p.id)}
                        />
                      )}
                      {!isDownvoted[p.id] && (
                        <Ionicons
                          name="flag-outline"
                          size={27}
                          onPress={() => handleDownVote(p.id)}
                        />
                      )}
                      <Text style={styles.postText}>{p.downvotes}</Text>
                    </View>
                  </View>
                </View>
              )
            })}
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <FloatingAction
          onPressMain={handleFloatingActionPress}
          color="#f5b133"
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#D6DDD5',
    height: '100%'
  },
  centeredView: {
    marginTop: 20,
    flex: 1,
    width: '100%',
    backgroundColor: '#54c4bd',
    position: 'absolute',
    bottom: -60,
    zIndex: 2
  },
  bottomContainer: {
    flex: 1,
    alignItems: 'center',
    zIndex: 2
  },
  postContainer: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    backgroundColor: '#f1f5f0', //'rgb(160, 232, 206)',
    height: '100',
    width: '90%',
    marginBottom: 15,
    borderRadius: 7,
    marginTop: 15
  },
  horizontalContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#f1f5f0',
    borderRadius: 7,
    paddingBottom: 10
  },
  horizontalSubContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#f1f5f0'
  },
  textInput: {
    backgroundColor: '#CFE3E2',
    width: '90%',
    zIndex: 5
  },
  title: {
    alignSelf: 'center',
    fontFamily: 'monospace',
    fontSize: 23,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingLeft: 5,
    paddingBottom: 5
  },
  postText: {
    fontSize: 15,
    marginLeft: 10
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%'
  }
})
