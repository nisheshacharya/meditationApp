// screens/HomeScreen.js
import React, {useState} from 'react';
import { ImageBackground, View, Text, StyleSheet, Button, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
const backgroundImage = require('../media/Meditate.gif')


export default function HomeScreen({ navigation }) {
    // Define state variables
    const [started, setStarted] = useState(false);
    const [paused, setPaused] = useState(false);
    const [time, setTime] = useState({ med_minutes: 0, med_seconds: 0, rest_minutes: 0, rest_seconds: 0 });
    const [history, setHistory] = useState([]);
    const [historyDisplay, setHistoryDisplay] = useState(false);
    const [count, setCount] = useState(0);
  
    // Dummy implementations for formatTime and textChange
    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };
  
    const textChange = (field, text) => {
      const newValue = parseInt(text) || 0;
      setTime({ ...time, [field]: newValue });
    };
  
    // Dummy implementations for start, stop, pause, resume, and saveHistory
    const start = () => {
      setStarted(true);
      // Add your start logic here
    };
  
    const stop = () => {
      setStarted(false);
      // Add your stop logic here
    };
  
    const pause = () => {
      setPaused(!paused);
      // Add your pause logic here
    };
  
    const resume = () => {
      setPaused(!paused);
      // Add your resume logic here
    };
  
    const saveHistory = () => {
      // Add your history saving logic here
    };
  
    return (
      <ImageBackground source={backgroundImage} style={styles.background}>
        <View style={styles.container}>
          <Text style={styles.text}>Home Screen</Text>
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