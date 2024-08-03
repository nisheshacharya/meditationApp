// screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const [historyDisplay, setHistoryDisplay] = useState(false);
  const [history, setHistory] = useState([
    // Sample history data
    { year: 2024, month: 7, day: 28, hour: 14, minute: 30, duration: '30 minutes' },
    { year: 2024, month: 7, day: 27, hour: 12, minute: 0, duration: '20 minutes' },
  ]);

  const [name, setName] = useState('');
  const [dailyGoal, setDailyGoal] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load saved data from AsyncStorage on component mount
    const loadData = async () => {
      try {
        const savedName = await AsyncStorage.getItem('name');
        const savedGoal = await AsyncStorage.getItem('dailyGoal');
        if (savedName !== null) setName(savedName);
        if (savedGoal !== null) setDailyGoal(savedGoal);
      } catch (error) {
        console.error('Failed to load data', error);
      }
    };
    loadData();
  }, []);

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('name', name);
      await AsyncStorage.setItem('dailyGoal', dailyGoal);
    } catch (error) {
      console.error('Failed to save data', error);
    }
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Screen</Text>
      {isEditing ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter daily meditation goal"
            value={dailyGoal}
            onChangeText={setDailyGoal}
            keyboardType="numeric"
          />
          <Button title="Save" onPress={handleSave} />
        </View>
      ) : (
        <View style={styles.profileContainer}>
          <Text style={styles.profileText}>Name: {name}</Text>
          <Text style={styles.profileText}>Daily Goal: {dailyGoal} minutes</Text>
          <Button title="Edit" onPress={() => setIsEditing(true)} />
        </View>
      )}
      <View style={styles.history}>
        <TouchableOpacity onPress={() => setHistoryDisplay(!historyDisplay)}>
          <Text style={styles.historyTitle}>Meditation History</Text>
        </TouchableOpacity>

        {historyDisplay && (
          <ScrollView style={styles.historyContainer}>
            {history.map((entry, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyText}>
                  {`${entry.year}-${entry.month}-${entry.day} ${entry.hour}:${entry.minute} - Duration: ${entry.duration}`}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileText: {
    fontSize: 18,
    marginVertical: 5,
  },
  history: {
    flex: 1,
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyContainer: {
    width: '100%',
    padding: 10,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  historyItem: {
    padding: 10,
    marginBottom: 5,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  historyText: {
    fontSize: 18,
  },
});
