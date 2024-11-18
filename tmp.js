// import React from 'react';
// import { View, Text, StyleSheet, Button } from 'react-native';

// const Dashboard = ({ navigation }) => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Drive Mate Dashboard</Text>
//       <View style={styles.dataContainer}>
//         <Text style={styles.label}>Speed:</Text>
//         <Text style={styles.value}>0 km/h</Text>
//       </View>
//       <View style={styles.dataContainer}>
//         <Text style={styles.label}>Distance:</Text>
//         <Text style={styles.value}>0 km</Text>
//       </View>
//       <View style={styles.dataContainer}>
//         <Text style={styles.label}>Location:</Text>
//         <Text style={styles.value}>N/A</Text>
//       </View>
//       <View style={styles.dataContainer}>
//         <Text style={styles.label}>Points:</Text>
//         <Text style={styles.value}>0</Text>
//       </View>
//       <View style={styles.buttonContainer}>
//         <Button
//           title="End Trip"
//           onPress={() => navigation.navigate('TripAnalysis')}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   dataContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '80%',
//     marginVertical: 10,
//   },
//   label: {
//     fontSize: 18,
//   },
//   value: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   buttonContainer: {
//     marginTop: 30,
//   },
// });

// export default Dashboard;