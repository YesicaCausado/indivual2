import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Platform } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!correo || !contrasena) {
      const msg = 'Por favor ingresa tu correo y contraseña.';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert('Error', msg);
      }
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, correo, contrasena);
    } catch (error) {
      let mensajeError = 'Ocurrió un error inesperado. Inténtalo de nuevo.';
      
      switch (error.code) {
        case 'auth/invalid-email':
          mensajeError = 'El formato del correo electrónico no es válido.';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          mensajeError = 'Correo o contraseña incorrectos.';
          break;
        case 'auth/user-disabled':
          mensajeError = 'La cuenta de usuario ha sido deshabilitada.';
          break;
        case 'auth/network-request-failed':
          mensajeError = 'Error de conexión. Verifica tu internet.';
          break;
      }

      if (Platform.OS === 'web') {
        window.alert(mensajeError);
      } else {
        Alert.alert('Error al iniciar sesión', mensajeError);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Iniciar Sesión</Text>
      <TextInput
        placeholder="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        style={styles.input}
        secureTextEntry
      />
      <Button title="Ingresar" onPress={handleLogin} />
      <View style={{ marginTop: 10 }}>
        <Button
          title="¿No tienes cuenta? Regístrate"
          onPress={() => navigation.navigate('Registro')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  titulo: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
});