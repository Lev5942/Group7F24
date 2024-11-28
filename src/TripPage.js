import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Speedometer, {
  Background,
  Arc,
  Needle,
  Progress,
  Marks,
  Indicator,
} from 'react-native-cool-speedometer';


// Function to generate a random max speed between 40 and 100
const generateRandomMaxSpeed = () => Math.floor(Math.random() * (100 - 40 + 1)) + 40;
const TripPage = ({ onCancel }) => {
  
  const [speed, setSpeed] = useState(0);
  const [acceleration, setAcceleration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [maxSpeed, setMaxSpeed] = useState(generateRandomMaxSpeed()); // Initial random max speed

  // Simulate real-time updates for speed, acceleration, and distance
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed((prev) => Math.min(prev + Math.random() * 5, maxSpeed)); // Use current maxSpeed
      setAcceleration((prev) => Math.random().toFixed(2)); // Random acceleration
      setDistance((prev) => prev + Math.random() * 0.5); // Increment distance
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [maxSpeed]);

  // Reset max speed every 30 seconds
  useEffect(() => {
    const resetMaxSpeedInterval = setInterval(() => {
      setMaxSpeed(generateRandomMaxSpeed()); // Update maxSpeed with a new random value
    }, 30000);

    return () => clearInterval(resetMaxSpeedInterval); // Cleanup interval on unmount
  }, []);


  return(
    <View style={styles.container}>
      <Text style={styles.title}>Drive Mate Dashboard</Text>

      <Speedometer
        value={speed}
        fontFamily='squada-one'
      >
        <Background />
        <Arc/>
        <Needle/>
        <Progress/>
        <Marks/>
        <Indicator/>
      </Speedometer>

      
      
      <View style={styles.dataContainer}>
        <Text style={styles.label}>Speed:</Text>
        <Text style={styles.value}>{speed.toFixed(1)} km/h</Text>
      </View>
      <View style={styles.dataContainer}>
        <Text style={styles.label}>Acceleration:</Text>
        <Text style={styles.value}>{acceleration} m/s²</Text>
      </View>
      <View style={styles.dataContainer}>
        <Text style={styles.label}>Distance:</Text>
        <Text style={styles.value}>{distance.toFixed(2)} km</Text>
      </View>

      {/* <View style={styles.dataContainer}>
        <Text style={styles.label}>Points:</Text>
        <Text style={styles.value}>0</Text>
      </View> */}
      <View style={styles.buttonContainer}>
        <Button 
          style={styles.button}
          title="End Trip"
          color="grey"
          onPress={onCancel}
          // onPress={() => navigation.navigate('TripAnalysis')}
        />
      </View>
    </View>
  )
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
      buttonContainer: {
        marginTop: 30,
      },
});

export default TripPage;
