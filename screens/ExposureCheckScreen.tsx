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
import { GetTokens } from '../queries/tokendb.js'
import { UserContext } from '../UserContext';

const Stack = createStackNavigator();
const IP = 'http://35.205.110.132:5000/get-exposure-list';

const ExposureState= React.createContext<ExposureScreenState>({
  loading: true,
  status: '',
  token: ''
});

type ExposureScreenState = {
  loading: boolean;
  status: string;
  token: string;
}

const ExposureCheckComponent = () => {
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
  constructor(props) {
    super(props);
    //SQLite.DEBUG = true;

  }

  static contextType = UserContext;

  state: ExposureScreenState = {
    loading: true,
    status: "None of your tokens appear on the exposure list",
    token: ''
  };

  async componentDidMount() {

    GetTokens().then((data) => {
      console.log("Stored Tokens:")
      for (var i = 0; i < data.length; i++) {
        console.log("\t", data[i])
      } 
      

    fetch(IP, {
         method: 'GET'
      })
      .then((response) => response.text())
      .then((responseText) => {
         //console.log(responseText);
         var exposed_ids = responseText.split("\n");

         var found = false;
         Object.keys(exposed_ids).forEach(function(i) {
            // Compare against stored tokens, if matched then display message
            if(data.includes(exposed_ids[i])){
              console.log("Exposure detected", exposed_ids[i])
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

  }

  render() {
    return (
      <ExposureState.Provider value={this.state}>
        <Stack.Navigator>
          <Stack.Screen name='ExposureCheck'
            component={ ExposureCheckComponent }
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