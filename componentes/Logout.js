import React from 'react';

import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';

import {
  signOut
} from 'firebase/auth';

import {
  auth
} from '../firebase/firebaseConfig';

export default function Logout() {

  const cerrarSesion = () => {

    Alert.alert(
      'Cerrar sesión',
      '¿Deseas salir?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },

        {
          text: 'Salir',

          style: 'destructive',

          onPress: async () => {

            try {

              // 🔥 CERRAR SESIÓN

              await signOut(auth);

              console.log('Sesión cerrada');

            } catch (error) {

              console.log(error);

            }

          },
        },
      ]
    );

  };

  return (

    <SafeAreaView style={styles.container}>

      <Text style={styles.icon}>
        👋
      </Text>

      <Text style={styles.title}>
        ¿Deseas cerrar sesión?
      </Text>

      <TouchableOpacity
        style={styles.boton}
        onPress={cerrarSesion}
      >

        <Text style={styles.textoBoton}>
          Cerrar sesión
        </Text>

      </TouchableOpacity>

    </SafeAreaView>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  icon: {
    fontSize: 80,
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  boton: {
    backgroundColor: '#cc0000',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
  },

  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

});