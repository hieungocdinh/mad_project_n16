import * as Notifications from "expo-notifications";

export const schedulePushNotification = async (date: any, message: any) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🔔 Nhắc nhở!",
      body: message,
    },
    trigger: {
      type: date,
      date: new Date(date),
    },
  });
};
