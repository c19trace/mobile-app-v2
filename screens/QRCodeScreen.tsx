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

const storeToken = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('@token', value)
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
  /*  Unsure if encryption will be used.
  var key = generateKey();
  var encrypted = encrypt(token, key);
  */
  
  //return JSON.stringify(encrypted);

  // Store token

  //storeToken("123");
  return JSON.stringify(token);
}

export default class QRCodeScreen extends React.Component {

  state: QRCodeScreenState = {
    token: generateToken()
  };



  onPress = () => storeToken(this.state.token);

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
