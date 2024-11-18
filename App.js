import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MainPage from './src/MainPage';
import LoginPage from './src/LoginPage';
import HistoryPage from './src/HistoryPage';
import TripPage from './src/TripPage';

const App = () => {
  // State variables
  const [currentPage, setCurrentPage] = useState('main'); // main, login, startTrip, history
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState([
    { id: 1, date: '2024-11-01', distance: 15.3, score: 85 },
    { id: 2, date: '2024-11-02', distance: 10.5, score: 90 },
    { id: 3, date: '2024-11-03', distance: 22.1, score: 78 },
  ]);

  // Handlers for navigation
  const handleLogin = () => {
    if (username === 'user' && password === 'password') {
      setIsLoggedIn(true);
      setCurrentPage('main');
    } else {
      alert('Incorrect username or password');
    }
  };

  const handleStartTrip = () => {
    // alert('Trip started!');
    setCurrentPage('trip');
    // Add actual logic here to start recording the trip
  };

  return (
    <View style={styles.container}>
      {currentPage === 'main' && (
        <MainPage
          onLoginPress={() => setCurrentPage('login')}
          onStartTripPress={() => setCurrentPage('trip')}
          onHistoryPress={() => setCurrentPage('history')}
          isLoggedIn={isLoggedIn}
        />
      )}

      {currentPage === 'login' && (
        <LoginPage
          username={username}
          password={password}
          onUsernameChange={setUsername}
          onPasswordChange={setPassword}
          onLogin={handleLogin}
          onCancel={() => setCurrentPage('main')}
        />
      )}

      {currentPage === 'trip' && (
        <TripPage 
          data={data}  
          onCancel={() => setCurrentPage('main')}
         />
      )}

      {currentPage === 'history' && isLoggedIn && (
        <HistoryPage 
          data={data} 
          onCancel={() => setCurrentPage('main')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
  },
});

export default App;
