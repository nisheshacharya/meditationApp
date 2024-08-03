// screens/HomeScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { Button, Image, StyleSheet, View, ImageBackground, TextInput, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { HistoryContext } from '../context/HistoryContext';

const backgroundImage = require("../media/Meditate.gif");
const meditationImage = require("../media/meditation.jpg");

export default function HomeScreen() {
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [time, setTime] = useState({ med_minutes: 0, med_seconds: 0, rest_minutes: 0, rest_seconds: 0 });
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState('meditation');
  const [sound1, setSound1] = useState(null);
  const [sound2, setSound2] = useState(null);
  const [background, setBackground] = useState(backgroundImage);
  const [historyDisplay, setHistoryDisplay] = useState(false);

  // Context for managing meditation history
  const { history, setHistory } = useContext(HistoryContext);

  useEffect(() => {
    const loadSounds = async () => {
      const { sound: sound1Instance } = await Audio.Sound.createAsync(require('../media/sound1.mp3'));
      setSound1(sound1Instance);

      const { sound: sound2Instance } = await Audio.Sound.createAsync(require('../media/sound2.mp3'));
      setSound2(sound2Instance);
    };
    loadSounds();

    return () => {
      if (sound1) sound1.unloadAsync();
      if (sound2) sound2.unloadAsync();
    };
  }, []);

  useEffect(() => {
    if (started && !paused) {
      const medTime = time.med_minutes * 60 + time.med_seconds;
      const restTime = time.rest_minutes * 60 + time.rest_seconds;
      const total = medTime + restTime;
      const interval = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount <= 0) {
            clearInterval(interval);
            return 0;
          }

          const newCount = prevCount - 1;
          if (total - newCount === restTime) {
            sound1.playAsync();
            setBackground(meditationImage);
            setPhase('rest');
          }

          if (total - newCount === total) {
            sound2.playAsync();
            setBackground(backgroundImage);
            setStarted(false);
            setPaused(false);
            saveMeditationHistory();
          }

          return newCount;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [started, paused, sound1, sound2, time]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const textChange = (field, text) => {
    const newValue = Math.min(parseInt(text) || 0, 60);
    setTime({ ...time, [field]: newValue });
  };

  const start = () => {
    const totalMeditation = time.med_minutes * 60 + time.med_seconds;
    const total = totalMeditation + time.rest_minutes * 60 + time.rest_seconds;
    setCount(total);
    setStarted(true);
  };

  const stop = () => {
    setStarted(false);
    setCount(0);
    setBackground(backgroundImage);
  };

  const pause = () => {
    setPaused(!paused);
  };

  const resume = () => {
    setPaused(false);
  };

  const saveMeditationHistory = () => {
    Alert.alert("Meditation Complete", "Your meditation session has been saved.");
    const currentDate = new Date();
    const newEntry = {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      day: currentDate.getDate(),
      hour: currentDate.getHours(),
      minute: currentDate.getMinutes(),
      duration: formatTime(count),
    };
    setHistory([...history, newEntry]);
  };

  return (
    <ImageBackground source={background} style={styles.background}>
      <View style={styles.content}>
        <Image source={require('../media/AppLogo.png')} style={styles.logo} />
        <Text style={styles.text}>{formatTime(count)}</Text>
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
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
          <View style={styles.inputRow}>
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
        <View style={styles.buttonContainer}>
          {started ? (
            <TouchableOpacity style={styles.button} onPress={stop}>
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={start}>
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
          )}
          {started && !paused ? (
            <TouchableOpacity style={styles.button} onPress={pause}>
              <Text style={styles.buttonText}>Pause</Text>
            </TouchableOpacity>
          ) : null}
          {started && paused ? (
            <TouchableOpacity style={styles.button} onPress={resume}>
              <Text style={styles.buttonText}>Resume</Text>
            </TouchableOpacity>
          ) : null}
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
    width: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  text: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
  inputContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  inputRow: {
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
  },
  history: {
    marginTop: 20,
    width: '100%',
  },
  historyContainer: {
    marginTop: 10,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});
