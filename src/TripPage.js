import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import Speedometer, {
  Background,
  Arc,
  Needle,
  Progress,
  Marks,
  Indicator,
} from 'react-native-cool-speedometer';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

const TripPage = ({ onCancel }) => {
  const [speed, setSpeed] = useState(0);
  const [acceleration, setAcceleration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [warningsCount, setWarningsCount] = useState(0);
  const [speedLimit, setSpeedLimit] = useState(50); // Default speed limit
  const [currentStreet, setCurrentStreet] = useState('No street');
  const [isWarningActive, setIsWarningActive] = useState(false);

  const [maxSpeed, setMaxSpeed] = useState(100); // Randomized maximum speed
  const [startTime, setStartTime] = useState(new Date());
  const [totalSpeed, setTotalSpeed] = useState(0);
  const [speedReadings, setSpeedReadings] = useState(0);

  // Load streets from backend
  useEffect(() => {
    axios
      .get('http://192.168.0.18:5000/api/streets')
      .then((response) => {
        if (response.data.length > 0) {
          const randomStreet =
            response.data[Math.floor(Math.random() * response.data.length)];
          setCurrentStreet(randomStreet.name);
          setSpeedLimit(randomStreet.speed_limit);
        }
      })
      .catch((error) => console.error('Error fetching streets:', error));
  }, []);

  // Simulate real-time updates for speed and distance
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed((prev) => {
        const newSpeed = Math.min(
          Math.max(prev + (Math.random() - 0.45) * 15, 0), // Gradual increase/decrease
          maxSpeed
        );
        setAcceleration((newSpeed - prev) / 3.6); // Calculate acceleration (m/s^2)
        return newSpeed;
      });

      setDistance((prev) => prev + speed / 3.6); // Distance in meters (speed in km/h)
      setTotalSpeed((prev) => prev + speed); // Sum up speed for average calculation
      setSpeedReadings((prev) => prev + 1); // Increment speed readings count
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [speed, maxSpeed]);

  // Update street and speed limit every minute
  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get('http://192.168.0.18:5000/api/streets')
        .then((response) => {
          if (response.data.length > 0) {
            const randomStreet =
              response.data[Math.floor(Math.random() * response.data.length)];
            setCurrentStreet(randomStreet.name);
            setSpeedLimit(randomStreet.speed_limit);
          }
        })
        .catch((error) => console.error('Error fetching streets:', error));
    }, 60000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Monitor warnings
  useEffect(() => {
    if (speed > speedLimit) {
      if (!isWarningActive) {
        setWarningsCount((prev) => prev + 1); // Count the warning
        setIsWarningActive(true);
      }
    } else {
      setIsWarningActive(false); // Reset warning state
    }
  }, [speed, speedLimit]);

  const handleEndTrip = async () => {
    const duration = (new Date() - startTime) / 1000; // Duration in seconds
    const durationString = `${Math.floor(duration / 60)} min ${(
      duration % 60
    ).toFixed(0)} sec`;
    const averageSpeed =
      speedReadings > 0 ? totalSpeed / speedReadings : 0; // Average speed in km/h
    const totalDistanceValue = distance.toFixed(2); // Numeric value only
    const tripScore = Math.max(100 - warningsCount * 10, 0); // Score calculation
  
    const tripData = {
      date: new Date().toISOString(), // ISO date format
      duration: durationString,
      averageSpeed: averageSpeed.toFixed(2),
      totalDistance: totalDistanceValue, // Send numeric distance
      warnings: warningsCount,
      tripScore,
    };

    console.log('Trip Data:', tripData);

    try {
      // Save to local file
      const filePath = `${FileSystem.documentDirectory}tripsLog.txt`;
      const existingData = await FileSystem.readAsStringAsync(filePath).catch(
        () => ''
      );
      const updatedData = `${existingData}\n${JSON.stringify(tripData)}`;
      await FileSystem.writeAsStringAsync(filePath, updatedData);
      console.log('Trip data saved to:', filePath);
  
      // Send to backend
      const response = await axios.post(
        'http://192.168.0.18:5000/api/saveTrip',
        tripData
      );
      console.log('Trip data saved to backend:', response.data);
  
      Alert.alert(
        'Trip Ended',
        `Date: ${tripData.date}\nDuration: ${tripData.duration}\nAverage Speed: ${tripData.averageSpeed} km/h\nDistance: ${totalDistanceValue} m\nWarnings: ${tripData.warnings}\nScore: ${tripData.tripScore}`
      );
    } catch (error) {
      console.error('Error saving trip data to backend:', error);
      Alert.alert('Error', 'Failed to save trip data to backend.');
    }
    const handleEndTrip = async () => {
      await saveTripDataToBackend(); // Save the trip data
      fetchDriverScore(); // Fetch the updated driver's score
    };
    onCancel(); // Return to the main page
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Drive Mate Dashboard</Text>

      <Speedometer value={speed} max={180}>
        <Background />
        <Arc />
        <Needle />
        <Progress />
        <Marks />
        <Indicator />
      </Speedometer>

      <View style={styles.dataContainer}>
        <Text style={styles.label}>Speed:</Text>
        <Text style={styles.value}>{speed.toFixed(1)} km/h</Text>
      </View>
      <View style={styles.dataContainer}>
        <Text style={styles.label}>Acceleration:</Text>
        <Text style={styles.value}>{acceleration.toFixed(2)} m/s²</Text>
      </View>
      <View style={styles.dataContainer}>
        <Text style={styles.label}>Distance:</Text>
        <Text style={styles.value}>
          {distance > 1000
            ? `${(distance / 1000).toFixed(2)} km`
            : `${distance.toFixed(2)} m`}
        </Text>
      </View>
      <View style={styles.dataContainer}>
        <Text style={styles.label}>Current Location:</Text>
        <Text style={styles.value}>{currentStreet}</Text>
      </View>
      <View style={styles.dataContainer}>
        <Text style={styles.label}>Speed Limit:</Text>
        <Text style={styles.value}>{speedLimit} km/h</Text>
      </View>

      {speed > speedLimit && (
        <Text style={styles.warningText}>
          Slow down! You are exceeding the speed limit.
        </Text>
      )}

      <View style={styles.buttonContainer}>
        <Button title="End Trip" color="grey" onPress={handleEndTrip} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#007AFF',
  },
  title: {
    position: 'absolute',
    top: '10%',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  dataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 5,
  },
  label: {
    fontSize: 18,
    color: 'white',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  warningText: {
    marginTop: 10,
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default TripPage;
