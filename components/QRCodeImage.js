import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import {View} from "react-native" ;

export default class QRCodeImage extends React.Component{
    render(){
        return (
        <View>
            <QRCode value={this.props.token} />
        </View>
        );
    }
}