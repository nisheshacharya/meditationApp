// screens/ProfileScreen.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { HistoryContext } from '../context/HistoryContext';

export default function ProfileScreen() {
  const { history } = useContext(HistoryContext);

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
