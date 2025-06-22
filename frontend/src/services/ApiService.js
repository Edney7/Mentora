import axios from "axios";

// Instância única do Axios com configurações base
const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // Garante que cookies de sessão sejam enviados
});

export default api; // Exporta a instância para uso direto se necessário

// --- AUTENTICAÇÃO E USUÁRIOS ---
export const cadastrarUsuario = (data) =>
  api.post("/usuarios", data).then((res) => res.data);
export const loginUsuario = (email, senha) =>
  api.post("/usuarios/login", { email, senha }).then((res) => res.data);
export const atualizarUsuario = (id, data) =>
  api.put(`/usuarios/${id}`, data).then((res) => res.data);
export const desativarUsuario = (id) => api.delete(`/usuarios/${id}`);
export const reativarUsuario = (id) => api.post(`/usuarios/${id}/reativar`);
export const listarTodosOsUsuarios = () =>
  api.get("/usuarios/todos").then((res) => res.data);
export const buscarUsuarioPorIdIncluindoInativos = (id) =>
  api.get(`/usuarios/todos/${id}`).then((res) => res.data);
export const logoutUsuario = () => localStorage.clear();
export const listarUsuariosAtivos = (filtros = {}) =>
  api.get("/usuarios", { params: filtros }).then((res) => res.data);
export const buscarUsuarioAtivoPorId = (id) =>
  api.get(`/usuarios/${id}`).then((res) => res.data);

// --- ALUNOS ---
export const listarAlunosAtivos = () =>
  api.get("/alunos").then((res) => res.data);
export const listarAlunosDaTurma = (turmaId) =>
  api.get(`/turmas/${turmaId}/alunos`).then((res) => res.data);
export const buscarAlunoAtivoPorId = (alunoId) =>
  api.get(`/alunos/${alunoId}`).then((res) => res.data);
export const vincularAlunoATurma = (alunoId, turmaId) =>
  api
    .put(`/alunos/${alunoId}/vincular-turma/${turmaId}`)
    .then((res) => res.data);
export const desvincularAlunoDaTurma = (alunoId) =>
  api.put(`/alunos/${alunoId}/desvincular-turma`).then((res) => res.data);

// --- PROFESSORES ---
export const listarProfessoresAtivos = () =>
  api.get("/professores").then((res) => res.data);
export const listarTurmasDoProfessor = (professorId) =>
  api
    .get(`/turma-disciplina-professor/professor/${professorId}`)
    .then((res) => res.data);
export const listarProfessoresDaDisciplina = (disciplinaId) =>
  api
    .get(`/professores/disciplinas/${disciplinaId}/professores`)
    .then((res) => res.data);
export const listarDisciplinasDoProfessor = (professorId) =>
  api.get(`/professores/${professorId}/disciplinas`).then((res) => res.data);
export const buscarProfessorAtivoPorId = (professorId) =>
  api.get(`/professores/${professorId}`).then((res) => res.data);
export const atualizarDisciplinasDoProfessor = (professorId, disciplinaIds) =>
  api.put(`/professores/${professorId}/disciplinas`, disciplinaIds);
export const vincularDisciplinaAoProfessor = (professorId, disciplinaId) =>
  api.post(`/professores/${professorId}/disciplinas/${disciplinaId}`);
export const desvincularDisciplinaDoProfessor = (professorId, disciplinaId) =>
  api.delete(`/professores/${professorId}/disciplinas/${disciplinaId}`);

// --- SECRETARIAS ---
export const listarSecretariasAtivas = () =>
  api.get("/secretarias").then((res) => res.data);
export const buscarSecretariaAtivaPorId = (secretariaId) =>
  api.get(`/secretarias/${secretariaId}`).then((res) => res.data);

// --- DISCIPLINAS ---
export const buscarDisciplinas = () =>
  api.get("/disciplinas").then((res) => res.data);
export const cadastrarDisciplina = (data) =>
  api.post("/disciplinas", data).then((res) => res.data);
export const atualizarDisciplina = (id, data) =>
  api.put(`/disciplinas/${id}`, data).then((res) => res.data);
export const excluirDisciplina = (id) => api.delete(`/disciplinas/${id}`);
export const buscarDisciplinaPorId = (id) =>
  api.get(`/disciplinas/${id}`).then((res) => res.data);

// --- TURMAS ---
export const buscarTodasAsTurmas = () =>
  api.get("/turmas/todas").then((res) => res.data);
export const buscarTurmasAtivas = () =>
  api.get("/turmas").then((res) => res.data);
export const buscarTurmaDetalhada = (id) =>
  api.get(`/turmas/${id}/detalhes`).then((res) => res.data);
export const buscarTurmaAtivaPorId = (id) =>
  api.get(`/turmas/${id}`).then((res) => res.data);
export const cadastrarTurma = (data) =>
  api.post("/turmas", data).then((res) => res.data);
export const atualizarTurma = (id, data) =>
  api.put(`/turmas/${id}`, data).then((res) => res.data);
export const desativarTurma = (id) => api.delete(`/turmas/${id}`);
export const reativarTurma = (id) => api.post(`/turmas/${id}/reativar`);

// --- ASSOCIAÇÕES TURMA-DISCIPLINA-PROFESSOR ---
export const listarDisciplinaTurma = (turmaId) =>
  api
    .get(`/turma-disciplina-professor/turma/${turmaId}`)
    .then((res) => res.data);
export const vincularDisciplinaEProfessorNaTurma = (
  turmaId,
  disciplinaId,
  professorId
) =>
  api
    .post(`/turma-disciplina-professor`, { turmaId, disciplinaId, professorId })
    .then((res) => res.data);
export const vincularDisciplinaNaTurma = (turmaId, disciplinaId) =>
  api.post(`/turmas/${turmaId}/disciplinas/${disciplinaId}`);
export const desvincularDisciplinaDaTurma = (turmaId, disciplinaId) =>
  api.delete(`/turmas/${turmaId}/disciplinas/${disciplinaId}`);
export const atualizarDisciplinasDaTurma = (turmaId, disciplinaIds) =>
  api.put(`/turmas/${turmaId}/disciplinas`, disciplinaIds);

// --- NOTAS ---
export const lancarNota = (notaData) =>
  api.post("/notas", notaData).then((res) => res.data);
export const listarTodasNotas = () => api.get("/notas").then((res) => res.data);
export const listarNotasDoAluno = (alunoId) =>
  api.get(`/notas/aluno/${alunoId}`).then((res) => res.data);
export const listarNotasDoAlunoPorDisciplina = (alunoId, disciplinaId) =>
  api
    .get(`/notas/aluno/${alunoId}/disciplina/${disciplinaId}`)
    .then((res) => res.data);
export const buscarNotaPorId = (id) =>
  api.get(`/notas/${id}`).then((res) => res.data);

// --- AULAS ---
export const criarOuObterAula = (aulaDTO) =>
  api.post(`/aulas`, aulaDTO).then((res) => res.data);
export const getAulaById = (aulaId) =>
  api.get(`/aulas/${aulaId}`).then((res) => res.data);
export const listarAulasPorProfessorEDisciplinaETurma = (
  professorId,
  disciplinaId,
  turmaId
) =>
  api
    .get(
      `/aulas/professor/${professorId}/disciplina/${disciplinaId}/turma/${turmaId}`
    )
    .then((res) => res.data);

// --- FALTAS ---
export const sincronizarFaltasPorAula = (
  aulaId,
  faltasParaManter,
  professorQueEstaRegistrandoId
) =>
  api
    .post(
      `/faltas/aula/${aulaId}/sincronizar?professorQueEstaRegistrandoId=${professorQueEstaRegistrandoId}`,
      faltasParaManter
    )
    .then((res) => res.data);
export const listarFaltasDeUmaAula = (aulaId) =>
  api.get(`/faltas/aula/${aulaId}`).then((res) => res.data);
export const registrarFalta = (faltaData) =>
  api.post("/faltas", faltaData).then((res) => res.data);
export const justificarFalta = (faltaId, justificativaData) =>
  api
    .put(`/faltas/${faltaId}/justificar`, justificativaData)
    .then((res) => res.data);
export const buscarFaltaPorId = (id) =>
  api.get(`/faltas/${id}`).then((res) => res.data);
export const listarFaltasDoAluno = (alunoId) =>
  api.get(`/faltas/aluno/${alunoId}`).then((res) => res.data);
export const listarFaltasDoAlunoPorDisciplina = (alunoId, disciplinaId) =>
  api
    .get(`/faltas/aluno/${alunoId}/disciplina/${disciplinaId}`)
    .then((res) => res.data);
export const listarFaltasDoProfessor = (professorId) =>
  api.get(`/faltas/professor/${professorId}`).then((res) => res.data);
export const listarTodasFaltas = () =>
  api.get("/faltas").then((res) => res.data);
export const listarFaltasPorData = (dataFalta) =>
  api.get(`/faltas/data/${dataFalta}`).then((res) => res.data);
export const excluirFalta = (faltaId) => api.delete(`/faltas/${faltaId}`);

// --- AUSÊNCIAS DE PROFESSOR ---
export const registarAusenciaProfessor = (ausenciaData) =>
  api.post("/ausencias-professor", ausenciaData).then((res) => res.data);
export const listarTodasAusenciasProfessor = () =>
  api.get("/ausencias-professor").then((res) => res.data);
export const buscarAusenciasComFiltro = ({ nome, mesAusencia, mesRegistro }) =>
  api
    .get(`/ausencias-professor/filtro`, {
      params: { nome, mesAusencia, mesRegistro },
    })
    .then((res) => res.data);
export const buscarAusenciaProfessorPorId = (id) =>
  api.get(`/ausencias-professor/${id}`).then((res) => res.data);
export const listarAusenciasDoProfessor = (professorId) =>
  api
    .get(`/ausencias-professor/professor/${professorId}`)
    .then((res) => res.data);
export const listarAusenciasProfessorPorData = (dataAusencia) =>
  api.get(`/ausencias-professor/data/${dataAusencia}`).then((res) => res.data);
export const cancelarAusenciaProfessor = (ausenciaId) =>
  api.delete(`/ausencias-professor/${ausenciaId}`);

// --- EVENTOS ---
export const listarEventos = () => api.get("/eventos").then((res) => res.data);
export const cadastrarEvento = (evento) =>
  api.post("/eventos", evento).then((res) => res.data);
