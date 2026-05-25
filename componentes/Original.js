import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import {
  doc,
  getDoc,
  setDoc,
  updateDoc
} from 'firebase/firestore';

import { db, auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ -'.split('');
const MAX_ATTEMPTS = 6;
const TOTAL_PAGES = 197;

export default function Original() {

  const [nombrePersonaje, setNombrePersonaje] = useState('');
  const [imagenPersonaje, setImagenPersonaje] = useState('');
  const [letrasAdivinadas, setLetrasAdivinadas] = useState([]);
  const [fallos, setFallos] = useState(0);

  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [juegoGanado, setJuegoGanado] = useState(false);

  const [cargando, setCargando] = useState(true);

  const [ganados, setGanados] = useState(0);
  const [perdidos, setPerdidos] = useState(0);

  const [uid, setUid] = useState(null);

  // =========================
  // AUTH
  // =========================

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {

      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
      }

    });

    return unsubscribe;

  }, []);

  // =========================
  // TRAER DATOS FIRESTORE
  // =========================

  useEffect(() => {

    if (!uid) return;

    const traerDatos = async () => {

      try {

        const docRef = doc(db, 'usuarios', uid);

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

          const data = docSnap.data();

          setGanados(data.ganados || 0);
          setPerdidos(data.perdidos || 0);

        } else {

          await setDoc(docRef, {
            ganados: 0,
            perdidos: 0,
          });

        }

      } catch (error) {

        console.error(
          'Error obteniendo usuario:',
          error
        );

      }

    };

    traerDatos();

  }, [uid]);

  // =========================
  // OBTENER PERSONAJE
  // =========================

  const obtenerPersonaje = async () => {

    setCargando(true);

    setLetrasAdivinadas([]);
    setFallos(0);

    setJuegoGanado(false);
    setJuegoTerminado(false);

    try {

      const paginaAleatoria =
        Math.floor(Math.random() * TOTAL_PAGES) + 1;

      const response = await fetch(
        `https://api.disneyapi.dev/character?page=${paginaAleatoria}&pageSize=50`
      );

      const json = await response.json();

      const personajes = json.data.filter(
        (p) =>
          p.imageUrl &&
          p.imageUrl.startsWith('http') &&
          p.name
      );

      const aleatorio =
        personajes[
          Math.floor(
            Math.random() * personajes.length
          )
        ];

      setNombrePersonaje(
        aleatorio.name.toUpperCase()
      );

      setImagenPersonaje(
        aleatorio.imageUrl
      );

    } catch (error) {

      console.error(
        'Error obteniendo personaje:',
        error
      );

    } finally {

      setCargando(false);

    }

  };

  useEffect(() => {

    obtenerPersonaje();

  }, []);

  // =========================
  // GUARDAR RESULTADO
  // =========================

  const guardarResultado = async (acierto) => {

    if (!uid) return;

    try {

      const fecha = new Date().toISOString();

      const resultado = {
        uid,
        personaje: nombrePersonaje,
        acierto,
        fecha,
      };

      await setDoc(
        doc(db, 'resultados', `${uid}_${fecha}`),
        resultado
      );

      const usuarioRef = doc(
        db,
        'usuarios',
        uid
      );

      await updateDoc(usuarioRef, {
        ganados: acierto
          ? ganados + 1
          : ganados,

        perdidos: !acierto
          ? perdidos + 1
          : perdidos,
      });

    } catch (error) {

      console.error(
        'Error guardando resultado:',
        error
      );

    }

  };

  // =========================
  // MANEJO LETRAS
  // =========================

  const handleLetra = async (letra) => {

    if (
      letrasAdivinadas.includes(letra) ||
      juegoGanado ||
      juegoTerminado
    ) {
      return;
    }

    const nuevasLetras = [
      ...letrasAdivinadas,
      letra
    ];

    setLetrasAdivinadas(nuevasLetras);

    // FALLÓ

    if (!nombrePersonaje.includes(letra)) {

      const nuevosFallos = fallos + 1;

      setFallos(nuevosFallos);

      if (nuevosFallos >= MAX_ATTEMPTS) {

        setJuegoTerminado(true);

        setPerdidos(perdidos + 1);

        await guardarResultado(false);

      }

    } else {

      // GANÓ

      const todoAdivinado =
        nombrePersonaje
          .split('')
          .every(
            (l) =>
              l === ' ' ||
              l === '-' ||
              nuevasLetras.includes(l)
          );

      if (todoAdivinado) {

        setJuegoGanado(true);

        setGanados(ganados + 1);

        await guardarResultado(true);

      }

    }

  };

  // =========================
  // RENDER PALABRA
  // =========================

  const renderPalabra = () =>

    nombrePersonaje
      .split('')
      .map((letra, index) => (

        <Text
          key={index}
          style={styles.letra}
        >

          {
            letra === ' '
              ? ' '
              : letrasAdivinadas.includes(letra) ||
                juegoGanado ||
                juegoTerminado
              ? letra
              : '_'
          }

        </Text>

      ));

  // =========================
  // UI
  // =========================

  return (

    <ScrollView
      contentContainerStyle={styles.container}
    >

      <Text style={styles.titulo}>
        🎭 Adivina el Personaje Disney
      </Text>

      <Text style={styles.stats}>
        ✅ Ganados: {ganados} | ❌ Perdidos: {perdidos}
      </Text>

      {
        cargando ? (

          <ActivityIndicator
            size="large"
            color="#003087"
            style={{ marginTop: 40 }}
          />

        ) : (

          <>

            {/* IMAGEN */}

            {
              imagenPersonaje ? (

                <Image
                  source={{
                    uri: imagenPersonaje
                  }}
                  style={styles.imagen}
                  resizeMode="cover"
                />

              ) : (

                <View style={styles.imagenOculta}>

                  <ActivityIndicator
                    size="large"
                    color="white"
                  />

                </View>

              )
            }

            {/* PALABRA */}

            <View
              style={styles.palabraContainer}
            >
              {renderPalabra()}
            </View>

            {/* FALLOS */}

            <Text style={styles.fallos}>
              Fallos: {fallos} / {MAX_ATTEMPTS}
            </Text>

            {/* TECLADO */}

            <View style={styles.teclado}>

              {
                ALPHABET.map((letra) => (

                  <TouchableOpacity
                    key={letra}

                    onPress={() =>
                      handleLetra(letra)
                    }

                    disabled={
                      letrasAdivinadas.includes(letra) ||
                      juegoGanado ||
                      juegoTerminado
                    }

                    style={[
                      styles.tecla,

                      letrasAdivinadas.includes(letra)
                        && styles.teclaUsada
                    ]}
                  >

                    <Text
                      style={styles.textoTecla}
                    >
                      {letra}
                    </Text>

                  </TouchableOpacity>

                ))
              }

            </View>

            {/* MENSAJES */}

            {
              juegoTerminado && (

                <Text style={styles.perdiste}>
                  💀 ¡Perdiste! Era:
                  {' '}
                  {nombrePersonaje}
                </Text>

              )
            }

            {
              juegoGanado && (

                <Text style={styles.ganaste}>
                  🎉 ¡Ganaste!
                </Text>

              )
            }

            {/* BOTÓN */}

            {
              (juegoGanado || juegoTerminado) && (

                <TouchableOpacity
                  style={styles.boton}
                  onPress={obtenerPersonaje}
                >

                  <Text style={styles.botonTexto}>
                    Jugar otra vez
                  </Text>

                </TouchableOpacity>

              )
            }

          </>

        )
      }

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003087',
    textAlign: 'center',
    marginBottom: 10,
  },

  stats: {
    fontSize: 16,
    marginBottom: 15,
    color: '#444',
  },

  imagen: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: '#003087',
    marginVertical: 15,
  },

  imagenOculta: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#003087',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },

  palabraContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },

  letra: {
    fontSize: 28,
    fontWeight: 'bold',
    marginHorizontal: 4,
    color: '#111',
  },

  fallos: {
    fontSize: 16,
    marginBottom: 12,
  },

  teclado: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },

  tecla: {
    width: 42,
    padding: 10,
    margin: 4,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#eee',
  },

  teclaUsada: {
    backgroundColor: '#ccc',
  },

  textoTecla: {
    fontWeight: 'bold',
  },

  perdiste: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },

  ganaste: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },

  boton: {
    backgroundColor: '#003087',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 10,
  },

  botonTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

});