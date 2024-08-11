import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';


export default function ProfileScreen() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = async () => {
    try {
      let localHistory = await AsyncStorage.getItem('meditationHistory');
      if (localHistory) {
        setHistory(JSON.parse(localHistory));
      }
    } catch (error) {
      console.log("Error fetching history:", error);
    }
  };

  const exportHistoryAsTxt = async () => {
    if (history.length === 0) {
      Alert.alert("No history available to export.");
      return;
    }
  
    const fileName = 'meditation_history.txt';
    const directory = FileSystem.documentDirectory;
  
    let historyText = history.map(entry => {
      return `Date: ${entry.year}-${entry.month}-${entry.day}\nTime: ${entry.hour}:${entry.minute}\nDuration: ${entry.duration}\n\n`;
    }).join('');
  
    try {
      const filePath = `${directory}${fileName}`;
      await FileSystem.writeAsStringAsync(filePath, historyText);
      Alert.alert('Export Successful!', `Meditation history saved to "${fileName}" in app storage.`);
    } catch (error) {
      console.error('Error exporting history:', error);
      Alert.alert('Export Failed!', 'An error occurred while exporting history.');
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.label}>Meditation History</Text>
      <ScrollView style={styles.historyContainer}>
        {history.length > 0 ? (
          history.map((entry, index) => (
            <View key={index} style={styles.historyEntry}>
              <Text style={styles.date}>{`${entry.year}-${entry.month}-${entry.day}`}</Text>
              <Text style={styles.time}>{`${entry.hour}:${entry.minute}`}</Text>
              <Text style={styles.duration}>{`Duration: ${entry.duration}`}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noHistory}>No meditation history available.</Text>
        )}
      </ScrollView>
      <Button title="Export History as TXT" onPress={exportHistoryAsTxt} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  historyContainer: {
    flex: 1,
  },
  historyEntry: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 16,
  },
  duration: {
    fontSize: 16,
    color: '#555',
  },
  noHistory: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
  },
});
