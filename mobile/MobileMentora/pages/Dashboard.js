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
  FlatList, // Importar FlatList para renderizar listas de forma eficiente
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// BASE_URL da sua API (Certifique-se de que esta URL está correta!)
const API_BASE_URL = 'http://192.168.248.47:8080'; // Confirme este IP/Porta

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
  const [notasAlunoResumo, setNotasAlunoResumo] = useState(null); // NOVO ESTADO: para o resumo de notas

  // Estados específicos para PROFESSOR
  const [atividadesProfessor, setAtividadesProfessor] = useState([]);

  // Função para buscar dados de faltas do aluno
  const fetchAlunoFaltasData = async (alunoId) => {
    try {
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
        console.log("Dados de resumo de faltas recebidos:", resumoData);
        setFaltas(resumoData.totalFaltas || 0);
        setFaltasPorDisciplina(resumoData.faltasPorDisciplina || []);
        setAulasAssistidas(resumoData.aulasAssistidas || 0);
        setTotalAulas(resumoData.totalAulas || 0);
      }
    } catch (error) {
      console.error('Erro geral ao buscar dados de faltas do aluno:', error);
      Alert.alert('Erro de Conexão', 'Não foi possível carregar os dados de faltas do aluno. Verifique a API.');
      setFaltas(0);
      setFaltasPorDisciplina([]);
      setAulasAssistidas(0);
      setTotalAulas(0);
    }
  };

  // NOVA FUNÇÃO: Para buscar o resumo de notas do aluno
  const fetchAlunoNotasData = async (alunoId) => {
    try {
      const notasResumoResponse = await fetch(`${API_BASE_URL}/notas/aluno/${alunoId}/resumo`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!notasResumoResponse.ok) {
        const errorBody = await notasResumoResponse.text();
        console.error('Erro ao buscar resumo de notas:', notasResumoResponse.status, errorBody);
        Alert.alert('Erro', `Não foi possível carregar o resumo de notas. (Código: ${notasResumoResponse.status})`);
        setNotasAlunoResumo(null);
      } else {
        const resumoData = await notasResumoResponse.json();
        console.log("Dados de resumo de notas recebidos:", resumoData); // Verifique este log!
        setNotasAlunoResumo(resumoData); // Armazena o DTO completo
      }
    } catch (error) {
      console.error('Erro geral ao buscar resumo de notas do aluno:', error);
      Alert.alert('Erro de Conexão', 'Não foi possível carregar o resumo de notas. Verifique a API.');
      setNotasAlunoResumo(null);
    }
  };


  const fetchProfessorData = async (professorId) => {
    try {
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
            const storedUserId = await AsyncStorage.getItem('userId'); // ID do Usuário (login)
            const storedAlunoId = await AsyncStorage.getItem('alunoId'); // NOVO: Obtenha o ID do Aluno

            if (!storedUserName || !storedUserType || !storedUserId) {
                Alert.alert('Sessão Expirada', 'Você precisa fazer login novamente.');
                navigation.replace('Login');
                return;
            }

            setNomeUsuario(storedUserName);
            setTipoUsuario(storedUserType);

            if (storedUserType === 'ALUNO') {
                // CORREÇÃO AQUI: Use storedAlunoId para buscar dados do aluno
                if (storedAlunoId) { // Verifique se o alunoId existe
                    console.log('Dashboard: Buscando dados para ALUNO com ID:', storedAlunoId);
                    await Promise.all([
                        fetchAlunoFaltasData(storedAlunoId), // Use storedAlunoId
                        fetchAlunoNotasData(storedAlunoId)  // Use storedAlunoId
                    ]);
                } else {
                    Alert.alert('Erro de Dados', 'ID do aluno não encontrado no armazenamento. Por favor, relogue.');
                    setFaltas(0);
                    setFaltasPorDisciplina([]);
                    setAulasAssistidas(0);
                    setTotalAulas(0);
                    setNotasAlunoResumo(null);
                }
            } else if (storedUserType === 'PROFESSOR') {
                const professorId = storedUserId; // Para professor, storedUserId deve ser o ID do professor
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
}, []); // Dependências vazias para rodar apenas uma vez na montagem (useFocusEffect já cuida da re-execução)

  useFocusEffect(loadUserDataAndFetchAPI); // Isso fará com que os dados sejam recarregados sempre que a tela ganhar foco

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

  // Funções auxiliares para renderizar as notas
  const renderNotaItem = ({ item: nota }) => (
    <View style={styles.notaItem}>
      <Text style={styles.notaTipo}>{nota.tipoNota || 'Nota'}:</Text>
      {/* Verifica se valor existe antes de chamar toFixed */}
      <Text style={styles.notaValor}>{nota.valor !== undefined && nota.valor !== null ? nota.valor.toFixed(1) : 'N/A'}</Text>
      {/* Exibe a data de lançamento se existir */}
      {nota.dataLancamento && <Text style={styles.notaData}>({nota.dataLancamento})</Text>}
    </View>
  );

  const renderNotasPorDisciplinaItem = ({ item: disciplinaNotas }) => (
    <View style={styles.disciplinaCard}>
      <Text style={styles.disciplinaTitle}>{disciplinaNotas.nomeDisciplina}</Text>
      <View style={styles.notasContainer}>
        {disciplinaNotas.notas && disciplinaNotas.notas.length > 0 ? (
          <FlatList
            data={disciplinaNotas.notas}
            keyExtractor={(nota, index) => nota.id ? nota.id.toString() : `nota-${index}`} // Use ID ou index como fallback
            renderItem={renderNotaItem}
            ListEmptyComponent={<Text style={styles.emptyNotaText}>Nenhuma nota nesta disciplina.</Text>}
            scrollEnabled={false} // Para permitir que o ScrollView pai role
          />
        ) : (
          <Text style={styles.emptyNotaText}>Nenhuma nota nesta disciplina.</Text>
        )}
      </View>
    </View>
  );

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

          {/* NOVA SEÇÃO: Suas Notas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suas Notas</Text>
            {notasAlunoResumo && notasAlunoResumo.notasPorDisciplina && notasAlunoResumo.notasPorDisciplina.length > 0 ? (
              <FlatList
                data={notasAlunoResumo.notasPorDisciplina}
                keyExtractor={(item) => item.disciplinaId.toString()}
                renderItem={renderNotasPorDisciplinaItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={<Text style={styles.noDataText}>Nenhuma nota encontrada.</Text>}
                scrollEnabled={false} // Essencial para que o ScrollView pai possa rolar
              />
            ) : (
              <Text style={styles.noDataText}>Nenhuma nota encontrada para este aluno.</Text>
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
  // NOVOS ESTILOS PARA AS NOTAS
  disciplinaCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    width: '100%', // Para ocupar a largura total dentro da section
  },
  disciplinaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  notasContainer: {
    marginTop: 5,
  },
  notaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notaTipo: {
    fontSize: 16,
    color: '#555',
    flex: 1, // Permite que o texto ocupe o espaço disponível
  },
  notaValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
  },
  notaData: {
    fontSize: 14,
    color: '#999',
  },
  emptyNotaText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    paddingVertical: 10,
  },
  listContent: {
    // Pode adicionar padding ou margem se precisar
  }
});