/**
 * @format
 */

import {AppRegistry, ToastAndroid} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification from "react-native-push-notification";
import {requestNotifications} from 'react-native-permissions';

requestNotifications(['alert', 'sound']).then(({status, settings}) => {
  if(status !== "granted") {
    ToastAndroid.show('Allow notifications for scheduling tasks',2000)
  }
});

PushNotification.configure({
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);
  },
  requestPermissions: Platform.OS === 'ios'
});

AppRegistry.registerComponent(appName, () => App);
