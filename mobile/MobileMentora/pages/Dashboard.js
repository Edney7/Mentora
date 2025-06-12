import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Importe useFocusEffect

// BASE_URL da sua API (Certifique-se de que esta URL está correta!)
const API_BASE_URL = 'http://192.168.248.47:8080';

export default function Dashboard() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [nomeUsuario, setNomeUsuario] = useState('Carregando...');
  const [tipoUsuario, setTipoUsuario] = useState(null);

  // Estados específicos para ALUNO
  const [faltas, setFaltas] = useState(0);
  const [faltasPorDisciplina, setFaltasPorDisciplina] = useState([]);
  const [aulasAssistidas, setAulasAssistidas] = useState(0);
  const [totalAulas, setTotalAulas] = useState(0);

  // Estados específicos para PROFESSOR
  const [atividadesProfessor, setAtividadesProfessor] = useState([]);

  // Função para buscar dados de aluno usando o novo endpoint de resumo
  const fetchAlunoData = async (alunoId) => {
    try {
      // **CHAMANDO O NOVO ENDPOINT DE RESUMO**
      const resumoFaltasResponse = await fetch(`${API_BASE_URL}/faltas/resumo-aluno/${alunoId}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!resumoFaltasResponse.ok) {
        const errorBody = await resumoFaltasResponse.text();
        console.error('Erro ao buscar resumo de faltas:', resumoFaltasResponse.status, errorBody);
        Alert.alert('Erro', `Não foi possível carregar o resumo de faltas. (Código: ${resumoFaltasResponse.status})`);
        setFaltas(0);
        setFaltasPorDisciplina([]);
        setAulasAssistidas(0);
        setTotalAulas(0);
      } else {
        const resumoData = await resumoFaltasResponse.json();
        console.log("Dados de resumo de faltas recebidos:", resumoData); // Verifique este log!

        // Atualiza os estados com os dados do DTO de resumo
        setFaltas(resumoData.totalFaltas || 0); // Use 0 como fallback
        setFaltasPorDisciplina(resumoData.faltasPorDisciplina || []); // Use array vazio como fallback
        setAulasAssistidas(resumoData.aulasAssistidas || 0);
        setTotalAulas(resumoData.totalAulas || 0);
      }
    } catch (error) {
      console.error('Erro geral ao buscar dados do aluno:', error);
      Alert.alert('Erro de Conexão', 'Não foi possível carregar os dados do aluno. Verifique a API.');
      setFaltas(0);
      setFaltasPorDisciplina([]);
      setAulasAssistidas(0);
      setTotalAulas(0);
    }
  };

  const fetchProfessorData = async (professorId) => {
    try {
      // Exemplo: Buscar atividades do professor
      // Adapte o endpoint e a estrutura da resposta da sua API
      const atividadesResponse = await fetch(`${API_BASE_URL}/atividades/professor/${professorId}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (atividadesResponse.ok) {
        const atividadesData = await atividadesResponse.json();
        if (Array.isArray(atividadesData)) {
            setAtividadesProfessor(atividadesData);
        } else {
            console.warn('Resposta da API de atividades do professor não é um array:', atividadesData);
            setAtividadesProfessor([]);
        }
      } else {
        console.warn('Não foi possível carregar atividades do professor:', atividadesResponse.status);
        setAtividadesProfessor([]);
      }
    } catch (error) {
      console.error('Erro geral ao buscar dados do professor:', error);
      Alert.alert('Erro de Conexão', 'Não foi possível carregar os dados do professor. Verifique a API.');
      setAtividadesProfessor([]);
    }
  };

  const loadUserDataAndFetchAPI = useCallback(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const storedUserName = await AsyncStorage.getItem('userName');
            const storedUserType = await AsyncStorage.getItem('userType');
            const storedUserId = await AsyncStorage.getItem('userId');

            if (!storedUserName || !storedUserType || !storedUserId) {
                Alert.alert('Sessão Expirada', 'Você precisa fazer login novamente.');
                navigation.replace('Login');
                return;
            }

            setNomeUsuario(storedUserName);
            setTipoUsuario(storedUserType);

            if (storedUserType === 'ALUNO') {
                const alunoId = await AsyncStorage.getItem('alunoId');
                if (alunoId) {
                    console.log('Dashboard: Buscando dados para ALUNO com ID:', alunoId);
                    await fetchAlunoData(alunoId);
                } else {
                    Alert.alert('Erro de Dados', 'ID do aluno não encontrado no armazenamento. Não foi possível buscar as faltas.');
                    setFaltas(0);
                    setFaltasPorDisciplina([]);
                    setAulasAssistidas(0);
                    setTotalAulas(0);
                }
            } else if (storedUserType === 'PROFESSOR') {
                const professorId = await AsyncStorage.getItem('professorId');
                if (professorId) {
                    console.log('Dashboard: Buscando dados para PROFESSOR com ID:', professorId);
                    await fetchProfessorData(professorId);
                } else {
                    Alert.alert('Erro de Dados', 'ID do professor não encontrado no armazenamento. Não foi possível buscar atividades.');
                    setAtividadesProfessor([]);
                }
            }

        } catch (error) {
            console.error('Erro ao carregar dados do AsyncStorage ou iniciar fetch no Dashboard:', error);
            Alert.alert('Erro', 'Não foi possível carregar os dados do usuário. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, []);

  useFocusEffect(loadUserDataAndFetchAPI);

  const handleLogout = async () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: async () => {
            await AsyncStorage.clear();
            navigation.replace('Login');
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.welcomeText}>Olá, {nomeUsuario}!</Text>
      <Text style={styles.roleText}>{tipoUsuario === 'ALUNO' ? 'Dashboard do Aluno' : 'Dashboard do Professor'}</Text>

      {/* Seção para ALUNOS */}
      {tipoUsuario === 'ALUNO' && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suas Disciplinas</Text>
            <Image source={require('../assets/students.jpg')} style={styles.image} />
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <Text style={styles.value}>{faltas}</Text>
              <Text style={styles.label}>FALTAS TOTAIS</Text>
            </View>
            <View style={styles.card}>
              {totalAulas > 0 ? (
                <>
                  <Text style={styles.value}>{aulasAssistidas}/{totalAulas}</Text>
                  <Text style={styles.label}>AULAS ASSISTIDAS</Text>
                </>
              ) : (
                <>
                  <Text style={styles.value}>N/A</Text>
                  <Text style={styles.label}>AULAS ASSISTIDAS</Text>
                </>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Faltas por Disciplina</Text>
            {faltasPorDisciplina.length > 0 ? (
              faltasPorDisciplina.map((item, index) => (
                // Use item.disciplinaId como key se for único, senão use index
                <View key={item.disciplinaId || item.nomeDisciplina || index} style={styles.disciplineItem}>
                  <Text style={styles.disciplineName}>{item.nomeDisciplina}</Text>
                  <Text style={styles.disciplineFaltas}>{item.faltas} falta(s)</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>Nenhuma falta detalhada registrada por disciplina.</Text>
            )}
          </View>
        </>
      )}

      {/* Seção para PROFESSORES */}
      {tipoUsuario === 'PROFESSOR' && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Minhas Atividades</Text>
            {atividadesProfessor.length > 0 ? (
              atividadesProfessor.map((item) => (
                <View key={item.id} style={styles.activityItem}>
                  <Text style={styles.activityDescription}>{item.descricao}</Text>
                  <Text style={styles.activityDate}>{item.data}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>Nenhuma atividade recente encontrada.</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Turmas</Text>
            <View style={styles.card}>
                <Text style={styles.value}>Matemática - 2A</Text>
                <Text style={styles.label}>Ver Alunos</Text>
            </View>
             <View style={styles.card}>
                <Text style={styles.value}>Física - 3B</Text>
                <Text style={styles.label}>Ver Alunos</Text>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#007bff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 30,
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  roleText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 25,
  },
  section: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#d0edf5',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    width: '46%',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 5,
  },
  label: {
    fontSize: 15,
    color: '#003366',
    textAlign: 'center',
  },
  disciplineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  disciplineName: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  disciplineFaltas: {
    fontSize: 18,
    color: '#ff6347',
    fontWeight: 'bold',
  },
  activityItem: {
    backgroundColor: '#e6ffe6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  activityDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#006400',
  },
  activityDate: {
    fontSize: 14,
    color: '#3cb371',
    marginTop: 5,
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
    fontStyle: 'italic',
    textAlign: 'center',
    width: '100%',
  },
});