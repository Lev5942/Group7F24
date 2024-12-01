import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Animated,
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

// Global backend URL
const BACKEND_URL = 'http://192.168.68.55:5000';
  const TripPage = ({ onCancel }) => {
  const [speed, setSpeed] = useState(0);
  const [acceleration, setAcceleration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [warningsCount, setWarningsCount] = useState(0);
  const [speedLimit, setSpeedLimit] = useState(50); // Default speed limit
  const [accelerationLimit, setaccelerationLimit] = useState(2); // Default speed limit
  const [currentStreet, setCurrentStreet] = useState('No street');
  const [isWarningActive, setIsWarningActive] = useState(false);

  const [maxSpeed, setMaxSpeed] = useState(100); // Randomized maximum speed
  const [startTime, setStartTime] = useState(new Date());
  const [totalSpeed, setTotalSpeed] = useState(0);
  const [speedReadings, setSpeedReadings] = useState(0);

  const [endTripScale] = useState(new Animated.Value(1));
  const [isAnimating, setIsAnimating] = useState(false);


  // Load streets from backend
  useEffect(() => {
    setaccelerationLimit(2);
    axios
      .get(`${BACKEND_URL}/api/streets`)
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
        .get(`${BACKEND_URL}/api/streets`)
        .then((response) => {
          console.log('/api/streets res:', response);
          if (response.data.length > 0) {
            const randomStreet =
              response.data[Math.floor(Math.random() * response.data.length)];
            setCurrentStreet(randomStreet.name);
            setSpeedLimit(randomStreet.speed_limit);
          }
        })
        .catch((error) => console.error('Error fetching streets:', error));
    }, 30000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Monitor warnings
  useEffect(() => {
    if (speed > speedLimit || acceleration > accelerationLimit) {
      if (!isWarningActive) {
        setWarningsCount((prev) => prev + 1); // Count the warning
        setIsWarningActive(true);
      } else{

        setTimeout(() => {
          setIsWarningActive(false); // Reset warning in 2 sec
        }, 2000);
       
      }
    } else {
      setIsWarningActive(false); // Reset warning state
    }
  }, [speed, speedLimit]);

  // Animation for ending the trip
  const endTripAnimation = Animated.timing(endTripScale, {
    toValue: 20,
    duration: 700,
    useNativeDriver: true,
  });

  
  const handleEndTrip = async () => {
    setIsAnimating(true);
    const duration = (new Date() - startTime) / 1000; // Duration in seconds
    const durationString = `${Math.floor(duration / 60)} min ${(
      duration % 60
    ).toFixed(0)} sec`;
    const averageSpeed =
      speedReadings > 0 ? totalSpeed / speedReadings : 0; // Average speed in km/h
    const totalDistanceValue = distance.toFixed(2); // Numeric value only


    const tripScore = parseFloat(Math.max((100 - warningsCount * (100 / distance) * 5), 0).toFixed(1));

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
        `${BACKEND_URL}/api/saveTrip`,
        tripData, {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Trip data saved to backend:', response.data);
  

      endTripAnimation.start(()=>{
        onCancel(); // Return to the main page
      });
      

      Alert.alert('Trip Ended',
        `Date: ${tripData.date}\nDuration: ${tripData.duration}\nAverage Speed: ${tripData.averageSpeed} km/h\nDistance: ${totalDistanceValue} m\nWarnings: ${tripData.warnings}\nScore: ${tripData.tripScore}`
      );





    } catch (error) {
      console.error('Error saving trip data to backend:', error);
      Alert.alert('Error', 'Failed to save trip data to backend.');
    }
    const handleEndTripFile = async () => {
      await saveTripDataToBackend(); // Save the trip data
      fetchDriverScore(); // Fetch the updated driver's score
    };

    

   
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Drive Mate Dashboard</Text>


      {/* <> end trip button </> */}
      <TouchableOpacity onPress={handleEndTrip} style={styles.endTripContainer}>
        <Animated.View style={[styles.endTripBox, { transform: [{ scale: endTripScale }] }]}>
          
          {!isAnimating && (
            <Text style={styles.endTripText}>End Trip</Text>
          )}
        
          </Animated.View>
      </TouchableOpacity>
      
      
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
        <Text style={styles.label}>Location:</Text>
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

      {acceleration > accelerationLimit && (
        <Text style={styles.warningText}>
          Slow down! You are exceeding the acceleration limit.
        </Text>
      )}

      

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
    marginLeft: '-2%',
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
  endTripContainer: {
    position: 'absolute',
    bottom: '5%',
  },
  endTripBox: {
    width: 150,
    height: 100,
    borderRadius: 70,
    
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endTripText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TripPage;