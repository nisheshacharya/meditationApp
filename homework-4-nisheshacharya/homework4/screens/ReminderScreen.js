import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ReminderScreen() {
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDayPress = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Reminder</Text>
      
      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.timePicker}>
        <Text style={styles.timeText}>
          {`${reminderTime.getHours()}:${reminderTime.getMinutes() < 10 ? '0' : ''}${reminderTime.getMinutes()}`}
        </Text>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={reminderTime}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) {
              setReminderTime(selectedTime);
            }
          }}
        />
      )}

      <View style={styles.daysContainer}>
        {daysOfWeek.map((day) => (
          <TouchableOpacity
            key={day}
            onPress={() => handleDayPress(day)}
            style={[
              styles.dayButton,
              selectedDays.includes(day) && styles.dayButtonSelected,
            ]}
          >
            <Text
              style={[
                styles.dayButtonText,
                selectedDays.includes(day) && styles.dayButtonTextSelected,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  timePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  timeText: {
    fontSize: 18,
    color: '#333',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  dayButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    margin: 5,
    minWidth: 40,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  dayButtonSelected: {
    backgroundColor: '#4caf50',
    borderColor: '#388e3c',
  },
  dayButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dayButtonTextSelected: {
    color: '#fff',
  },
});
