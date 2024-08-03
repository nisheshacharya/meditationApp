import React, { useState } from 'react';
import { Button, Platform, View, Text, StyleSheet, CheckBox } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-notifications';  // Updated import for permissions

export default function ReminderScreen() {
  const [reminderTime, setReminderTime] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status } = await Permissions.getPermissionsAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      const { status: newStatus } = await Permissions.requestPermissionsAsync(Permissions.NOTIFICATIONS);
      if (newStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
    }
    
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
    return token;
  }

  async function schedulePushNotification() {
    if (!reminderTime || !selectedDays.length) return;

    for (const day of selectedDays) {
      const reminderDate = new Date();
      reminderDate.setHours(reminderTime.getHours());
      reminderDate.setMinutes(reminderTime.getMinutes());
      reminderDate.setSeconds(0);

      const dayOffset = (day - reminderDate.getDay() + 7) % 7;
      reminderDate.setDate(reminderDate.getDate() + dayOffset);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Time for Meditation! 🧘‍♂️",
          body: 'Start your daily meditation now!',
        },
        trigger: {
          year: reminderDate.getFullYear(),
          month: reminderDate.getMonth() + 1,
          day: reminderDate.getDate(),
          hour: reminderDate.getHours(),
          minute: reminderDate.getMinutes(),
          repeats: true,
        },
      });
    }
  }

  const toggleDay = (day) => {
    setSelectedDays(prevState =>
      prevState.includes(day) ? prevState.filter(d => d !== day) : [...prevState, day]
    );
  };

  return (
    <View style={styles.container}>
      <Text>Select Time for Reminder:</Text>
      <Button title="Select Time" onPress={() => setShowTimePicker(true)} />
      {showTimePicker && (
        <DateTimePicker
          value={reminderTime}
          mode="time"
          is24Hour={true}
          onChange={(event, selectedDate) => {
            setShowTimePicker(false);
            if (selectedDate) {
              setReminderTime(selectedDate);
            }
          }}
        />
      )}

      <Text>Select Days of the Week:</Text>
      <View style={styles.dayContainer}>
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
          <View key={index} style={styles.dayRow}>
            <CheckBox
              value={selectedDays.includes(index)}
              onValueChange={() => toggleDay(index)}
            />
            <Text>{day}</Text>
          </View>
        ))}
      </View>

      <Button
        title="Schedule Reminder"
        onPress={schedulePushNotification}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dayContainer: {
    marginTop: 20,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
});
