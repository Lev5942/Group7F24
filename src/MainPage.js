import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import axios from 'axios';

const BACKEND_URL = 'http://192.168.68.55:5000';

const MainPage = ({
  onLoginPress,
  onLogoutPress,
  onStartTripPress,
  onHistoryPress,
  isLoggedIn,
}) => {
  const [averageScore, setAverageScore] = useState(0);
  const [circleScale] = useState(new Animated.Value(1));
  const [smallCircleScale] = useState(new Animated.Value(1));
  const [isAnimating, setIsAnimating] = useState(false);

  // Function to fetch the average score from the backend
  const fetchDriverScore = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/averageScore`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Backend response:', response.data);

      const avgScore = response.data.averageScore;

      if (typeof avgScore === 'number' && !isNaN(avgScore)) {
        setAverageScore(avgScore.toFixed(2));
      } else {
        console.error('Invalid score data:', avgScore);
        setAverageScore(0);
      }
    } catch (error) {
      console.error('Error fetching average score:', error);
      setAverageScore(0);
    }
  };

  // Fetch the driver's score when the user logs in or the page loads
  useEffect(() => {
    if (isLoggedIn) {
      fetchDriverScore();
    }
  }, [isLoggedIn]);

  // Animation of login user
  const startTripAnimation = Animated.timing(circleScale, {
    toValue: 15,
    duration: 700,
    useNativeDriver: true,
  });

  const historyAnimation = Animated.timing(smallCircleScale, {
    toValue: 20,
    duration: 700,
    useNativeDriver: true,
  });

  // Handle restricted actions for login/logged-out users
  const handleRestrictedAction = (action, animation) => {
    if (isLoggedIn) {
      animation.start(() => {
        setIsAnimating(false);
        action();
      });
      
    } else {
      setIsAnimating(false);
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
        onPress={() => handleRestrictedAction(onHistoryPress, historyAnimation, setIsAnimating(true))}
        style={styles.historyContainer}
      >
        <Animated.View style={[styles.smallCircle, { transform: [{ scale: smallCircleScale }] }]}>
          {!isAnimating && (
            <Text style={styles.smallCircleText}>History</Text>
          )}
        </Animated.View>
      </TouchableOpacity>

      {!isAnimating && (
      <TouchableOpacity
        onPress={() => handleRestrictedAction(onStartTripPress, startTripAnimation)}
        style={styles.startTripContainer}
      >
        <Animated.View style={[styles.circle, { transform: [{ scale: circleScale }] }]} />

        <View style={styles.circleTextContainer}>
          <Text style={styles.circleText}>Start Trip</Text>
        </View>
      </TouchableOpacity>
      )}

      {!isAnimating && (
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
      )}
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
    fontSize: 19,
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
    fontSize: 18,
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
