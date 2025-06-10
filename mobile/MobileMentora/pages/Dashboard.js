import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importe AsyncStorage
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Importe useFocusEffect

export default function Dashboard() {
  const navigation = useNavigation();

  // Estados para armazenar os dados do usuário logado
  const [nomeUsuario, setNomeUsuario] = useState('Carregando...');
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [faltas, setFaltas] = useState(0);
  const [aulasAssistidas, setAulasAssistidas] = useState(0);
  const [totalAulas, setTotalAulas] = useState(0);
  const [faltasPorDisciplina, setFaltasPorDisciplina] = useState([]);
  const [atividadesProfessor, setAtividadesProfessor] = useState([]);

  // Função para carregar os dados do AsyncStorage
  const loadUserData = async () => {
    try {
      const storedUserName = await AsyncStorage.getItem('userName');
      const storedUserType = await AsyncStorage.getItem('userType');

      if (!storedUserName || !storedUserType) {
        // Se não houver dados de login, redireciona para a tela de Login
        Alert.alert('Sessão Expirada', 'Você precisa fazer login novamente.');
        navigation.replace('Login');
        return;
      }

      setNomeUsuario(storedUserName);
      setTipoUsuario(storedUserType);

      if (storedUserType === 'ALUNO') {
        const storedFaltasTotais = await AsyncStorage.getItem('alunoFaltasTotais');
        const storedAulasAssistidas = await AsyncStorage.getItem('alunoAulasAssistidas');
        const storedTotalAulas = await AsyncStorage.getItem('alunoTotalAulas');
        const storedFaltasDisciplinas = await AsyncStorage.getItem('alunoFaltasDisciplinas');

        setFaltas(storedFaltasTotais ? parseInt(storedFaltasTotais) : 0);
        setAulasAssistidas(storedAulasAssistidas ? parseInt(storedAulasAssistidas) : 0);
        setTotalAulas(storedTotalAulas ? parseInt(storedTotalAulas) : 0);
        setFaltasPorDisciplina(storedFaltasDisciplinas ? JSON.parse(storedFaltasDisciplinas) : []);
      } else if (storedUserType === 'PROFESSOR') {
        const storedAtividadesProfessor = await AsyncStorage.getItem('professorAtividades');
        setAtividadesProfessor(storedAtividadesProfessor ? JSON.parse(storedAtividadesProfessor) : []);
      }

    } catch (error) {
      console.error('Erro ao carregar dados do AsyncStorage:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do usuário. Tente novamente.');
    }
  };

  // Usamos useFocusEffect para recarregar os dados sempre que a tela Dashboard entrar em foco
  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, []) // O array de dependências vazio significa que ele só é recriado uma vez
  );

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
            // Limpa todos os dados do AsyncStorage
            await AsyncStorage.clear(); // Limpa tudo que foi salvo
            navigation.replace('Login');
          },
        },
      ],
      { cancelable: false }
    );
  };

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
              <Text style={styles.value}>{aulasAssistidas}/{totalAulas}</Text>
              <Text style={styles.label}>AULAS ASSISTIDAS</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Faltas por Disciplina</Text>
            {faltasPorDisciplina.length > 0 ? (
              faltasPorDisciplina.map((item, index) => (
                <View key={index} style={styles.disciplineItem}>
                  <Text style={styles.disciplineName}>{item.disciplina}</Text>
                  <Text style={styles.disciplineFaltas}>{item.faltas} falta(s)</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>Nenhuma falta registrada por disciplina.</Text>
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
              <Text style={styles.noDataText}>Nenhuma atividade recente.</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Turmas</Text>
            {/* Adicione cards ou listas para turmas aqui, pode ser um array no Login.js também */}
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
  },
});