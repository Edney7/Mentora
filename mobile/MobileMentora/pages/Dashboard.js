import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Alert
} from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit'; // Importação correta
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const API_BASE_URL = 'http://192.168.248.47:8080';  // Substitua com o seu URL da API
const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: "#e0f7fa",
  backgroundGradientTo: "#e0f2f1",
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(0, 102, 204, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: { borderRadius: 12 },
  propsForDots: {
    r: "4",
    strokeWidth: "2",
    stroke: "#007aff"
  }
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [notasDetalhadas, setNotasDetalhadas] = useState([]);
  const [faltasPorDisciplina, setFaltasPorDisciplina] = useState([]);
  const [totalFaltas, setTotalFaltas] = useState(null);
  const [mediaGeral, setMediaGeral] = useState(null);
  const [modoGrafico, setModoGrafico] = useState('NOTAS');

  const fetchAlunoNotasData = async (alunoId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notas/aluno/${alunoId}/resumo`);
      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Erro HTTP ${response.status}: ${errorBody}`);
        throw new Error(`Erro ao buscar notas: ${response.status}`);
      }
      const resumo = await response.json();
      setNotasDetalhadas(resumo.mediasPorDisciplina || []);
      setMediaGeral(resumo.mediaGeral); 
    } catch (error) {
      console.error("Erro ao buscar notas:", error);
      Alert.alert("Erro", "Erro ao buscar notas.");
    }
  };

  const fetchAlunoFaltasData = async (alunoId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/faltas/resumo-aluno/${alunoId}`);
      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Erro HTTP ${response.status}: ${errorBody}`);
        throw new Error(`Erro ao buscar faltas: ${response.status}`);
      }
      const data = await response.json();
      setFaltasPorDisciplina(data.faltasPorDisciplina || []);
      setTotalFaltas(data.totalFaltas); 
    } catch (error) {
      console.error("Erro ao buscar faltas:", error);
      Alert.alert("Erro", "Erro ao buscar faltas.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        const alunoId = await AsyncStorage.getItem('alunoId');
        const userName = await AsyncStorage.getItem('userName');
        setNomeUsuario(userName || '');
        if (alunoId) {
          await fetchAlunoNotasData(alunoId);
          await fetchAlunoFaltasData(alunoId);
        } else {
          Alert.alert("Erro", "ID do aluno não encontrado. Faça o login novamente.");
        }
        setLoading(false);
      };
      fetchData();
    }, [])
  );

  const renderResumo = () => (
    <View style={styles.resumoContainer}>
      <View style={styles.box}>
        <Text style={styles.boxTitulo}>FALTAS</Text>
        <Text style={styles.boxValor}>{totalFaltas ?? '--'}</Text>
      </View>
      <View style={styles.box}>
        <Text style={styles.boxTitulo}>MÉDIA</Text>
        <Text style={styles.boxValor}>{mediaGeral ?? '--'}</Text>
      </View>
    </View>
  );

  const renderGraficoNotas = () => {
    if (!notasDetalhadas.length) return (
      <View style={styles.card}>
        <Text style={styles.chartTitle}>Nenhuma nota disponível.</Text>
      </View>
    );

    return notasDetalhadas.map((disciplina, index) => {
      const dados = [
        disciplina.prova1 ?? 0, 
        disciplina.prova2 ?? 0, 
        disciplina.media ?? 0 
      ];
      const bimestres = ['P1', 'P2', 'Média'];

      return (
        <View key={index} style={styles.card}>
          <Text style={styles.chartTitle}>{disciplina.nomeDisciplina}</Text>
          <LineChart
            data={{
              labels: bimestres,
              datasets: [{ data: dados }]
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

  const renderGraficoFaltas = () => {
    if (!faltasPorDisciplina.length) return (
      <View style={styles.card}>
        <Text style={styles.chartTitle}>Nenhuma falta registrada.</Text>
      </View>
    );

    const labels = faltasPorDisciplina.map(f => f.nomeDisciplina);
    const dados = faltasPorDisciplina.map(f => f.faltas);

    return (
      <View style={styles.card}>
        <Text style={styles.chartTitle}>Faltas por Disciplina</Text>
        <BarChart
          data={{ labels, datasets: [{ data: dados }] }}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          style={{ borderRadius: 10 }}
        />
      </View>
    );
  };

  const renderAlternador = () => (
    <View style={styles.toggleContainer}>
      <TouchableOpacity
        style={[styles.toggleButton, modoGrafico === 'NOTAS' && styles.toggleAtivo]}
        onPress={() => setModoGrafico('NOTAS')}
      >
        <Text style={styles.toggleText}>Notas</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.toggleButton, modoGrafico === 'FALTAS' && styles.toggleAtivo]}
        onPress={() => setModoGrafico('FALTAS')}
      >
        <Text style={styles.toggleText}>Faltas</Text>
      </TouchableOpacity>
    </View>
  );

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
      {renderResumo()}
      {renderAlternador()}
      {modoGrafico === 'NOTAS' ? renderGraficoNotas() : renderGraficoFaltas()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f0f7',
    padding: 20
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 20
  },
  resumoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  box: {
    backgroundColor: '#cce6ff',
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 25,
    borderRadius: 14,
    alignItems: 'center'
  },
  boxTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 6
  },
  boxValor: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#007acc'
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 14,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
    color: '#003366'
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#cce6ff'
  },
  toggleAtivo: {
    backgroundColor: '#007acc'
  },
  toggleText: {
    color: '#003366',
    fontWeight: 'bold'
  }
});
