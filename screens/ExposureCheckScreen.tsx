import React from 'react';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// Temporary placeholder view
const ExposureCheckComponent = () => (
  <View style={styles.container}>
    <Text>Exposure Check</Text>
  </View>
);

export default class ExposureCheckScreen extends React.Component {

  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen name='Calendar'
          component={ ExposureCheckComponent }
          options={{
            headerShown: false
          }} />
      </Stack.Navigator>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});