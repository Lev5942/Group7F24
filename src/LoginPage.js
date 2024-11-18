import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const LoginPage = ({ username, password, onUsernameChange, onPasswordChange, onLogin, onCancel }) => (
  <View style={styles.loginContainer}>
    <Text style={styles.title}>Please Log In</Text>
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
    <Button title="Log In" onPress={onLogin} />
    <Button title="Cancel" onPress={onCancel} />
  </View>
);

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