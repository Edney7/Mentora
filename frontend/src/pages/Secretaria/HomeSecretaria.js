import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Componentes da UI e Ícones
import Calendar from "../../components/Calendario"; // Seu componente de Calendário
import Modal from "../../components/Modal";         // Seu componente de Modal
import { useToast } from "../../hooks/use-toast";       // Novo hook de notificação
import {
  Users,
  GraduationCap,
  UserCheck,
  Building2,
  Calendar as CalendarIcon,
  Plus,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

// Funções da nossa API real
import {
  listarTodosOsUsuarios,
  listarProfessoresAtivos,
  listarAlunosAtivos,
  buscarTurmasAtivas,
  listarEventos,
  cadastrarEvento,
} from "../../services/ApiService";

// Componente para o estado de Carregamento (Spinner)
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando dados do painel...</p>
      </div>
    </div>
  );
}

// Componente principal da página
export default function HomeSecretaria() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient(); // Para invalidar queries após mutações

  // 1. BUSCA DE DADOS COM useQuery
  const usuariosQuery = useQuery({ queryKey: ["usuarios"], queryFn: listarTodosOsUsuarios });
  const professoresQuery = useQuery({ queryKey: ["professores"], queryFn: listarProfessoresAtivos });
  const alunosQuery = useQuery({ queryKey: ["alunos"], queryFn: listarAlunosAtivos });
  const turmasQuery = useQuery({ queryKey: ["turmas"], queryFn: buscarTurmasAtivas });
  const eventosQuery = useQuery({
    queryKey: ["eventos"],
    queryFn: listarEventos,
    select: (data) => data.map((ev) => ({ title: ev.titulo, date: ev.data, ...ev })),
  });

  // 2. MUTATION PARA CADASTRAR EVENTO
  const eventoMutation = useMutation({
    mutationFn: cadastrarEvento,
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Evento cadastrado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["eventos"] });
      fecharModal();
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.message || "Erro ao cadastrar evento.";
      toast({ title: "Erro", description: errorMsg, variant: "destructive" });
    },
  });

  // Gestão do Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [novoEvento, setNovoEvento] = useState({ titulo: "", descricao: "", data: "", tipo: "" });

  const abrirModal = () => {
    setNovoEvento({ titulo: "", descricao: "", data: "", tipo: "" });
    setModalAberto(true);
  };
  const fecharModal = () => setModalAberto(false);

  const handleAdicionarEvento = () => {
    if (!novoEvento.titulo || !novoEvento.data || !novoEvento.tipo) {
      toast({ title: "Campos obrigatórios", description: "Preencha título, data e tipo.", variant: "destructive" });
      return;
    }
    const idSecretaria = localStorage.getItem("userId");
    if (!idSecretaria) {
      toast({ title: "Erro de autenticação", description: "Faça o login novamente.", variant: "destructive" });
      return;
    }
    eventoMutation.mutate({
      ...novoEvento,
      idSecretaria: parseInt(idSecretaria, 10),
      idCalendario: 1,
    });
  };

  const isLoading =
    usuariosQuery.isLoading ||
    professoresQuery.isLoading ||
    alunosQuery.isLoading ||
    turmasQuery.isLoading ||
    eventosQuery.isLoading;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const queryError =
    usuariosQuery.error ||
    professoresQuery.error ||
    alunosQuery.error ||
    turmasQuery.error;
    
  if (queryError) {
    return ( <div className="p-6 text-red-600"> Erro ao carregar dados do painel: {queryError.message} </div> );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card Usuários */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
              <p className="text-3xl font-bold text-gray-900">{usuariosQuery.data?.length || 0}</p>
            </div>
            <Users className="h-10 w-10 text-blue-500" />
          </div>
          {/* Outros cards... */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Professores Ativos</p>
              <p className="text-3xl font-bold text-gray-900">{professoresQuery.data?.length || 0}</p>
            </div>
            <UserCheck className="h-10 w-10 text-green-500" />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alunos Matriculados</p>
              <p className="text-3xl font-bold text-gray-900">{alunosQuery.data?.length || 0}</p>
            </div>
            <GraduationCap className="h-10 w-10 text-yellow-500" />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Turmas</p>
              <p className="text-3xl font-bold text-gray-900">{turmasQuery.data?.length || 0}</p>
            </div>
            <Building2 className="h-10 w-10 text-purple-500" />
          </div>
        </div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* Botões de Ação Rápida */}
                 <Button variant="outline" className="h-auto p-6 text-left justify-start bg-white border border-gray-200 shadow-lg" onClick={() => navigate("/secretaria/usuarios")}>
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Gerenciar Usuários</h3>
                        <p className="text-gray-600 text-sm">Cadastre, edite e gerencie usuários</p>
                    </div>
                </Button>
                 <Button variant="outline" className="h-auto p-6 text-left justify-start bg-white border border-gray-200 shadow-lg" onClick={() => navigate("/secretaria/ausenciaProfessor")}>
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Ausência do Professor</h3>
                        <p className="text-gray-600 text-sm">Gerenciar ausências e substituições</p>
                    </div>
                 </Button>
                 <Button variant="outline" className="h-auto p-6 text-left justify-start bg-white border border-gray-200 shadow-lg" onClick={() => navigate("/secretaria/turmas")}>
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Gerenciar Turmas</h3>
                        <p className="text-gray-600 text-sm">Criar e organizar turmas</p>
                    </div>
                 </Button>
                 <Button variant="outline" className="h-auto p-6 text-left justify-start bg-white border border-gray-200 shadow-lg" onClick={() => navigate("/secretaria/disciplina")}>
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Gerenciar Disciplinas</h3>
                        <p className="text-gray-600 text-sm">Configurar matérias e currículos</p>
                    </div>
                </Button>
            </div>
          </div>

          {/* Coluna Lateral */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                <CalendarIcon className="mr-2" size={20} />
                Calendário
              </h3>
              <Calendar eventos={eventosQuery.data || []} />
            </div>
            {/*<Button className="w-full h-auto" onClick={abrirModal}>
                <div className="flex items-center justify-center space-x-2 p-2">
                    <Plus size={20} />
                    <span className="font-semibold">Cadastrar Evento</span>
                </div>
            </Button>*/}
          </div>
        </div>

        {/* Modal de Cadastro de Evento */}
        <Modal isOpen={modalAberto} onClose={fecharModal} contentLabel="Cadastrar Novo Evento">
            <div className="p-2 space-y-4">
                <h3 className="text-xl font-semibold">Cadastrar Novo Evento</h3>
                {/* Campos do formulário */}
                <div>
                    <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <Input id="titulo" type="text" placeholder="Ex: Reunião de Pais" value={novoEvento.titulo} onChange={(e) => setNovoEvento((p) => ({ ...p, titulo: e.target.value }))} />
                </div>
                <div>
                    <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <Input id="descricao" type="text" placeholder="Ex: Reunião do 1º bimestre" value={novoEvento.descricao} onChange={(e) => setNovoEvento((p) => ({ ...p, descricao: e.target.value }))} />
                </div>
                <div>
                    <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                    <Input id="data" type="date" value={novoEvento.data} onChange={(e) => setNovoEvento((p) => ({ ...p, data: e.target.value }))} />
                </div>
                <div>
                    <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Evento</label>
                    <Input id="tipo" type="text" placeholder="Ex: FERIADO, EVENTO" value={novoEvento.tipo} onChange={(e) => setNovoEvento((p) => ({ ...p, tipo: e.target.value }))} />
                </div>
                <div className="flex space-x-3 pt-4">
                    <Button variant="outline" onClick={fecharModal} className="flex-1">Cancelar</Button>
                    <Button onClick={handleAdicionarEvento} disabled={eventoMutation.isPending} className="flex-1">
                        {eventoMutation.isPending ? "Salvando..." : "Salvar"}
                    </Button>
                </div>
            </div>
        </Modal>

      </div>
    </div>
  );
}