import PushNotification, { Importance } from 'react-native-push-notification';

export const createChannel = () => {
  PushNotification.createChannel({
    channelId: "mainNotis",
    channelName: "Main Notifications",
    playSound: true,
    soundName: "default",
    importance: Importance.HIGH
    ,
    vibrate: true,
  })
}

export const testNotification = (obj) => {
  PushNotification.localNotification({
    channelId: "mainNotis",
    title: "You have clicked a fuckin button",
    message: "Go to gym to fuckin bitch"
  })
}