import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import QRCodeImage from '../components/QRCodeImage';

import { secretbox } from "tweetnacl";
import { randomBytes } from 'react-native-randombytes'
import { encode as encodeUTF8 } from "@stablelib/utf8";
import {
  encode as encodeBase64,
  decode as decodeBase64
} from "@stablelib/base64";

const Stack = createStackNavigator();

const QRCodeState = React.createContext<QRCodeScreenState>({
  token: ''
});

type QRCodeScreenState = {
  token: string;
}

const storeToken = async (token) => {
  try {
    // Post request can be moved out of here .
    //fetch('http://193.160.96.151:5000/submit-token', {

    postRequest(token);

    const jsonValue = JSON.stringify(token);
    await AsyncStorage.setItem('@token', token)
  } catch (e) {
    // saving error
  }
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
  /*
  var key = generateKey();
  var encrypted = encrypt(token, key);
  */
  
  //return JSON.stringify(encrypted)

  // Store token


  return JSON.stringify(token);
} 

const postRequest = async (token) => {
  fetch(IP + '/submit-token', {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        token: token
        //secondParam: 'yourOtherValue'
    })
  }).catch(function(error) {
      console.log(error);
  });
}

export default class QRCodeScreen extends React.Component {

  state: QRCodeScreenState = {
    // Storage on here must be changed to account for longer encryption
    // This needs to be decrypted...
    token: generateQRCode()
  };

  onPress = () => storeToken(this.state.token);

  componentDidMount(){

  }
  
  GenerateQRCodeImage = () => (
    // https://reactnative.dev/docs/touchableopacity
    <View style={styles.container}>
      <TouchableOpacity
        // POST request
        onPress={this.onPress}
      >
      <QRCodeImage qrcode={this.state.token} />
      </TouchableOpacity>
    </View>
  );

  // For testing
  GenerateQRCodeText = () => (
    <View style={styles.container}>
        <Text> {this.state.token} </Text>
    </View>
  );

  render() {
    return (
    <QRCodeState.Provider value={this.state}>
        <Stack.Navigator>
          <Stack.Screen name='QR Code'
            component={ this.GenerateQRCodeImage }
            options={{
              headerShown: false
            }} />
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
}
});
