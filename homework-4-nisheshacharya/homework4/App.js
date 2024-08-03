import React, { useState, useEffect, useRef } from 'react';
import {Image, Button, StyleSheet, View, ImageBackground, TextInput, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [time, setTime] = useState({ med_minutes: 0, med_seconds: 0, rest_minutes: 0, rest_seconds: 0 });
  const [backgroundImage, setBackgroundImage] = useState(require('./media/Meditate.gif'));
  const [color, setColor] = useState('white');
  const ref = useRef(null);
  const [soundStart, setSoundStart] = useState(null);
  const [soundEnd, setSoundEnd] = useState(null);
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [historyDisplay, setHistoryDisplay] = useState(false);

  // Load sounds
  useEffect(() => {
    const loadSounds = async () => {
      const { sound: soundStart } = await Audio.Sound.createAsync(require('./media/sound1.mp3'));
      const { sound: soundEnd } = await Audio.Sound.createAsync(require('./media/sound2.mp3'));
      setSoundStart(soundStart);
      setSoundEnd(soundEnd);
    };

    loadSounds();
  }, []);

  // Request notification permissions
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('You need to enable notifications in settings.');
      }
    };

    if (Device.isDevice) {
      requestPermissions();
    } else {
      alert('Must use physical device for Push Notifications');
    }
  }, []);

  // Schedule a notification
  const scheduleNotification = async (timeInSeconds) => {
    const trigger = new Date(Date.now() + timeInSeconds * 1000);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Meditation Time",
        body: "It's time to start your meditation session!",
        sound: true,
      },
      trigger,
    });
  };

  const clearTimer = () => {
    if (ref.current) {
      clearInterval(ref.current);
      ref.current = null;
    }
  };

  const reset = () => {
    clearTimer();
    setColor('white');
    setStarted(false);
    setPaused(false);
    setBackgroundImage(require('./media/Meditate.gif'));
  };

  const startTimer = () => {
    clearTimer();
    ref.current = setInterval(() => {
      setCount((prev) => {
        const restTimeInSeconds = time.rest_minutes * 60 + time.rest_seconds;

        if (prev > restTimeInSeconds) {
          setColor('green');
        }
        if (prev === restTimeInSeconds) {
          setColor('orange');
          playSound(soundStart); // Play sound when rest time starts
          setBackgroundImage(require('./media/Rest.gif')); // Change background image
        }
        if (prev > 0) {
          return prev - 1;
        }
        playSound(soundEnd); // Play sound when rest time ends
        saveHistory();
        reset();
        showSummary();
        return getTotalSeconds();
      });
    }, 1000);
  };

  const playSound = async (sound) => {
    if (sound) {
      await sound.playAsync();
    }
  };

  const start = () => {
    setStarted(true);
    setColor('green');
    startTimer();
    // Schedule a notification for the meditation start time
    const totalSeconds = time.med_minutes * 60 + time.med_seconds;
    scheduleNotification(totalSeconds);
  };

  const stop = () => {
    reset();
    setCount(getTotalSeconds());
    saveHistory();
  };

  const pause = () => {
    clearTimer();
    setPaused(!paused);
  };

  const resume = () => {
    startTimer();
    setPaused(!paused);
  };

  const textChange = (field, text) => {
    const newValue = parseInt(text) || 0;
    setTime({ ...time, [field]: newValue });
  };

  const saveHistory = async () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString();
    const day = currentDate.getDate().toString();
    const hour = currentDate.getHours().toString().padStart(2, '0');
    const minute = currentDate.getMinutes().toString().padStart(2, '0');

    const newEntry = { year, month, day, hour, minute };
    const updatedHistory = [...history, newEntry];
    setHistory(updatedHistory);

    try {
      await AsyncStorage.setItem('meditationHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving history to AsyncStorage:', error);
    }
  };

  const showSummary = () => {
    const totalMinutes = time.med_minutes + Math.floor(time.med_seconds / 60);
    const totalSeconds = time.med_seconds % 60;
    Alert.alert(
      'Meditation Summary',
      `Meditation Duration: ${totalMinutes} minutes ${totalSeconds} seconds`,
      [{ text: 'OK' }]
    );
  };

  useEffect(() => {
    setCount(getTotalSeconds());

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

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTotalSeconds = () => {
    return time.med_minutes * 60 + time.med_seconds + time.rest_minutes * 60 + time.rest_seconds;
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.content}>
        <Image source={require('./media/AppLogo.png')} style={styles.logo} />
        <Text style={styles.text}>{formatTime(count)}</Text>
        <View style={styles.inputContainer}>
          <View style={styles.inputGroup}>
            <TextInput
              placeholder='Min'
              onChangeText={(text) => textChange('med_minutes', text)}
              keyboardType='numeric'
              style={styles.inputField}
            />
            <TextInput
              placeholder='Sec'
              onChangeText={(text) => textChange('med_seconds', text)}
              keyboardType='numeric'
              style={styles.inputField}
            />
          </View>
          <Text style={styles.label}>Meditation Time</Text>

          <View style={styles.gap} />

          <View style={styles.inputGroup}>
            <TextInput
              placeholder='Min'
              onChangeText={(text) => textChange('rest_minutes', text)}
              keyboardType='numeric'
              style={styles.inputField}
            />
            <TextInput
              placeholder='Sec'
              onChangeText={(text) => textChange('rest_seconds', text)}
              keyboardType='numeric'
              style={styles.inputField}
            />
          </View>
          <Text style={styles.label}>Rest Time</Text>
        </View>

        {started ? <Button title='Stop' onPress={stop} /> : <Button title='Start' onPress={start} />}
        {started && !paused ? <Button title='Pause' onPress={pause} /> : null}
        {started && paused ? <Button title='Resume' onPress={resume} /> : null}

        <View style={styles.history}>
          <TouchableOpacity onPressOut={() => setHistoryDisplay(!historyDisplay)}>
            <Text style={styles.historyTitle}>Meditation History</Text>
          </TouchableOpacity>

          {historyDisplay && (
            <ScrollView style={styles.historyContainer}>
              {history.map((entry, index) => (
                <View key={index} style={styles.historyItem}>
                  <Text style={styles.historyText}>
                    {`${entry.year}-${entry.month}-${entry.day} ${entry.hour}:${entry.minute}`}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  text: {
    color: 'white',
    fontSize: 24,
  },
  inputContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputField: {
    width: 80,
    marginHorizontal: 5,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: 'black',
    textAlign: 'center',
  },
  label: {
    color: 'white',
    marginTop: 5,
  },
  gap: {
    height: 20,
  },
  history: {
    flex: 1,
    padding: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  historyTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyContainer: {
    width: '100%',
    padding: 10,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  historyItem: {
    padding: 10,
    marginBottom: 5,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
  },
  historyText: {
    color: 'white',
    fontSize: 18,
  },
});
