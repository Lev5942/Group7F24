import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const MainPage = ({
  onLoginPress,
  onLogoutPress,
  onStartTripPress,
  onHistoryPress,
  isLoggedIn,
}) => {
  const [averageScore, setAverageScore] = useState(0);

  // Function to fetch the average score from the backend
  const fetchDriverScore = async () => {
    try {
      const response = await axios.get('http://192.168.0.18:5000/api/averageScore'); // Replace with backend URL
      console.log('Backend response:', response.data); // Log the backend response
  
      const avgScore = response.data.averageScore;
  
      if (typeof avgScore === 'number' && !isNaN(avgScore)) {
        setAverageScore(avgScore.toFixed(2));
      } else {
        console.error('Invalid score data:', avgScore);
        setAverageScore(0); // Default to 0 if invalid
      }
    } catch (error) {
      console.error('Error fetching average score:', error);
      setAverageScore(0); // Default to 0 in case of error
    }
  };
  
  // Fetch the driver's score when the user logs in or the page loads
  useEffect(() => {
    if (isLoggedIn) {
      fetchDriverScore();
    }
  }, [isLoggedIn]);

  // Handle restricted actions for logged-out users
  const handleRestrictedAction = (action) => {
    if (isLoggedIn) {
      action();
    } else {
      Alert.alert('Access Denied', 'You must log in first to access this feature.');
    }
  };

  return (
    
    <View style={styles.mainContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Welcome to DriveMate</Text>
        {isLoggedIn && (
          <Text style={styles.averageScore}>Driver Score: {averageScore}</Text>
        )}
      </View>

      <TouchableOpacity
        onPress={() => handleRestrictedAction(onHistoryPress)}
        style={styles.historyContainer}
      >
        <View style={styles.smallCircle}>
          <Text style={styles.smallCircleText}>History</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleRestrictedAction(onStartTripPress)}
        style={styles.startTripContainer}
      >
        <View style={styles.circle} />
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
              Please{' '}
              <TouchableOpacity onPress={onLoginPress}>
                <Text style={styles.loginLink}>log in</Text>
              </TouchableOpacity>{' '}
              to access features
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'white',
  },
  averageScore: {
    fontSize: 20,
    color: 'lightgreen',
    marginTop: 10,
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
  historyContainer: {
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
