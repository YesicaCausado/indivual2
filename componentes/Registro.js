import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Platform } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [fecha, setFecha] = useState('');
  const [telefono, setTelefono] = useState('');
  const navigation = useNavigation();

  const handleRegistro = async () => {
    if (!nombre || !correo || !contrasena || !fecha || !telefono) {
      const msg = 'Por favor completa todos los campos.';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert('Error', msg);
      }
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
      const user = userCredential.user;

      // Guardar datos en Firestore con el UID como ID del documento
      await setDoc(doc(db, 'usuarios', user.uid), {
        uid: user.uid,
        nombre,
        correo,
        fecha,
        telefono,
        favoritos: 0,
        vistos: 0,
      });

      if (Platform.OS === 'web') {
        window.alert('Usuario registrado correctamente');
      } else {
        Alert.alert('Éxito', 'Usuario registrado correctamente');
      }
      navigation.navigate('Login');
    } catch (error) {
      let mensajeError = 'Ocurrió un error al registrarse. Inténtalo de nuevo.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          mensajeError = 'Este correo ya está en uso por otra cuenta.';
          break;
        case 'auth/invalid-email':
          mensajeError = 'El formato del correo electrónico no es válido.';
          break;
        case 'auth/weak-password':
          mensajeError = 'La contraseña debe tener al menos 6 caracteres.';
          break;
        case 'auth/network-request-failed':
          mensajeError = 'Error de conexión. Verifica tu internet.';
          break;
      }

      if (Platform.OS === 'web') {
        window.alert(mensajeError);
      } else {
        Alert.alert('Error al registrarse', mensajeError);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro</Text>
      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />
      <TextInput
        placeholder="Correo"
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
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Fecha de nacimiento (YYYY-MM-DD)"
        value={fecha}
        onChangeText={setFecha}
        style={styles.input}
      />
      <TextInput
        placeholder="Teléfono"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <Button title="Registrarse" onPress={handleRegistro} />
      <View style={{ marginTop: 10 }}>
        <Button
          title="¿Ya tienes cuenta? Inicia sesión"
          onPress={() => navigation.navigate('Login')}
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