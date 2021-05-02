// Adapted from https://reactnavigation.org/docs/auth-flow
import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Button
} from 'react-native';
import { ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'
import { AuthContext } from '../AuthContext';

type SignInProps = {
  navigation: StackNavigationProp<ParamListBase>;
};

export default class SignInScreen extends React.Component<SignInProps> {
  static contextType = AuthContext;

  _signInAsync = async () => {
    await this.context.signIn();
  };

  componentDidMount() {
    this.props.navigation.setOptions({
      title: 'Please sign in',
      headerShown: true
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Image 
            source={require('../images/prevention.png')}
            resizeMode="contain"
            style={styles.info}
          />
        </View>
        <View style={styles.container}>
          <Button style={styles.logo}
            buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
            title='SIGN IN' onPress={this._signInAsync}/>
        </View>

        <View>
          <Image 
            source={require('../images/title-logo.png')}
            resizeMode="contain"
            style={styles.logo}
          />
        </View>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
     alignSelf: 'center',
     justifyContent: "space-around",
     opacity: 0.8,
     height: 200,
  },
  info: {
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 20,
  }
});