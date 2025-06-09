// mobile/pages/DashboardAluno.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Dashboard() {
  const [faltas, setFaltas] = useState(0);
  const [media, setMedia] = useState(0);
  const [eventoHoje, setEventoHoje] = useState('07:00 | 7:45');
  const [ausenciaProfessor, setAusenciaProfessor] = useState('xx/xx');
  const [proximoFeriado, setProximoFeriado] = useState('xx/xx');

  useEffect(() => {
    setFaltas(9);
    setMedia(8.6);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Ionicons name="log-out-outline" size={24} color="black" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DISCIPLINAS</Text>
        <Image source={require('../assets/students.jpg')} style={styles.image} />
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card}><Text style={styles.value}>{faltas}</Text><Text style={styles.label}>FALTAS</Text></View>
        <View style={styles.card}><Text style={styles.value}>{media}</Text><Text style={styles.label}>MÉDIA</Text></View>
      </View>

      <View style={styles.eventPanel}>
        <View style={[styles.eventCard, styles.branco]}></View>
        <View style={[styles.eventCard, styles.amarelo]}>
          <Text style={styles.eventTitle}>Evento Hoje</Text>
          <Text style={styles.hora}>{eventoHoje}</Text>
        </View>
        <View style={[styles.eventCard, styles.azul]}>
          <Text style={styles.eventTitle}>Ausência professor</Text>
          <Text style={styles.hora}>{ausenciaProfessor}</Text>
        </View>
        <View style={[styles.eventCard, styles.verde]}>
          <Text style={styles.eventTitle}>Proximo Feriado</Text>
          <Text style={styles.hora}>{proximoFeriado}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
  section: { alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold' },
  image: {
    width: 180,
    height: 100,
    resizeMode: 'contain',
    marginTop: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#d0edf5',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    width: '40%',
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003366',
  },
  label: {
    marginTop: 5,
    fontSize: 16,
    color: '#003366',
  },
  eventPanel: { gap: 10 },
  eventCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  branco: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  amarelo: { backgroundColor: '#FFC940' },
  azul: { backgroundColor: '#E6F0FF' },
  verde: { backgroundColor: '#1BC47D' },
  eventTitle: { fontSize: 16, fontWeight: 'bold' },
  hora: { fontSize: 14, textAlign: 'right', marginTop: 5 },
});
