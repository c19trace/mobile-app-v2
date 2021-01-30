import React from 'react';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// Temporary placeholder view

export default class ExposureCheckScreen extends React.Component {
  state = {
      status: "None of your tokens appear on the exposure list"
   }
   componentDidMount = () => {
      var message = "";
      fetch('http://193.160.96.151:5000/get-exposure-list', {
         method: 'GET'
      })
      .then((response) => response.text())
      .then((responseText) => {
         console.log(responseText);
         var exposed_ids = responseText.split("\n");

         Object.keys(exposed_ids).forEach(function(i) {
            console.log("ID:" + exposed_ids[i]);
            // Compare against stored tokens, if matched then display message

         });

         this.setState({
            status: ""
         })
      })
      .catch((error) => {
         console.error(error);
      });
   }
  ExposureCheckComponent = () => (
    <View style={styles.container}>
      <Text>Status: {this.state.status}</Text>
    </View>
  );

  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen name='Calendar'
          component={ this.ExposureCheckComponent }
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
