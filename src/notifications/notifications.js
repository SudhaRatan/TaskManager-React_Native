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

export const testScheduleNotification = (date, data, id) => {
  PushNotification.localNotificationSchedule({
    id: `${id}`,
    channelId: "mainNotis",
    title: data.title,
    message: data.message,
    playSound: true,
    soundName: "default",
    date: new Date(date),
    allowWhileIdle: true,
    repeatTime: 1,
  });
}

export const cancelNotification = (id) => {
  PushNotification.cancelLocalNotification(id)
}

export const getScheduledNotificationsArray = () => {
  PushNotification.getScheduledLocalNotifications(arr => {
    arr.map(arr1 => {
      console.log(arr1)
    })
  });
  // PushNotification.cancelAllLocalNotifications()
}