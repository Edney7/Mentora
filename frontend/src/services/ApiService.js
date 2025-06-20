import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // Mantém a configuração para sessões/cookies
});

export default api;

// --- AUTENTICAÇÃO E USUÁRIOS ---
export const cadastrarUsuario = (data) => api.post("/usuarios", data).then(res => res.data);
export const loginUsuario = (email, senha) => api.post("/usuarios/login", { email, senha }).then(res => res.data);
export const atualizarUsuario = (id, data) => api.put(`/usuarios/${id}`, data).then(res => res.data);
export const desativarUsuario = (id) => api.delete(`/usuarios/${id}`);
export const reativarUsuario = (id) => api.post(`/usuarios/${id}/reativar`);
export const listarTodosOsUsuarios = () => api.get("/usuarios/todos").then(res => res.data);
export const buscarUsuarioPorIdIncluindoInativos = (id) => api.get(`/usuarios/todos/${id}`).then(res => res.data);
export const logoutUsuario = () => localStorage.clear();

// --- ALUNOS ---
export const listarAlunosAtivos = () => api.get("/alunos").then(res => res.data);
export const listarAlunosDaTurma = (turmaId) => api.get(`/turmas/${turmaId}/alunos`).then(res => res.data);

// --- PROFESSORES ---
export const listarProfessoresAtivos = () => api.get("/professores").then(res => res.data);
export const listarTurmasDoProfessor = (professorId) => api.get(`/turma-disciplina-professor/professor/${professorId}`).then(res => res.data);
export const listarProfessoresDaDisciplina = (disciplinaId) => api.get(`/professores/disciplinas/${disciplinaId}/professores`).then(res => res.data);
export const listarDisciplinasDoProfessor = (professorId) => api.get(`/professores/${professorId}/disciplinas`).then(res => res.data);

// --- DISCIPLINAS ---
export const buscarDisciplinas = () => api.get('/disciplinas').then(res => res.data);
export const cadastrarDisciplina = (data) => api.post("/disciplinas", data).then(res => res.data);
export const atualizarDisciplina = (id, data) => api.put(`/disciplinas/${id}`, data).then(res => res.data);
export const excluirDisciplina = (id) => api.delete(`/disciplinas/${id}`);

// --- TURMAS ---
export const buscarTodasAsTurmas = () => api.get("/turmas").then(res => res.data);
export const buscarTurmasAtivas = () => api.get('/turmas', { params: { ativa: true } }).then(res => res.data); // Assumindo que sua API pode filtrar
export const cadastrarTurma = (data) => api.post("/turmas", data).then(res => res.data);
export const atualizarTurma = (id, data) => api.put(`/turmas/${id}`, data).then(res => res.data);
export const desativarTurma = (id) => api.delete(`/turmas/${id}`);
export const reativarTurma = (id) => api.post(`/turmas/${id}/reativar`);

// --- NOTAS E FALTAS ---
export const listarTodasNotas = () => api.get("/notas").then(res => res.data);
export const listarTodasFaltas = () => api.get("/faltas").then(res => res.data);
export const listarNotasDoAlunoPorDisciplina = (alunoId, disciplinaId) => api.get(`/notas/aluno/${alunoId}/disciplina/${disciplinaId}`).then(res => res.data);

// --- AUSÊNCIAS, EVENTOS, ETC. ---
export const listarTodasAusenciasProfessor = () => api.get("/ausencias-professor").then(res => res.data);
export const listarEventos = () => api.get("/eventos").then(res => res.data);
export const cadastrarEvento = (evento) => api.post("/eventos", evento).then(res => res.data);