import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const MainPage = ({ onLoginPress, onLogoutPress, onStartTripPress, onHistoryPress, isLoggedIn }) => {
  const [circleScale] = useState(new Animated.Value(1));

  const handleStartTrip = () => {
    Animated.timing(circleScale, {
      toValue: 20,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      onStartTripPress();
    });
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Welcome to DriveMate</Text>
      </View>

      <TouchableOpacity onPress={onHistoryPress} style={styles.historyContainerRight}>
        <View style={styles.smallCircle}>
          <Text style={styles.smallCircleText}>History</Text>
        </View>
      </TouchableOpacity> 

      <TouchableOpacity onPress={handleStartTrip} style={styles.startTripContainer}>
        <Animated.View style={[styles.circle, { transform: [{ scale: circleScale }] }]} />
        <View style={styles.circleTextContainer}>
          <Text style={styles.circleText}>Start Trip</Text>
        </View>
      </TouchableOpacity>

       


      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>
          {isLoggedIn ? (
            <TouchableOpacity onPress={onLogoutPress}>
              <Text style={styles.loginLink}>Log out</Text>
            </TouchableOpacity>
            ) : (
            <Text>
              Please <TouchableOpacity onPress={onLoginPress}>
                <Text style={styles.loginLink}>log in</Text>
              </TouchableOpacity> to access features
            </Text>
          )}
        </Text>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    position: 'absolute',
    top: '10%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  startTripContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: '#007AFF',
    position: 'absolute',
  },
  circleTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyContainerRight: {
    position: 'absolute',
    left: '59%',
    bottom: '12%',
  },
  smallCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#66C8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallCircleText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#555',
  },
  loginContainer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  loginText: {
    color: 'white',
    fontSize: 16,
  },
  loginLink: {
    position: 'relative',
    top: 5,
    color: '#007AFF',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});

export default MainPage;
