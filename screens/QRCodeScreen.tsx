import React from 'react';
import {
  Text,
  StyleSheet,
  View,
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
  /*  Unsure if encryption will be used.
  var key = generateKey();
  var encrypted = encrypt(token, key);
  */
  
  //return JSON.stringify(encrypted);

  // Store token

  storeToken(token);
  return JSON.stringify(token);
}

const storeToken = async (value) => {
  try {
    //await AsyncStorage.setItem('@token', value)
    await AsyncStorage.setItem('@token', "123")
  } catch (e) {
    // saving error
  }
}

interface Props{
token?: string;
}

interface State {
  token: string
}

export default class QRCodeScreen extends React.Component<Props, State> {

constructor(props: Props){
  super(props);

  this.state = {
    //token: props.token
    token: generateQRCode()
  };
}

GenerateQRCodeImage = () => (
  <View style={styles.container}>
    <QRCodeImage qrcode={this.state.token} />
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
    <Stack.Navigator>
      <Stack.Screen name='QR Code'
        component={ this.GenerateQRCodeImage }
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
