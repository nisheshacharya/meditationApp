import React, { useState } from 'react';
import { Button, Platform, View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Checkbox } from 'expo-checkbox';
import * as Notifications from 'expo-notifications';

export default function ReminderScreen() {
  const [reminders, setReminders] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState([]);
  const [showReminderSettings, setShowReminderSettings] = useState(false);

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
    return token;
  }

  async function scheduleReminders() {
    if (reminders.length === 0) {
      Alert.alert('No Reminders', 'Please add reminders before scheduling.');
      return;
    }

    try {
      for (const reminder of reminders) {
        const { time, days } = reminder;
        for (const day of days) {
          const reminderDate = new Date();
          reminderDate.setHours(time.getHours());
          reminderDate.setMinutes(time.getMinutes());
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

      Alert.alert('Reminders Scheduled', 'Your meditation reminders have been set.');
    } catch (error) {
      console.error('Error scheduling reminders:', error);
      Alert.alert('Scheduling Error', 'An error occurred while scheduling reminders.');
    }
  }

  const toggleDay = (day) => {
    setSelectedDays(prevState =>
      prevState.includes(day) ? prevState.filter(d => d !== day) : [...prevState, day]
    );
  };

  const addReminder = () => {
    if (selectedDays.length > 0) {
      const newReminder = {
        time: selectedTime,
        days: selectedDays,
      };
      setReminders([...reminders, newReminder]);
      setSelectedDays([]);
      setShowTimePicker(false);
      setShowReminderSettings(false);
    }
  };

  const dayButtons = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
    <TouchableOpacity
      key={index}
      style={[styles.dayButton, selectedDays.includes(index) ? styles.selectedDayButton : styles.unselectedDayButton]}
      onPress={() => toggleDay(index)}
    >
      <Text style={[styles.dayButtonText, selectedDays.includes(index) ? styles.selectedDayButtonText : styles.unselectedDayButtonText]}>
        {day}
      </Text>
    </TouchableOpacity>
  ));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowReminderSettings(!showReminderSettings)}
      >
        <Text style={styles.toggleButtonText}>
          {showReminderSettings ? "Hide Reminder Settings" : "Schedule Reminders"}
        </Text>
      </TouchableOpacity>

      {showReminderSettings && (
        <View style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Select Time for Reminder:</Text>
          <Button title="Select Time" onPress={() => setShowTimePicker(true)} />
          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour={true}
              onChange={(event, selectedDate) => {
                setShowTimePicker(false);
                if (selectedDate) {
                  setSelectedTime(selectedDate);
                }
              }}
            />
          )}

          <Text style={styles.sectionTitle}>Select Days of the Week:</Text>
          <View style={styles.dayContainer}>
            {dayButtons}
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={addReminder}
          >
            <Text style={styles.addButtonText}>Add Reminder</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.scheduleButton}
        onPress={scheduleReminders}
      >
        <Text style={styles.scheduleButtonText}>Schedule All Reminders</Text>
      </TouchableOpacity>

      {reminders.length > 0 && (
        <View style={styles.remindersContainer}>
          <Text style={styles.remindersTitle}>Scheduled Reminders:</Text>
          {reminders.map((reminder, index) => (
            <Text key={index} style={styles.reminderText}>
              {`Time: ${reminder.time.getHours()}:${reminder.time.getMinutes()} - Days: ${reminder.days.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ')}`}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  toggleButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  dayContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  dayButton: {
    margin: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  selectedDayButton: {
    backgroundColor: '#007BFF',
  },
  unselectedDayButton: {
    backgroundColor: '#e0e0e0',
  },
  dayButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedDayButtonText: {
    color: '#fff',
  },
  unselectedDayButtonText: {
    color: '#333',
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scheduleButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  scheduleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  remindersContainer: {
    marginTop: 20,
  },
  remindersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  reminderText: {
    fontSize: 16,
    marginVertical: 5,
  },
});
