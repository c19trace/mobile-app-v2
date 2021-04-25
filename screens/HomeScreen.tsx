import React from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Image,
  Text,
  View,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserContext } from '../UserContext';

const Stack = createStackNavigator();

const HomeComponent = () => {
  const userContext = React.useContext(UserContext);

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <ActivityIndicator
          color={Platform.OS === 'android' ? '#276b80' : undefined}
          animating={userContext.userLoading}
          size='large'
        />
        {userContext.userLoading ? null: <Text style={styles.text}>Hello {userContext.userFirstName}!</Text>}
      </View>

      <View >
        <Image 
          source={require('../images/title-logo.png')}
          resizeMode="contain"
          style={styles.logo}
        />
      </View>
    </View>
  );
}

export default class HomeScreen extends React.Component {
  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen name='Home'
          component={HomeComponent}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    fontFamily: 'lucida grande',
    color: "#34495e"
  },
  logo: {
     alignSelf: 'center',
     justifyContent: "space-around",
     opacity: 0.8,
     height: 200,
  }
});