import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import Speedometer, {
  Background,
  Arc,
  Needle,
  Progress,
  Marks,
  Indicator,
} from 'react-native-cool-speedometer';

const generateRandomMaxSpeed = () => Math.floor(Math.random() * (100 - 40 + 1)) + 40;

const TripPage = ({ onCancel }) => {
  const [speed, setSpeed] = useState(0);
  const [acceleration, setAcceleration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [isKilometers, setIsKilometers] = useState(false);
  const [maxSpeed, setMaxSpeed] = useState(generateRandomMaxSpeed());
  const [streets, setStreets] = useState([]);
  const [currentStreet, setCurrentStreet] = useState(null);

  useEffect(() => {
    axios
      .get('http://192.168.0.18:5000/api/streets') // Replace with your backend URL
      .then((response) => {
        console.log('Fetched streets:', response.data); // Debug fetched streets
        setStreets(response.data);
        const initialStreet = response.data[Math.floor(Math.random() * response.data.length)];
        console.log('Initial street:', initialStreet); // Debug initial street
        setCurrentStreet(initialStreet);
      })
      .catch((error) => {
        console.error('Error fetching streets:', error);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (streets.length > 0) {
        const randomStreet = streets[Math.floor(Math.random() * streets.length)];
        console.log('Updated street:', randomStreet); // Debug updated street
        setCurrentStreet(randomStreet);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [streets]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed((currentSpeed) => {
        const step = 1;
        if (currentSpeed < maxSpeed) return Math.min(currentSpeed + step, maxSpeed);
        if (currentSpeed > maxSpeed) return Math.max(currentSpeed - step, maxSpeed);
        return currentSpeed;
      });

      const speedInMetersPerSecond = speed / 3.6;
      setDistance((prevDistance) => {
        const increment = speedInMetersPerSecond;
        const totalDistance = prevDistance + increment;
        if (totalDistance > 1000) setIsKilometers(true);
        return totalDistance;
      });

      setAcceleration(() => {
        if (speed < maxSpeed) return 1;
        if (speed > maxSpeed) return -1;
        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [maxSpeed]);

  useEffect(() => {
    const resetMaxSpeedInterval = setInterval(() => {
      setMaxSpeed(generateRandomMaxSpeed());
    }, 30000);

    return () => clearInterval(resetMaxSpeedInterval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Drive Mate Dashboard</Text>

      <Speedometer value={speed} fontFamily="squada-one">
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
          {isKilometers
            ? `${(distance / 1000).toFixed(2)} km`
            : `${distance.toFixed(2)} m`}
        </Text>
      </View>

      {currentStreet && (
        <View style={styles.streetContainer}>
          <Text style={styles.label}>Current Location:</Text>
          <Text style={styles.streetValue}>{currentStreet.name}</Text>
          <Text style={styles.label}>Speed Limit:</Text>
          <Text style={styles.streetValue}>{currentStreet.speed_limit} km/h</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button title="End Trip" color="grey" onPress={onCancel} />
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
    marginVertical: 10,
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
  streetContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  streetValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 30,
  },
});

export default TripPage;
