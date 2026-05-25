import React, { useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView,
  Image, TextInput, ActivityIndicator
} from 'react-native';

export default function Home() {
  const [data, setData] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const res = await fetch('https://api.disneyapi.dev/character?pageSize=50');
        const json = await res.json();
        setData(json.data);
      } catch (e) {
        console.error('Error al obtener personajes Disney:', e);
      } finally {
        setCargando(false);
      }
    };
    obtenerDatos();
  }, []);

  const filtrados = data.filter(p =>
    p.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView>
      <Text style={styles.titulo}>🏰 Personajes Disney</Text>
      <TextInput
        style={styles.buscador}
        placeholder="Buscar personaje..."
        value={busqueda}
        onChangeText={setBusqueda}
      />
      <View style={styles.lista}>
        {filtrados.map((personaje, index) => (
          <View key={index} style={styles.item}>
            {personaje.imageUrl ? (
              <Image
                source={{ uri: personaje.imageUrl }}
                style={styles.imagen}
              />
            ) : (
              <View style={[styles.imagen, styles.sinImagen]}>
                <Text style={{ color: '#fff', fontSize: 12 }}>Sin imagen</Text>
              </View>
            )}
            <Text style={styles.nombre} numberOfLines={2}>
              {personaje.name}
            </Text>
            {personaje.films?.length > 0 && (
              <Text style={styles.detalle} numberOfLines={1}>
                🎬 {personaje.films[0]}
              </Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 12,
    color: '#003087',
  },
  buscador: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  lista: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    justifyContent: 'space-between',
    padding: 10,
  },
  item: {
    backgroundColor: 'aliceblue',
    width: '48%',
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 8,
  },
  imagen: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  sinImagen: {
    backgroundColor: '#003087',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nombre: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 6,
    fontSize: 13,
  },
  detalle: {
    fontSize: 11,
    color: '#555',
    textAlign: 'center',
    marginTop: 2,
  },
});