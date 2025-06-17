// Dashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';

const API_BASE_URL = 'http://192.168.248.47:8080';
const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundColor: "#fff",
  backgroundGradientFrom: "#e0f7fa",
  backgroundGradientTo: "#e0f2f1",
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(0, 100, 200, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: {
    r: "4",
    strokeWidth: "1",
    stroke: "#007aff"
  }
};

export default function Dashboard() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [notasDetalhadas, setNotasDetalhadas] = useState([]);

  const fetchAlunoNotasData = async (alunoId) => {
    try {
      const responseDisciplinas = await fetch(`${API_BASE_URL}/disciplinas/aluno/${alunoId}`);
      const disciplinas = await responseDisciplinas.json();

      const notasDetalhadasArray = await Promise.all(disciplinas.map(async (disciplina) => {
        const responseNotas = await fetch(`${API_BASE_URL}/notas/aluno/${alunoId}/disciplina/${disciplina.id}`);
        const notas = await responseNotas.json();
        return {
          nomeDisciplina: disciplina.nome,
          notas: notas
        };
      }));

      setNotasDetalhadas(notasDetalhadasArray);
    } catch (error) {
      console.error("Erro ao buscar notas detalhadas por disciplina:", error);
      setNotasDetalhadas([]);
    }
  };

  const loadUserDataAndFetchAPI = useCallback(() => {
    const fetchData = async () => {
      setLoading(true);
      const alunoId = await AsyncStorage.getItem('alunoId');
      const userName = await AsyncStorage.getItem('userName');
      const userType = await AsyncStorage.getItem('userType');

      setNomeUsuario(userName);
      setTipoUsuario(userType);

      if (alunoId && userType === 'ALUNO') {
        await fetchAlunoNotasData(alunoId);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useFocusEffect(loadUserDataAndFetchAPI);

  const renderGraficoNotas = () => {
    if (!notasDetalhadas || notasDetalhadas.length === 0) return null;

    return notasDetalhadas.map((disciplina, index) => {
      const bimestres = ['1º', '2º', '3º', '4º'];
      const medias = [1, 2, 3, 4].map(b => {
        const nota = disciplina.notas.find(n => n.bimestre === b);
        return nota ? nota.media : 0;
      });

      return (
        <View key={index} style={styles.chartContainer}>
          <Text style={styles.chartTitle}>{disciplina.nomeDisciplina}</Text>
          <LineChart
            data={{
              labels: bimestres,
              datasets: [{ data: medias }]
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{ borderRadius: 12 }}
          />
        </View>
      );
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Olá, {nomeUsuario}</Text>
      <Text style={styles.subHeader}>Dashboard do Aluno</Text>
      <Text style={styles.sectionTitle}>Gráficos de Notas</Text>
      {renderGraficoNotas()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 4
  },
  subHeader: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#003366'
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333'
  }
});
