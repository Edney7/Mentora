import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});
//vai pegas as turmas  dinamicamente no back para o cadastro do aluno
export const buscarTurmas = async () => {
  const response = await api.get('/turmas');
  return response.data;
};
//vai pegas as disciplinas dinamicamente no back para o cadastro do professor
export const buscarDisciplinas = async () => {
  const response = await api.get('/disciplinas');
  return response.data;
};

