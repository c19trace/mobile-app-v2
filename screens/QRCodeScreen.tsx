import React from 'react';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import QRCodeImage from '../components/QRCodeImage';

import { secretbox, randomBytes } from "tweetnacl";
import {
  encode as encodeBase64,
  decode as decodeBase64
} from "@stablelib/base64";
import { encode as encodeUTF8 } from "@stablelib/utf8";

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

const generateQRCode = () => {
    const token = generateToken();
    console.log("new token:" + token)

    var key = generateKey();
    var encrypted = encrypt(token, key);

    return JSON.stringify(encrypted);
}

// Temporary placeholder view
const GenerateQRCodeImage = () => (
  <View style={styles.container}>
    <QRCodeImage qrcode={generateQRCode} />
  </View>
);

export default class QRCodeScreen extends React.Component {

  /*
  componentWillMount() {
      // Generate a token which is then passed to QRCodeImage .
      const token = generateToken(); 
      const newQRCode = JSON.stringify(token);

      this.setState({token: newQRCode}, () => {
          console.log("QR Code: ", this.state.token);
      });
  }
  */

  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen name='QR Code'
          component={ GenerateQRCodeImage }
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