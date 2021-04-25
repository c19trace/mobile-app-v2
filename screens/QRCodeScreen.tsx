import React from 'react';
import {
  Text,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { secretbox } from "tweetnacl";
import { randomBytes } from 'react-native-randombytes'
import { encode as encodeUTF8 } from "@stablelib/utf8";
import {
  encode as encodeBase64,
  decode as decodeBase64 } from "@stablelib/base64";
import QRCodeImage from '../components/QRCodeImage';
import { SaveToken } from '../queries/tokendb.js'

const Stack = createStackNavigator();
const email = "G00400101"
const url = 'http://:5000/submit-token';

const QRCodeState = React.createContext<QRCodeScreenState>({
  token: ''
});

type QRCodeScreenState = {
  token: string;
}

const storeToken = async (token) => {
  postRequest(token)
  .catch((error) => {
      console.error(error);
  })
}

const generateKey = () => encodeBase64(randomBytes(secretbox.keyLength));
const generateToken = () => encodeBase64(randomBytes(16));
const newNonce = () => randomBytes(secretbox.nonceLength);

const encrypt = (msg, key) => {
    var keyUint8Array = decodeBase64(key);
    var nonce = newNonce();
    var messageUint8 = encodeUTF8(msg);
    var encrypted = secretbox(messageUint8, nonce, keyUint8Array);

    var base64FullMessage = `${encodeBase64(nonce)}:${encodeBase64(encrypted)}`
    return base64FullMessage;
};

function generateQRCode(): string{
  const token = generateToken();
  // save the token to internal db...
  SaveToken(token);

  var key = "5MsHBAGgmulDbS2AsX9bNY9fd5SVKd3IG5SXc9JTVic=";
  var msg = email + ":" + token;
  var encrypted = encrypt(msg, key);

  return JSON.stringify(encrypted)
} 

const postRequest = async (token) => {
  fetch(url, {
    method: 'POST',
    headers: {
        Accept: 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        msg: token
      })
  }).catch(function(error) {
      console.log(error);
  });
}

export default class QRCodeScreen extends React.Component {
  state: QRCodeScreenState = {
    token: generateQRCode()
  };

  onPress = () => storeToken(this.state.token);

  GenerateQRCodeImage = () => {
    return(
      // https://reactnative.dev/docs/touchableopacity
      <View style={styles.container}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.touchable}
            onPress={this.onPress}
          >
          <QRCodeImage qrcode={this.state.token} />
          </TouchableOpacity>
          <Text style={styles.text}>Press to register attendance.</Text>
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

  render() {
    return (
    <QRCodeState.Provider value={this.state}>
        <Stack.Navigator>
          <Stack.Screen name='QR Code'
            component={ this.GenerateQRCodeImage }
            options={{ headerShown: false }} />
        </Stack.Navigator>
      </QRCodeState.Provider>
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
    justifyContent: "center",
    alignContent: 'center',
    fontSize: 16,
    fontFamily: 'lucida grande',
    color: "#34495e",
    marginTop: 50
  },
  logo: {
     alignSelf: 'center',
     justifyContent: "space-around",
     opacity: 0.8,
     height: 200,
  },
  touchable: {
    padding: 7,
    borderColor: '#34495e',
    borderWidth: 2,
    borderRadius: 4,
    marginTop:150
  }
});
