// screens/HomeScreen.js
import React, { useState } from 'react';
import {
  ImageBackground,
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Image,
} from 'react-native';

// Import the background image
const backgroundImage = require('../media/Meditate.gif'); // Replace with your actual background image path

export default function HomeScreen({ navigation }) {
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [time, setTime] = useState({ med_minutes: 0, med_seconds: 0, rest_minutes: 0, rest_seconds: 0 });
  const [count, setCount] = useState(0);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const textChange = (field, text) => {
    const newValue = parseInt(text) || 0;
    setTime({ ...time, [field]: newValue });
  };

  const start = () => {
    setStarted(true);
  };

  const stop = () => {
    setStarted(false);
  };

  const pause = () => {
    setPaused(!paused);
  };

  const resume = () => {
    setPaused(!paused);
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.text}>Meditation for Inner Peace</Text>
        <View style={styles.content}>
          <Image source={require('../media/AppLogo.png')} style={styles.logo} />
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
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
});
