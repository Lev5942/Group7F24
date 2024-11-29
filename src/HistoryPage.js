import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';

const HistoryPage = ({ onCancel }) => {
  const [tripHistory, setTripHistory] = useState([]);

  useEffect(() => {
    // Fetch trip history from the backend
    const fetchTripHistory = async () => {
      try {
        const response = await axios.get('http://192.168.0.18:5000/api/tripHistory'); // Adjust the URL as per your backend
        setTripHistory(response.data);
        console.log('Fetched trip history:', response.data);
      } catch (error) {
        console.error('Error fetching trip history:', error);
        Alert.alert('Error', 'Unable to fetch trip history.');
      }
    };

    fetchTripHistory();
  }, []);

  // Handle trip button press
  const handleTripPress = (trip) => {
    Alert.alert(
      'Trip Details',
      `Date: ${trip.date}\nDuration: ${trip.duration}\nAverage Speed: ${trip.average_speed} km/h\nDistance: ${trip.total_distance} km\nWarnings: ${trip.warnings}\nScore: ${trip.trip_score}`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trip History</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {tripHistory.map((trip) => (
          <TouchableOpacity
            key={trip.id}
            style={styles.tripButton}
            onPress={() => handleTripPress(trip)}
          >
            <Text style={styles.tripButtonText}>Trip on {trip.date}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  scrollContainer: {
    width: '100%',
    alignItems: 'center',
  },
  tripButton: {
    backgroundColor: 'blue',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: '90%',
    alignItems: 'center',
  },
  tripButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'gray',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    width: '90%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HistoryPage;
