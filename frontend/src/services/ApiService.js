import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken"); 
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const cadastrarUsuario = async (usuarioDados) => {
  const response = await api.post("/usuarios", usuarioDados);
  return response.data;
};

export const loginUsuario = async (email, senha) => {
  const response = await api.post("/usuarios/login", { email, senha });
  return response.data;
};

export const logoutUsuario = () => {
  localStorage.removeItem("userToken");
  delete api.defaults.headers.common['Authorization'];
};

export const listarUsuariosAtivos = async (filtros = {}) => { 
  const response = await api.get("/usuarios", { params: filtros }); 
  return response.data;
};

export const listarTodosOsUsuarios = async (filtros = {}) => {
  const response = await api.get("/usuarios/todos", { params: filtros });
  return response.data;
};

export const buscarUsuarioAtivoPorId = async (id) => {
  const response = await api.get(`/usuarios/${id}`);
  return response.data;
};

export const buscarUsuarioPorIdIncluindoInativos = async (id) => {
  const response = await api.get(`/usuarios/todos/${id}`);
  return response.data;
};

export const atualizarUsuario = async (id, usuarioData) => {
  const response = await api.put(`/usuarios/${id}`, usuarioData);
  return response.data;
};

export const desativarUsuario = async (id) => {
  await api.delete(`/usuarios/${id}`);
};

export const reativarUsuario = async (id) => {
  await api.post(`/usuarios/${id}/reativar`);
};

// --- Alunos (Perfis) ---
export const listarAlunosAtivos = async () => {
    const response = await api.get("/alunos");
    return response.data;
};

export const buscarAlunoAtivoPorId = async (alunoId) => {
    const response = await api.get(`/alunos/${alunoId}`);
    return response.data;
};

export const listarAlunosDaTurma = async (turmaId) => {
  const response = await api.get(`/turmas/${turmaId}/alunos`);
  return response.data;
};

export const vincularAlunoATurma = async (alunoId, turmaId) => {
  const response = await api.put(`/alunos/${alunoId}/vincular-turma/${turmaId}`);
  return response.data; 
};

export const desvincularAlunoDaTurma = async (alunoId) => {
  const response = await api.put(`/alunos/${alunoId}/desvincular-turma`);
  return response.data;
};

// --- Professores (Perfis) ---
export const listarProfessoresAtivos = async () => {
    const response = await api.get("/professores");
    return response.data;
};
export const listarTurmasDoProfessor = async (professorId) => {
  const response = await api.get(`/turma-disciplina-professor/professor/${professorId}`);
  return response.data;
};// estou usando


export const buscarProfessorAtivoPorId = async (professorId) => {
    const response = await api.get(`/professores/${professorId}`);
    return response.data;
};

// --- Secretarias (Perfis) ---
export const listarSecretariasAtivas = async () => {
    const response = await api.get("/secretarias");
    return response.data;
};

export const buscarSecretariaAtivaPorId = async (secretariaId) => {
    const response = await api.get(`/secretarias/${secretariaId}`);
    return response.data;
};

// --- Disciplinas ---
export const buscarDisciplinas = async () => {
  const response = await api.get('/disciplinas');
  return response.data;
};

export const cadastrarDisciplina = async (disciplinaData) => {
  const response = await api.post("/disciplinas", disciplinaData);
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

// services/Api.js
export const buscarAusencias = async () => {
  const response = await api.get("/ausencias-professor");
  return response.data;
};

// ApiService.js
export const buscarAusenciasComFiltro = async ({ nome, mesAusencia, mesRegistro }) => {
  const params = new URLSearchParams();

  if (nome) params.append("nome", nome);
  if (mesAusencia) params.append("mesAusencia", mesAusencia);
  if (mesRegistro) params.append("mesRegistro", mesRegistro);

  const response = await api.get(`/ausencias-professor/filtro?${params.toString()}`);
  return response.data;
};


// --- Turmas ---
export const buscarTurmasAtivas = async () => { 
  const response = await api.get('/turmas'); 
  return response.data;
};
export const buscarTurmaDetalhada = async (id) => {
  const response = await api.get(`/turmas/${id}/detalhes`);
  return response.data;
};


/**
 * Busca TODAS as turmas (ativas e inativas) - geralmente para admin.
 * @returns {Promise<Array<object>>} Lista de todas as turmas.
 */
export const buscarTodasAsTurmas = async () => {
  // A chamada correta é para a URL base do recurso
  const response = await api.get("/turmas"); 
  return response.data;
};

export const cadastrarTurma = async (turmaData) => { 
  const response = await api.post("/turmas", turmaData);
  return response.data;
};

export const buscarTurmaAtivaPorId = async (id) => {
  const response = await api.get(`/turmas/${id}`);
  return response.data;
};

export const atualizarTurma = async (id, turmaData) => { 
  const response = await api.put(`/turmas/${id}`, turmaData);
  return response.data;
};

export const desativarTurma = async (id) => {
  await api.delete(`/turmas/${id}`);
};

export const reativarTurma = async (id) => {
  await api.post(`/turmas/${id}/reativar`);
};

// --- Associação Turma-Disciplina ---
/*export const listarDisciplinasDaTurma = async (turmaId) => {
  const response = await api.get(`/turmas/${turmaId}/disciplinas`);
  return response.data;
};*/

export const vincularDisciplinaNaTurma = async (turmaId, disciplinaId) => {
  await api.post(`/turmas/${turmaId}/disciplinas/${disciplinaId}`);
}; // UTILIZADA

export const desvincularDisciplinaDaTurma = async (turmaId, disciplinaId) => {
  await api.delete(`/turmas/${turmaId}/disciplinas/${disciplinaId}`);
};

export const atualizarDisciplinasDaTurma = async (turmaId, disciplinaIds) => {
  await api.put(`/turmas/${turmaId}/disciplinas`, disciplinaIds);
};

// --- Associação Professor-Disciplina ---
export const listarDisciplinasDoProfessor = async (professorId) => {
    const response = await api.get(`/professores/${professorId}/disciplinas`);
    return response.data;
};

export const listarProfessoresDaDisciplina = async (disciplinaId) => {
    try{
    const response = await api.get(`professores/disciplinas/${disciplinaId}/professores`);
    console.log("Response da API:", response.data);
    return response.data;
    } catch (error) {
        console.error("Erro na API ao listar professores da disciplina:", error);
        throw error; 
    } //vou usar ela
}; 

export const vincularDisciplinaEProfessorNaTurma = async (turmaId, disciplinaId, professorId) => {
    const response = await api.post(`/turma-disciplina-professor`, { // Use a rota do seu novo controller
        turmaId,
        disciplinaId,
        professorId
    });
    return response.data;
};//nova estou usando

// E uma para listar  (disciplina + professor) para a turma
export const listarDisciplinaTurma = async (turmaId) => {
    const response = await api.get(`/turma-disciplina-professor/turma/${turmaId}`);
    return response.data;
};//nova estou usando

export const vincularDisciplinaAoProfessor = async (professorId, disciplinaId) => {
    await api.post(`/professores/${professorId}/disciplinas/${disciplinaId}`);
};

export const desvincularDisciplinaDoProfessor = async (professorId, disciplinaId) => {
    await api.delete(`/professores/${professorId}/disciplinas/${disciplinaId}`);
};

export const atualizarDisciplinasDoProfessor = async (professorId, disciplinaIds) => {
    await api.put(`/professores/${professorId}/disciplinas`, disciplinaIds);
};

// --- Notas ---
export const lancarNota = async (notaData) => {
    const response = await api.post("/notas", notaData);
    return response.data;
};

export const listarNotasDoAluno = async (alunoId) => {
    const response = await api.get(`/notas/aluno/${alunoId}`);
    return response.data;
};

export const buscarNotaPorId = async (id) => {
    const response = await api.get(`/notas/${id}`);
    return response.data;
};

export const listarNotasDoAlunoPorDisciplina = async (alunoId, disciplinaId) => {
    const response = await api.get(`/notas/aluno/${alunoId}/disciplina/${disciplinaId}`);
    return response.data; //usar
};
// --- NOVAS FUNÇÕES: AULAS ---
// Endpoint: POST /aulas
// Cria uma nova aula ou retorna uma existente.
export const criarOuObterAula = async (aulaDTO) => {
    try {
        const response = await api.post("/aulas", aulaDTO);
        return response.data; // Retorna o AulaResponseDTO
    } catch (error) {
        console.error("Erro ao criar ou obter aula:", error);
        throw error;
    }
};

// Endpoint: GET /aulas/{id}
export const getAulaById = async (aulaId) => {
    try {
        const response = await api.get(`/aulas/${aulaId}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar aula com ID ${aulaId}:`, error);
        throw error;
    }
};

// Endpoint: GET /aulas/professor/{professorId}/disciplina/{disciplinaId}/turma/{turmaId}
export const listarAulasPorProfessorEDisciplinaETurma = async (professorId, disciplinaId, turmaId) => {
    try {
        const response = await api.get(`/aulas/professor/${professorId}/disciplina/${disciplinaId}/turma/${turmaId}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao listar aulas por professor, disciplina e turma:", error);
        throw error;
    }
};

// --- NOVAS FUNÇÕES: FALTAS ---
// Endpoint: POST /faltas/sincronizar
// Sincroniza faltas para uma aula específica.
export const sincronizarFaltasPorAula = async (aulaId, faltasParaManter,professorQueEstaRegistrandoId) => {
    try {
        const response = await api.post(`/faltas/aula/${aulaId}/sincronizar?professorQueEstaRegistrandoId=${professorQueEstaRegistrandoId}`, faltasParaManter);
        return response.data; // Deve retornar uma lista de FaltaResponseDTO
    } catch (error) {
        console.error("Erro ao sincronizar faltas por aula:", error);
        throw error;
    }
};

// Endpoint: GET /faltas/aula/{aulaId}
export const listarFaltasDeUmaAula = async (aulaId) => {
    try {
        const response = await api.get(`/faltas/aula/${aulaId}`);
        return response.data; // Deve retornar uma lista de FaltaResponseDTO
    } catch (error) {
        console.error("Erro ao listar faltas de uma aula:", error);
        throw error;
    }
};


// --- Faltas ---
export const registrarFalta = async (faltaData) => {
    const response = await api.post("/faltas", faltaData);
    return response.data;
};

export const justificarFalta = async (faltaId, justificativaData) => {
    const response = await api.put(`/faltas/${faltaId}/justificar`, justificativaData);
    return response.data;
};

export const buscarFaltaPorId = async (id) => {
    const response = await api.get(`/faltas/${id}`);
    return response.data;
};

export const listarFaltasDoAluno = async (alunoId) => {
    const response = await api.get(`/faltas/aluno/${alunoId}`);
    return response.data;
};

export const listarFaltasDoAlunoPorDisciplina = async (alunoId, disciplinaId) => {
    const response = await api.get(`/faltas/aluno/${alunoId}/disciplina/${disciplinaId}`);
    return response.data;
};

export const listarFaltasDoProfessor = async (professorId) => {
    const response = await api.get(`/faltas/professor/${professorId}`);
    return response.data;
};

export const listarTodasNotas = async () => {
  const response = await api.get("/notas");
  return response.data;
};

export const listarTodasFaltas = async () => {
  const response = await api.get("/faltas");
  return response.data;
};


export const listarFaltasPorData = async (dataFalta) => { 
    const response = await api.get(`/faltas/data/${dataFalta}`);
    return response.data;
};

export const excluirFalta = async (faltaId) => {
    await api.delete(`/faltas/${faltaId}`);
};

// --- Ausência de Professor ---
export const registarAusenciaProfessor = async (ausenciaData) => {
    const response = await api.post("/ausencias-professor", ausenciaData);
    return response.data;
};

export const buscarAusenciaProfessorPorId = async (id) => {
    const response = await api.get(`/ausencias-professor/${id}`);
    return response.data;
};

export const listarAusenciasDoProfessor = async (professorId) => {
    const response = await api.get(`/ausencias-professor/professor/${professorId}`);
    return response.data;
};

export const listarAusenciasProfessorPorData = async (dataAusencia) => { 
    const response = await api.get(`/ausencias-professor/data/${dataAusencia}`);
    return response.data;
};

export const listarTodasAusenciasProfessor = async () => {
    const response = await api.get("/ausencias-professor");
    return response.data;
};

export const cancelarAusenciaProfessor = async (ausenciaId) => {
    await api.delete(`/ausencias-professor/${ausenciaId}`);
};

// Buscar todos os eventos do calendário
export const listarEventos = async () => {
  const response = await api.get("/eventos");
  return response.data;
};

// Cadastrar novo evento
export const cadastrarEvento = async (evento) => {
  const response = await api.post("/eventos", evento);
  return response.data;
};
export default api;
