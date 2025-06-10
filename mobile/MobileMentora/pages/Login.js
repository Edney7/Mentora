import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importe AsyncStorage

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    // --- SIMULANDO O LOGIN E DADOS RETORNADOS PELO BACKEND ---
    // Você pode ajustar esses dados fictícios conforme o teste:
    let loggedInUser = null;

    if (email === 'aluno@escola.com' && senha === '123') {
      loggedInUser = {
        id: '1', // id_usuario fictício
        tipoUsuario: 'ALUNO',
        nome: 'Maria da Silva',
        alunoId: '101', // id_aluno fictício
        faltasTotais: 8,
        faltasDisciplinas: [
          { disciplina: 'Matemática', faltas: 3 },
          { disciplina: 'Português', faltas: 2 },
          { disciplina: 'História', faltas: 1 },
          { disciplina: 'Ciências', faltas: 2 },
        ],
        aulasAssistidas: 25,
        totalAulas: 30,
      };
    } else if (email === 'professor@escola.com' && senha === '123') {
      loggedInUser = {
        id: '2', // id_usuario fictício
        tipoUsuario: 'PROFESSOR',
        nome: 'Prof. Carlos',
        professorId: '201', // id_professor fictício
        atividades: [
          { id: 1, descricao: 'Lançar notas - Turma 3B', data: '10/06/2025' },
          { id: 2, descricao: 'Reunião de pais - 14h', data: '11/06/2025' },
          { id: 3, descricao: 'Planejamento de aula - Biologia', data: '12/06/2025' },
        ],
      };
    } else {
      Alert.alert('Erro no Login', 'Usuário ou senha inválidos. Tente: aluno@escola.com / 123 ou professor@escola.com / 123');
      return; // Sai da função se as credenciais não corresponderem
    }

    // --- ARMAZENANDO OS DADOS FICTÍCIOS NO ASYNCSTORAGE ---
    try {
      await AsyncStorage.setItem('userId', loggedInUser.id);
      await AsyncStorage.setItem('userType', loggedInUser.tipoUsuario);
      await AsyncStorage.setItem('userName', loggedInUser.nome); // Armazena o nome

      if (loggedInUser.tipoUsuario === 'ALUNO') {
        await AsyncStorage.setItem('alunoId', loggedInUser.alunoId);
        await AsyncStorage.setItem('alunoFaltasTotais', loggedInUser.faltasTotais.toString());
        await AsyncStorage.setItem('alunoAulasAssistidas', loggedInUser.aulasAssistidas.toString());
        await AsyncStorage.setItem('alunoTotalAulas', loggedInUser.totalAulas.toString());
        await AsyncStorage.setItem('alunoFaltasDisciplinas', JSON.stringify(loggedInUser.faltasDisciplinas)); // Armazena array como string JSON
        navigation.navigate('Dashboard');
      } else if (loggedInUser.tipoUsuario === 'PROFESSOR') {
        await AsyncStorage.setItem('professorId', loggedInUser.professorId);
        await AsyncStorage.setItem('professorAtividades', JSON.stringify(loggedInUser.atividades)); // Armazena array como string JSON
        navigation.navigate('Dashboard'); // Assumindo que Dashboard será a tela para ambos
      }
    } catch (error) {
      Alert.alert('Erro de Armazenamento', 'Não foi possível salvar os dados do usuário. Tente novamente.');
      console.error('Erro ao salvar no AsyncStorage:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});