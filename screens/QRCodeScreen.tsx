import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import QRCodeImage from '../components/QRCodeImage';

import { secretbox } from "tweetnacl";
import { randomBytes } from 'react-native-randombytes'
import { encode as encodeUTF8 } from "@stablelib/utf8";
import {
  encode as encodeBase64,
  decode as decodeBase64
} from "@stablelib/base64";

import { SaveToken } from '../queries/tokendb.js'

const Stack = createStackNavigator();
const IP = '';

const QRCodeState = React.createContext<QRCodeScreenState>({
  token: ''
});

type QRCodeScreenState = {
  token: string;
}

const storeToken = async (token) => {

    SaveToken(token).then(()=>{
      postRequest(token)
    })
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
  /*
  var key = generateKey();
  var encrypted = encrypt(token, key);
  */
  
  //return JSON.stringify(encrypted)
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
      })
  }).catch(function(error) {
      console.log(error);
  });
}

export default class QRCodeScreen extends React.Component {

  state: QRCodeScreenState = {
    // Storage on here must be changed to account for longer encryption
    // This needs to be decrypted...
    // Need to strip the inverted commas, function returns a string with...
    token: generateQRCode().replace(/['"]+/g, '')
  };

  onPress = () => storeToken(this.state.token);

  GenerateQRCodeImage = () => (
    // https://reactnative.dev/docs/touchableopacity
    <View style={styles.container}>
      <TouchableOpacity
        onPress={this.onPress}
      >
      <QRCodeImage qrcode={this.state.token} />
      </TouchableOpacity>
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
