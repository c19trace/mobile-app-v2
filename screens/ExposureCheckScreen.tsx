import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../UserContext';

const Stack = createStackNavigator();

const ExposureState= React.createContext<ExposureScreenState>({
  loading: true,
  status: ''
});

type ExposureScreenState = {
  loading: boolean;
  status: string;
}

 const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('@token')
      return value != null ? value : null;
    } catch(e) {
      // error reading value
    }
  }

const CalendarComponent = () => {
  const exposureState = React.useContext(ExposureState);
  return (
    <View style={styles.container}>
      <Modal visible={exposureState.loading}>
        <View style={styles.container}>
          <ActivityIndicator
            color={Platform.OS === 'android' ? '#276b80' : undefined}
            animating={exposureState.loading}
            size='large' />
        </View>
      </Modal>
      <View style={styles.container}>
        <Text>{exposureState.status}</Text>
      </View>
    </View>
  );
}

export default class ExposureCheckScreen extends React.Component {
  static contextType = UserContext;

  state: ExposureScreenState = {
    loading: true,
    status: "None of your tokens appear on the exposure list"
  };



  async componentDidMount() {
    try {
      // Get our key...
      // Should be a cleaner way to do this?
      getToken().then((data)=>{
        console.log("Stored token: " + data);

        fetch('http://193.160.96.151:5000/get-exposure-list', {
            method: 'GET'
          })
          .then((response) => response.text())
          .then((responseText) => {
            console.log(responseText);
            var exposed_ids = responseText.split("\n");

            var found = false;
            Object.keys(exposed_ids).forEach(function(i) {
                // Compare against stored tokens, if matched then display message
                if (exposed_ids[i] === data){
                  console.log("Exposure detected", exposed_ids[i], " ", data)
                  found = true;
                }
            });

          if(found){
            this.setState({status: "Exposure Found."});
          }
            this.setState({loading: false});

          })
          .catch((error) => {
            console.error(error);
          });
        })
    } catch(error) {
      Alert.alert(
        'Error getting events',
        JSON.stringify(error),
        [
          {
            text: 'OK'
          }
        ],
        { cancelable: false }
      );

    }
  }

  render() {
    return (
      <ExposureState.Provider value={this.state}>
        <Stack.Navigator>
          <Stack.Screen name='Calendar'
            component={ CalendarComponent }
            options={{
              headerShown: false
            }} />
        </Stack.Navigator>
      </ExposureState.Provider>
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