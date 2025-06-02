import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // ajuste sua URL
});

// Cadastro de usuário
export const cadastrarUsuario = async (usuarioDados) => {
  const response = await api.post("/usuarios", usuarioDados);
  return response.data;
};

// Login
export const loginUsuario = async (email, senha) => {
  const response = await api.post("/usuarios/login", { email, senha });
  return response.data;
};

export const listarUsuario = async (filtros = {}) => {
  const response = await api.get("/usuarios/todos", { params: filtros });
  return response.data;
};

export const desativarUsuario = async (id) => {
  await api.delete(`/usuarios/${id}`);
};

export const reativarUsuario = async (id) => {
  await api.post(`/usuarios/${id}/reativar`);
};

//vai pegas as turmas  dinamicamente no back para o cadastro do aluno
export const buscarTurmas = async () => {
  const response = await api.get("/turmas");
  return response.data;
};

export const buscarTurmasAtivas = async () => {
  const response = await api.get("/turmas");
  return response.data; // Retorna os dados (a lista de turmas) da resposta da API.
};

export const cadastrarDisciplina = async (disciplinaData) => {
  const response = await api.post("/disciplinas", disciplinaData);
  return response.data;
};

export const buscarAlunos = async () => {
  const response = await api.get('/alunos');
  return response.data;
};

export const buscarProfessores = async () => {
  const response = await api.get('/professores');
  return response.data;
};

export const buscarDisciplinas = async () => {
  const response = await api.get("/disciplinas"); // Assumindo que este endpoint lista todas
  return response.data;
};


export const buscarDisciplinaPorId = async (id) => {
  const response = await api.get(`/disciplinas/${id}`);
  return response.data;
};


export const atualizarDisciplina = async (id, disciplinaData) => {
  const response = await api.put(`/disciplinas/${id}`, disciplinaData);
  return response.data;
};


export const excluirDisciplina = async (id) => {
  await api.delete(`/disciplinas/${id}`);
};
