import PushNotification, { Importance } from 'react-native-push-notification';

export const createChannel = () => {
  PushNotification.createChannel({
    channelId: "mainNotis",
    channelName: "Main Notifications",
    playSound: true,
    soundName: "default",
    importance: Importance.HIGH,
    vibrate: true,
  })
}

export const testNotification = (obj) => {
  PushNotification.localNotification({
    channelId: "mainNotis",
    title: "Title",
    message: "Message",
    bigText: "",
    // actions: ["Yes", "No"],

  })
}

export const testScheduleNotification = () => {
  PushNotification.localNotificationSchedule({
    channelId: "mainNotis",
    title:"Hi",
    message: "My Notification Message",
    date: new Date(Date.now() + 6 * 1000),
    allowWhileIdle: true,
    repeatTime: 1,
  });
}