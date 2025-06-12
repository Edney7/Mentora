import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// BASE_URL da sua API (Certifique-se de que esta URL está correta!)
const API_BASE_URL = 'http://192.168.248.47:8080';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // 1. Primeira requisição: Login do Usuário
      const loginResponse = await fetch(`${API_BASE_URL}/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!loginResponse.ok) {
        const errorText = await loginResponse.text();
        console.error('Erro no backend no login:', loginResponse.status, errorText);
        Alert.alert('Erro no Login', `Usuário ou senha inválidos, ou problema no servidor. (${loginResponse.status})`);
        setLoading(false);
        return;
      }

      const userData = await loginResponse.json();
      console.log("1. Dados recebidos do backend após login (userData):", userData);

      if (!userData.id || !userData.tipoUsuario || !userData.nome) {
        Alert.alert('Erro de Dados', 'Resposta incompleta do servidor. Faltam informações essenciais do usuário (id, tipoUsuario, nome).');
        setLoading(false);
        return;
      }

      // Armazena dados básicos do usuário
      await AsyncStorage.setItem('userId', userData.id.toString());
      await AsyncStorage.setItem('userType', userData.tipoUsuario);
      await AsyncStorage.setItem('userName', userData.nome);

      // 2. Segunda requisição (condicional): Buscar alunoId se for ALUNO ou professorId se for PROFESSOR
      if (userData.tipoUsuario === 'ALUNO') {
        try {
          // Chamada para o NOVO endpoint do backend que você acabou de criar
          const alunoProfileResponse = await fetch(`${API_BASE_URL}/alunos/by-usuario/${userData.id}`, {
            headers: { 'Content-Type': 'application/json' },
          });

          console.log("2. Status da resposta para /alunos/by-usuario/:", alunoProfileResponse.status);

          if (!alunoProfileResponse.ok) {
            const errorText = await alunoProfileResponse.text();
            console.error('Erro ao buscar perfil de aluno:', alunoProfileResponse.status, errorText);
            Alert.alert('Erro', 'Não foi possível obter o perfil do aluno. As faltas podem não ser carregadas.');
            // Prossegue mesmo com erro, mas o Dashboard vai lidar com a falta do alunoId
          } else {
            const alunoProfileData = await alunoProfileResponse.json(); // Isso será seu AlunoResponseDTO
            console.log("3. Dados recebidos do backend para perfil de aluno (alunoProfileData):", alunoProfileData);

            // Verifique se o DTO contém o 'id' do aluno (que é o alunoId que precisamos)
            if (alunoProfileData && alunoProfileData.id) {
              await AsyncStorage.setItem('alunoId', alunoProfileData.id.toString());
              console.log('4. alunoId salvo no AsyncStorage:', alunoProfileData.id);
            } else {
              Alert.alert('Erro', 'A resposta para o perfil do aluno está vazia ou incompleta (sem ID).');
              console.warn('Resposta de /alunos/by-usuario/ não contém o ID do aluno.');
            }
          }
        } catch (alunoError) {
          console.error('Erro na segunda requisição para perfil de aluno (catch):', alunoError);
          Alert.alert('Erro de Conexão', 'Não foi possível buscar o perfil do aluno. Verifique a API.');
        }
      } else if (userData.tipoUsuario === 'PROFESSOR') {
        // Implemente lógica similar para buscar professorId se sua API tiver um endpoint para isso
        try {
            const professorProfileResponse = await fetch(`${API_BASE_URL}/professores/by-usuario/${userData.id}`, {
                headers: { 'Content-Type': 'application/json' },
            });
            if (!professorProfileResponse.ok) {
                const errorText = await professorProfileResponse.text();
                console.error('Erro ao buscar perfil de professor:', professorProfileResponse.status, errorText);
                Alert.alert('Erro', 'Não foi possível obter o perfil do professor.');
            } else {
                const professorProfileData = await professorProfileResponse.json();
                if (professorProfileData && professorProfileData.id) { // Supondo que ProfessorResponseDTO também tem 'id'
                    await AsyncStorage.setItem('professorId', professorProfileData.id.toString());
                    console.log('professorId salvo no AsyncStorage:', professorProfileData.id);
                } else {
                    Alert.alert('Erro', 'A resposta para o perfil do professor está vazia ou incompleta.');
                }
            }
        } catch (professorError) {
            console.error('Erro na requisição para perfil de professor:', professorError);
            Alert.alert('Erro de Conexão', 'Não foi possível buscar o perfil do professor.');
        }
      }

      // Navega para a Dashboard (que agora é única e se adapta ao tipo de usuário)
      navigation.navigate('Dashboard');

    } catch (error) {
      console.error('Erro geral no login ou AsyncStorage:', error);
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique sua internet ou o endereço da API.');
    } finally {
      setLoading(false);
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

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
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