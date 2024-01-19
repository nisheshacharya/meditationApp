import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, View, Image, TextInput, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [time, setTime] = useState({ med_time: 0, rest_time: 0 });
  const [color, setColor] = useState('white');
  const ref = useRef(null);
  const initialCount = time.med_time + time.rest_time;
  const [count, setCount] = useState(initialCount);
  const [history, setHistory] = useState([]);
  const [historyDisplay, setHistoryDisplay] = useState(false);

  const clearTimer = () => {
    if (ref.current) {
      clearInterval(ref.current);
      ref.current = null;
    }
  }

  const reset = () => {
    clearTimer();
    setColor('white');
    setStarted(false);
    setPaused(false);
  }

  const startTimer = () => {
    clearTimer();
    ref.current = setInterval(() => {
      setCount(prev => {
        if (prev > time.rest_time) {
          setColor('green');
        }
        if (prev === time.rest_time) {
          setColor('orange');
        }
        if (prev > 0) {
          return prev - 1;
        }
        saveHistory();
        reset();
        return time.med_time + time.rest_time;
      });
    }, 1000)
  }

  const start = () => {
    setStarted(true);
    setColor("green");
    startTimer();
  }

  const stop = () => {
    reset();
    setCount(initialCount);
    saveHistory();
  }

  const pause = () => {
    clearTimer();
    setPaused(!paused);
  }

  const resume = () => {
    startTimer();
    setPaused(!paused);
  }

  const textChange = (field, text) => {
    const newValue = parseInt(text) || 0;
    setTime({ ...time, [field]: newValue });
  }

  const saveHistory = async () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString();
    const day = currentDate.getDate().toString();
    const hour = currentDate.getHours().toString().padStart(2, '0');
    const minute = currentDate.getMinutes().toString().padStart(2, '0');

    console.log(year, month, day, hour, minute);

    const newEntry = { year, month, day, hour, minute };
    const updatedHistory = [...history, newEntry];
    setHistory(updatedHistory);

    try {
      await AsyncStorage.setItem('meditationHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving history to AsyncStorage:', error);
    }
  }

  useEffect(() => {
    const newCount = time.med_time + time.rest_time;
    setCount(newCount);

    // Load history 
    const loadHistory = async () => {
      try {
        const savedHistory = await AsyncStorage.getItem('meditationHistory');
        if (savedHistory !== null) {
          setHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error('Error loading history from AsyncStorage:', error);
      }
    };

    loadHistory();
  }, [time]);

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <Image source={require('./media/meditation.jpg')} style={styles.imageContainer} />
      <Text> {count.toString()}</Text>
      <View style={styles.inputContainer}>
        <View style={styles.textInput}>
          <TextInput
            placeholder='Meditation Time'
            onChangeText={(text) => textChange('med_time', text)}
          />
        </View>
        <View style={styles.textInput}>
          <TextInput
            placeholder='Rest Time'
            onChangeText={(text) => textChange('rest_time', text)}
          />
        </View>
      </View>
      {started ? <Button title='Stop' onPress={stop} /> : <Button title="Start" onPress={start} />}
      {started && !paused ? <Button title='Pause' onPress={pause} /> : null}
      {started && paused ? <Button title='Resume' onPress={resume} /> : null}
      <View style={styles.history}>
        <TouchableOpacity onPressOut={() => setHistoryDisplay(!historyDisplay)}>
          <Text>Meditation History</Text>
        </TouchableOpacity>

        {historyDisplay &&
          <ScrollView style={styles.historyContainer}>
            {history.map((entry, index) => (
              <Text key={index}>
                {`${entry.year}-${entry.month}-${entry.day} ${entry.hour}:${entry.minute}`}
              </Text>
            ))}
          </ScrollView>
        }

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: 200,
    height: 200,
    marginTop: 50
  },
  inputContainer: {
    flex: 0.5,
    flexDirection: 'row',
    padding: 2,
    height: 10,

  },
  textInput: {
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 10,
    padding: 2,
    margin: 5,
    height: 25,
    width: 100
  },
  history: {
    flex: 1,
    padding: 5,
  },
  historyContainer: {
    padding: 4,
    margin: 5,
    borderColor: 'gray',
    borderWidth: 2,
    height: 30,
    borderRadius: 10
  }
});
