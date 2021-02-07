import React from 'react';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

// Temporary placeholder view


 const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('@token')
      return value != null ? value : null;
    } catch(e) {
      // error reading value
    }
  }

interface Props{
  status?: string;
  //token?: string
}

interface State {
  status: string;
  //token: string
};

export default class ExposureCheckScreen extends React.Component<Props,State> {

  constructor(props: Props){
    super(props);

  }
  
    state: State = {
      //token: props.token
      status: "None of your tokens appear on the exposure list",
      //token: ''
    }

   componentDidMount = () => {
      // Get our key...
      getToken().then((data)=>{
        //this.state.token = data; 

        fetch('http://193.160.96.151:5000/get-exposure-list', {
            method: 'GET'
          })
          .then((response) => response.text())
          .then((responseText) => {
            console.log(responseText);
            var exposed_ids = responseText.split("\n");

            var found = false;
            Object.keys(exposed_ids).forEach(function(i) {
                console.log("ID:" + exposed_ids[i]);
                // Compare against stored tokens, if matched then display message
                if (exposed_ids[i] === data){
                  console.log("Exposure detected", exposed_ids[i], " ", data)
                  found = true;
                    //this.setState(state => ({status: "Exposure Found."}))
                    //this.setState({ status: "false" }, () => console.log(this.state.status));
                }
            });

          if(found){
            console.log(this.state.status);
            this.setState({status: "Exposure Found."});
            console.log(this.state.status);
          }

          })
          .catch((error) => {
            console.error(error);
          });
        })
   }

   componentDidUpdate(){
     console.log("Update occured...")
   }
   

  ExposureCheckComponent = () => (
    <View style={styles.container}>
      <Text>Status: {this.state.status}</Text>
    </View>
  );

  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen name='Exposure Check'
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
