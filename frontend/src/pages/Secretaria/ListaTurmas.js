import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Componentes
import TurmaForm from "../../components/TurmaForm";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { useToast } from "../../hooks/use-toast";

// Ícones
import {
  ArrowLeft,
  Plus,
  Users,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
} from "lucide-react";

// Funções da API
import {
  buscarTodasAsTurmas,
  desativarTurma,
  reativarTurma,
  cadastrarTurma,
  atualizarTurma,
} from "../../services/ApiService";

function TurmasSkeleton() {
  return Array(3)
    .fill(0)
    .map((_, i) => (
      <Card key={i} className="p-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </Card>
    ));
}

export default function ListaTurmas() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // CORREÇÃO: Voltando para a lógica de filtros individuais que funcionava
  const [nomeFiltro, setNomeFiltro] = useState("");
  const [turnoFiltro, setTurnoFiltro] = useState("");
  const [serieAnoFiltro, setSerieAnoFiltro] = useState("");
  const [anoLetivoFiltro, setAnoLetivoFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("ATIVAS");

  const [modalState, setModalState] = useState({ type: null, data: null });

  const {
    data: todasAsTurmas = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["turmas"],
    queryFn: buscarTodasAsTurmas, // Esta chamada agora buscará em /turmas/todas
  });

  const createMutation = useMutation({
    mutationFn: cadastrarTurma,
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Turma cadastrada." });
      queryClient.invalidateQueries({ queryKey: ["turmas"] });
      setModalState({ type: null, data: null });
    },
    onError: (err) =>
      toast({
        title: "Erro",
        description:
          err.response?.data?.message || "Não foi possível cadastrar.",
        variant: "destructive",
      }),
  });

  const updateMutation = useMutation({
    mutationFn: (turmaData) => atualizarTurma(modalState.data.id, turmaData),
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Turma atualizada." });
      queryClient.invalidateQueries({ queryKey: ["turmas"] });
      setModalState({ type: null, data: null });
    },
    onError: (err) =>
      toast({
        title: "Erro",
        description:
          err.response?.data?.message || "Não foi possível atualizar.",
        variant: "destructive",
      }),
  });

  const deactivateMutation = useMutation({
    mutationFn: desativarTurma,
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Turma desativada." });
      queryClient.invalidateQueries({ queryKey: ["turmas"] });
    },
    onError: (err) =>
      toast({
        title: "Erro",
        description:
          err.response?.data?.message || "Não foi possível desativar.",
        variant: "destructive",
      }),
  });

  const reactivateMutation = useMutation({
    mutationFn: reativarTurma,
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Turma reativada." });
      queryClient.invalidateQueries({ queryKey: ["turmas"] });
    },
    onError: (err) =>
      toast({
        title: "Erro",
        description:
          err.response?.data?.message || "Não foi possível reativar.",
        variant: "destructive",
      }),
  });

  // CORREÇÃO: Lógica de filtragem usando os estados individuais
  const turmasFiltradas = useMemo(() => {
    let turmasProcessadas = [...todasAsTurmas];
    if (statusFiltro === "ATIVAS") {
        turmasProcessadas = turmasProcessadas.filter((t) => t.ativa === true);
    } else if (statusFiltro === "INATIVAS") {
        turmasProcessadas = turmasProcessadas.filter((t) => t.ativa === false);
    }

    return turmasProcessadas.filter((turma) => {
        const nomeMatch = turma.nome?.toLowerCase().includes(nomeFiltro.toLowerCase());
        const turnoMatch = turnoFiltro ? turma.turno === turnoFiltro : true;
        const serieAnoMatch = turma.serieAno?.toLowerCase().includes(serieAnoFiltro.toLowerCase());
        const anoLetivoMatch = anoLetivoFiltro ? turma.anoLetivo?.toString().includes(anoLetivoFiltro) : true;
        return nomeMatch && turnoMatch && serieAnoMatch && anoLetivoMatch;
    });
  }, [todasAsTurmas, nomeFiltro, turnoFiltro, serieAnoFiltro, anoLetivoFiltro, statusFiltro]);

  const handleSave = useCallback((data) => {
    if (modalState.type === "edit") {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  }, [modalState.type, createMutation, updateMutation]);

  const renderContent = () => {
    if (isLoading) {
      return <TurmasSkeleton />;
    }
    if (isError && todasAsTurmas.length === 0) {
      return (
        <p className="text-red-600 text-center py-8">
          Erro ao carregar as turmas.
        </p>
      );
    }
    if (turmasFiltradas.length === 0) {
      return (
        <p className="text-center text-gray-500 py-8">
          Nenhuma turma encontrada com os filtros aplicados.
        </p>
      );
    }
    return turmasFiltradas.map((turma) => (
      <Card key={turma.id} className="p-4">
        <div className="flex justify-between items-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 flex-1 items-center">
            <div className="font-bold text-lg">{turma.nome}</div>
            <div><p className="text-sm text-gray-500">Série/Ano</p><p>{turma.serieAno}</p></div>
            <div><p className="text-sm text-gray-500">Turno</p><p>{turma.turno}</p></div>
            <div><p className="text-sm text-gray-500">Status</p><Badge variant={turma.ativa ? "default" : "destructive"}>{turma.ativa ? "Ativa" : "Inativa"}</Badge></div>
          </div>
          <div className="flex items-center gap-1 ml-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/secretaria/turmas/detalhes/${turma.id}`)}><Eye className="h-4 w-4 text-blue-600" /></Button>
            <Button variant="ghost" size="icon" onClick={() => setModalState({ type: "edit", data: turma })}><Edit className="h-4 w-4 text-yellow-600" /></Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  {turma.ativa ? (<Trash2 className="h-4 w-4 text-red-600" />) : (<RefreshCw className="h-4 w-4 text-green-600" />)}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Confirmar Ação</AlertDialogTitle></AlertDialogHeader>
                <AlertDialogDescription>Tem certeza que deseja {turma.ativa ? "DESATIVAR" : "REATIVAR"} a turma "{turma.nome}"?</AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => turma.ativa ? deactivateMutation.mutate(turma.id) : reactivateMutation.mutate(turma.id)}>Confirmar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </Card>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Turmas</h1>
          </div>
          <Dialog open={modalState.type === "create"} onOpenChange={(open) => !open && setModalState({ type: null, data: null })}>
            <DialogTrigger asChild>
              <Button className="text-white bg-blue-600 hover:bg-blue-700" onClick={() => setModalState({ type: "create", data: null })}>
                <Plus className="mr-2 h-4 w-4" /> Nova Turma
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Cadastrar Nova Turma</DialogTitle></DialogHeader>
              <TurmaForm onSubmit={handleSave} isSaving={createMutation.isPending} />
            </DialogContent>
          </Dialog>
        </div>
        <Card className="mb-6">
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Input placeholder="Nome da Turma" value={nomeFiltro} onChange={(e) => setNomeFiltro(e.target.value)} />
            <Input placeholder="Série/Ano" value={serieAnoFiltro} onChange={(e) => setSerieAnoFiltro(e.target.value)} />
            <Input placeholder="Ano Letivo" value={anoLetivoFiltro} onChange={(e) => setAnoLetivoFiltro(e.target.value)} />
            <Select value={turnoFiltro} onValueChange={(value) => setTurnoFiltro(value === 'ALL' ? '' : value)}>
              <SelectTrigger><SelectValue placeholder="Turno" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os Turnos</SelectItem>
                <SelectItem value="Manhã">Manhã</SelectItem>
                <SelectItem value="Tarde">Tarde</SelectItem>
                <SelectItem value="Noite">Noite</SelectItem>
                <SelectItem value="Integral">Integral</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFiltro} onValueChange={setStatusFiltro}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="TODAS">Todas</SelectItem>
                <SelectItem value="ATIVAS">Ativas</SelectItem>
                <SelectItem value="INATIVAS">Inativas</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <div className="space-y-4">{renderContent()}</div>
        <Dialog open={modalState.type === "edit"} onOpenChange={(open) => !open && setModalState({ type: null, data: null })}>
          <DialogContent>
            <DialogHeader><DialogTitle>Editar Turma</DialogTitle></DialogHeader>
            <TurmaForm onSubmit={handleSave} initialData={modalState.data} isSaving={updateMutation.isPending} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
