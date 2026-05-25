import React, { useEffect, useState } from 'react';

import {
  View,
  ActivityIndicator
} from 'react-native';

import {
  NavigationContainer
} from '@react-navigation/native';

import {
  createBottomTabNavigator
} from '@react-navigation/bottom-tabs';

import {
  onAuthStateChanged
} from 'firebase/auth';

import {
  auth
} from './firebase/firebaseConfig';

// COMPONENTES

import Login from './componentes/Login';
import Registro from './componentes/Registro';
import Home from './componentes/Home';
import Original from './componentes/Original';
import Logout from './componentes/Logout';

const Tab = createBottomTabNavigator();

export default function App() {

  const [usuario, setUsuario] = useState(undefined);

  // =========================
  // ESCUCHAR LOGIN
  // =========================

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {

        console.log('Usuario actual:', user);

        setUsuario(user);

      }
    );

    return unsubscribe;

  }, []);

  // =========================
  // LOADING
  // =========================

  if (usuario === undefined) {

    return (

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >

        <ActivityIndicator
          size="large"
          color="#003087"
        />

      </View>

    );

  }

  // =========================
  // UI
  // =========================

  return (

    <NavigationContainer>

      {
        usuario ? (

          // =================
          // USUARIO LOGUEADO
          // =================

          <Tab.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >

            <Tab.Screen
              name="Inicio"
              component={Home}
            />

            <Tab.Screen
              name="Disney"
              component={Original}
            />

            <Tab.Screen
              name="Logout"
              component={Logout}
            />

          </Tab.Navigator>

        ) : (

          // =================
          // LOGIN
          // =================

          <Tab.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >

            <Tab.Screen
              name="Login"
              component={Login}
            />

            <Tab.Screen
              name="Registro"
              component={Registro}
            />

          </Tab.Navigator>

        )
      }

    </NavigationContainer>

  );

}