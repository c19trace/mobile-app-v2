import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  StyleSheet,
  View,
  Image,
} from 'react-native';
import { Text } from 'react-native-elements'
import { createStackNavigator } from '@react-navigation/stack';
import { GetTokens } from '../queries/tokendb.js'
import { UserContext } from '../UserContext';
import Images from '../components/Images.js';

const Stack = createStackNavigator();
const url = 'http://:5000/get-exposure-list';

const ExposureState= React.createContext<ExposureScreenState>({
  loading: true,
  status: '',
  token: '',
  exposureFound: false
});

type ExposureScreenState = {
  loading: boolean;
  status: string;
  token: string;
  exposureFound: boolean;
}

const DisplayImg = (exposureFound) => {
  if(exposureFound){
    return (
      <Image
        source={Images.checkin_no}
        resizeMode="contain"
        style={styles.img}
      />
    );
  } else {
    return (
      <Image
        source={Images.checkin_yes}
        resizeMode="contain"
        style={styles.img}
      />
    );
  }
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


      <Image 
        source={require('../images/prevention-lite.png')}
        resizeMode="contain"
        style={styles.info}
      />
      <View style={styles.container}>
        {DisplayImg(exposureState.exposureFound)}
        <Text style={styles.text}>{exposureState.status}</Text>
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

export default class ExposureCheckScreen extends React.Component {
  static contextType = UserContext;

  state: ExposureScreenState = {
    loading: true,
    status: "No exposure detected.\nYou are free to attend campus.",
    token: '',
    exposureFound: false
  };

  async componentDidMount() {
    GetTokens().then((data) => {
      console.log("Stored Tokens:")
      for (var i = 0; i < data.length; i++) {
        console.log("\t", data[i])
      } 

      fetch(url, {
         method: 'GET'
      })
      .then((response) => response.text())
      .then((responseText) => {
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
          this.setState({
            exposureFound: true,
            status: "Exposure detected.\nDo not attend campus."
          });
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
            options={{ headerShown: false }} />
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
  },
  text: {
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    fontSize: 20,
    fontFamily: 'lucida grande',
    color: "#34495e"
  },
  logo: {
     alignSelf: 'center',
     justifyContent: "space-around",
     opacity: 0.8,
     height: 200
  },
  img: {
     alignSelf: 'center',
     justifyContent: "space-around",
     opacity: 0.8,
  },
  info: {
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 20
  }
});