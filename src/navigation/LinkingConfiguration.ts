import * as Linking from 'expo-linking'

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            screens: {
              HomeScreen: 'home'
            }
          },
          People: {
            screens: {
              PeopleScreen: 'people'
            }
          },
          Post: {
            screens: {
              PostScreen: 'posts'
            }
          }
        }
      },
      NotFound: '*'
    }
  }
}
