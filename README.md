To run:  
`yarn install` `react-native run-android` 

#### Project setup

1. Created project:  `npx react-native init C19Trace --template react-native-template-typescript`


2. Install dependencies:  
```
yarn add @react-navigation/native@5.8.8 @react-navigation/drawer@5.11.1 @react-navigation/stack@5.12.5
yarn add @react-native-community/masked-view@0.1.10 react-native-safe-area-context@3.1.8 windows-iana
yarn add react-native-reanimated@1.13.1 react-native-screens@2.14.0 @react-native-async-storage/async-storage@1.13.2
yarn add react-native-elements@2.3.2 react-native-vector-icons@7.1.0 react-native-gesture-handler@1.8.0
yarn add react-native-app-auth@6.0.1 moment@2.29.1 moment-timezone @microsoft/microsoft-graph-client@2.1.1
yarn add @react-native-community/datetimepicker@3.0.4 
yarn add @microsoft/microsoft-graph-types --save-dev
```

3. Configure for Android by changing defaultConfig file @/android/app/build.gradle.  
ISO configuration not completed.

4. Gradle-wrapper.properties changed to gradle-6.8.  

5. Additional dependencies:  
```
yarn add @react-navigation/stack  
yarn add @react-navigation/native  
yarn add tweetnacl  
yarn add @stablelib/utf8  
yarn add @stablelib/base64  
yarn add react-native-svg  
yarn add react-native-qrcode-svg  
```



### About
A React Native application which serves two purposes, firstly it provides students with a convenient means to register their attendance on GMIT campus. Secondly, the application will update students on the spread of COVID-19 through the Exposure Check view. The application was built and tested using Android Studio.

User authentication is handled by Microsoft’s Azure AD.

The application contains two views of note, the QRCode view and Exposure check view. 

#### QR Code screen
<img src="https://user-images.githubusercontent.com/37144829/117446553-2642bc00-af34-11eb-9d18-67982b648eec.png" alt="screen-qrcode" width="200" height="400" />

The QR Code screen fulfils one of the attendance registration functions of themobile application. This is done by touching a QR code which is displayed on screen. Once presseda randomly generated token will be sent to the back-end server, along with thestudents ID.

#### Exposure check screen
<img src="https://user-images.githubusercontent.com/37144829/117447970-0ca27400-af36-11eb-8a43-a5e205773a7d.png" alt="screen-exposure" width="400" height="400" />

The Exposure check screen informs the student of their exposure status. This is done by requesting the list of the exposed tokens stored on the back-endserver and comparing these against tokens stored on the device. If a match is found the student is informed of this exposure. The student is given visual feedback of their status with the displaying of either agreen checkmark  indicating that no exposure has been detected, or a redcross, indicating that an exposure has been detected.

