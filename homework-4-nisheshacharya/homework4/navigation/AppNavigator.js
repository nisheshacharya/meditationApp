
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import ReminderScreen from '../screens/ReminderScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { HistoryProvider } from '../context/HistoryContext';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <HistoryProvider>
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Reminder" component={ReminderScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
    </HistoryProvider>
  );
}


