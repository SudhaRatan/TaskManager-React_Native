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

export const testScheduleNotification = (date,data) => {
  PushNotification.localNotificationSchedule({
    channelId: "mainNotis",
    title:data.title,
    message: data.message,
    playSound: true,
    soundName: "default",
    date: new Date(date),
    allowWhileIdle: true,
    repeatTime: 1,
  });
}