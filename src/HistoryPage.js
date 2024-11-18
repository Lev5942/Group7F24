import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const HistoryPage = ({ data }) => (
  <View style={styles.historyContainer}>
    <Text style={styles.title}>DriveMate History</Text>
    <FlatList
      contentContainerStyle={styles.list}
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text>Date: {item.date}</Text>
          <Text>Distance: {item.distance} km</Text>
          <Text>Score: {item.score}</Text>
        </View>
      )}
    />
  </View>
);

const styles = StyleSheet.create({
  historyContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    alignItems: 'center',
  },
  item: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: 300,
    alignItems: 'flex-start',
  },
});

export default HistoryPage;
