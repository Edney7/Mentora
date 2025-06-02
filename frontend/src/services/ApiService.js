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

export const listarUsuario = async (nome,  tipoUsuario, sexo) => {
  const response = await api.get("/usuarios", {
    params: { nome,  tipoUsuario, sexo },
  });
  return response.data;
};

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
export const excluirDisciplina = async (id) => {
  await api.delete(`/disciplinas/${id}`);
};
