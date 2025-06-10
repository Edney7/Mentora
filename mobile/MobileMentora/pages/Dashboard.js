import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Importe useNavigation

export default function Dashboard() {
  const navigation = useNavigation(); // Hook para navegação

  // Dados fictícios para simular as informações do aluno/professor
  const [nomeUsuario, setNomeUsuario] = useState('Fulano de Tal');
  const [tipoUsuario, setTipoUsuario] = useState('ALUNO'); // Pode ser 'ALUNO' ou 'PROFESSOR'
  const [faltas, setFaltas] = useState(5); // Número fictício de faltas
  const [aulasAssistidas, setAulasAssistidas] = useState(25); // Dados fictícios
  const [totalAulas, setTotalAulas] = useState(30); // Dados fictícios

  // Faltas específicas por disciplina (exemplo)
  const [faltasPorDisciplina, setFaltasPorDisciplina] = useState([
    { disciplina: 'Matemática', faltas: 2 },
    { disciplina: 'Português', faltas: 1 },
    { disciplina: 'História', faltas: 0 },
    { disciplina: 'Ciências', faltas: 2 },
  ]);

  // Exemplo de atividades recentes para professores
  const [atividadesProfessor, setAtividadesProfessor] = useState([
    { id: 1, descricao: 'Lançar notas - Turma 3B', data: '10/06/2025' },
    { id: 2, descricao: 'Reunião de pais - 14h', data: '11/06/2025' },
    { id: 3, descricao: 'Planejamento de aula - Biologia', data: '12/06/2025' },
  ]);


  // Função de Logout (apenas para simular a navegação de volta para o Login)
  const handleLogout = () => {
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
          onPress: () => navigation.replace('Login'), // Redireciona para a tela de Login
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
            {faltasPorDisciplina.map((item, index) => (
              <View key={index} style={styles.disciplineItem}>
                <Text style={styles.disciplineName}>{item.disciplina}</Text>
                <Text style={styles.disciplineFaltas}>{item.faltas} falta(s)</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Seção para PROFESSORES */}
      {tipoUsuario === 'PROFESSOR' && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Minhas Atividades</Text>
            {atividadesProfessor.map((item) => (
              <View key={item.id} style={styles.activityItem}>
                <Text style={styles.activityDescription}>{item.descricao}</Text>
                <Text style={styles.activityDate}>{item.data}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Turmas</Text>
            {/* Adicione cards ou listas para turmas aqui */}
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
    backgroundColor: '#f5f5f5', // Alterei para um fundo mais claro
    padding: 20,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 30, // Espaçamento para a barra de status
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
    resizeMode: 'cover', // Melhor para imagens de largura total
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
    width: '46%', // Ajustado para dois cards com espaçamento
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
    color: '#ff6347', // Cor para destacar faltas
    fontWeight: 'bold',
  },
  activityItem: {
    backgroundColor: '#e6ffe6', // Um verde claro
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
    color: '#006400', // Verde escuro
  },
  activityDate: {
    fontSize: 14,
    color: '#3cb371', // Verde médio
    marginTop: 5,
  },
});