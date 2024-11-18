import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const MainPage = ({ onLoginPress, onStartTripPress, onHistoryPress, isLoggedIn }) => (
  <View style={styles.mainContainer}>
    <Text style={styles.title}>Welcome to DriveMate</Text>
    <Button title="Login" onPress={onLoginPress} />
    <Button title="Start Trip" onPress={onStartTripPress} style={styles.button} />
    <Button title="History"       
      onPress={onHistoryPress}
      disabled={!isLoggedIn} // disable when not login
      style={styles.button} 
    />
  </View>
);

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
  },
});

export default MainPage;
