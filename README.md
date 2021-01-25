To run:  
yarn install  
react-native run-android  


Project setup.  

1. Created project: npx react-native init C19Trace --template react-native-template-typescript  


2. Install dependencies:  
yarn add @react-navigation/native@5.8.8 @react-navigation/drawer@5.11.1 @react-navigation/stack@5.12.5  
yarn add @react-native-community/masked-view@0.1.10 react-native-safe-area-context@3.1.8 windows-iana  
yarn add react-native-reanimated@1.13.1 react-native-screens@2.14.0 @react-native-async-storage/async-storage@1.13.2  
yarn add react-native-elements@2.3.2 react-native-vector-icons@7.1.0 react-native-gesture-handler@1.8.0  
yarn add react-native-app-auth@6.0.1 moment@2.29.1 moment-timezone @microsoft/microsoft-graph-client@2.1.1  
yarn add @react-native-community/datetimepicker@3.0.4  
yarn add @microsoft/microsoft-graph-types --save-dev  


3. Configure for Android by changing defaultConfig file @/android/app/build.gradle.  
ISO configuration not completed.  


4. Gradle-wrapper.properties changed to gradle-6.8.  


5. Additional dependencies:  
yarn add @react-navigation/stack  
yarn add @react-navigation/native  
yarn add tweetnacl  
yarn add @stablelib/utf8  
yarn add @stablelib/base64  
yarn add react-native-svg  
yarn add react-native-qrcode-svg  
