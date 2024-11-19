import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const LoginPage = ({ username, password, onUsernameChange, onPasswordChange, onLogin, onCancel }) => {
  const handleLogin = () => {
    axios.post('http://192.168.40.218:5000/api/login', 
    {
      username,
      password,
    })
    .then(response => {
      if (response.status === 200) {
        if(response.data.isLogin === true){
          onLogin();
          console.log("Frontend: Login success");
        }
        else{
          alert('incorret username or password');
          // console.log(response);
        }
      }
    })
    .catch(error => {
      alert('error');
      console.log(error);
    });
  };

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={onUsernameChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={onPasswordChange}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Cancel" onPress={onCancel} />
    </View>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: 300,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default LoginPage;
