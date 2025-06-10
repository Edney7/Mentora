import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.248.47:8080/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro do backend:', errorText);
        Alert.alert('Erro no Login', 'Usuário ou senha inválidos. Por favor, tente novamente.');
        throw new Error('Login falhou. Verifique suas credenciais.');
      }

      const data = await response.json();

      // Garante que 'id' (id_usuario) e 'tipoUsuario' estejam presentes
      if (data && data.id && data.tipoUsuario) {
        // Armazena o ID principal do usuário (id_usuario da tabela Usuario)
        await AsyncStorage.setItem('userId', data.id.toString());
        // Armazena o tipo de usuário
        await AsyncStorage.setItem('userType', data.tipoUsuario);

        // Se o usuário for ALUNO e o backend fornecer 'alunoId', armazena-o
        if (data.tipoUsuario === 'ALUNO' && data.alunoId) {
          await AsyncStorage.setItem('alunoId', data.alunoId.toString());
        }
        // Se o usuário for PROFESSOR e o backend fornecer 'professorId', armazena-o
        // (Este é um exemplo, ajuste conforme seu backend para professores)
        if (data.tipoUsuario === 'PROFESSOR' && data.professorId) {
          await AsyncStorage.setItem('professorId', data.professorId.toString());
        }

        if (data.tipoUsuario === 'ALUNO') {
          // Navega para a Dashboard (que agora é única para ambos os tipos, com conteúdo condicional)
          navigation.navigate('Dashboard');
        } else if (data.tipoUsuario === 'PROFESSOR') {
          // Mantém a navegação para DashboardProfessor, caso seja uma tela diferente
          navigation.navigate('DashboardProfessor');
        } else {
          Alert.alert('Acesso Negado', 'Tipo de usuário não autorizado.');
        }
      } else {
        Alert.alert('Erro', 'Resposta inesperada do servidor após o login. Dados incompletos.');
      }
    } catch (error) {
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique sua internet ou tente novamente.');
      console.error(error);
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