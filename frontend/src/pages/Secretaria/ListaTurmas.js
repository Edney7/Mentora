import React, { useState, useMemo } from "react";
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

  const [filters, setFilters] = useState({
    nome: "",
    turno: "",
    serieAno: "",
    anoLetivo: "",
    status: "ATIVAS",
  });
  const [modalState, setModalState] = useState({ type: null, data: null });

  const {
    data: todasAsTurmas = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["turmas"],
    queryFn: buscarTodasAsTurmas,
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

  const turmasFiltradas = useMemo(() => {
    let turmas = [...todasAsTurmas];
    if (filters.status === "ATIVAS") turmas = turmas.filter((t) => t.ativa);
    if (filters.status === "INATIVAS") turmas = turmas.filter((t) => !t.ativa);

    return turmas.filter(
      (t) =>
        t.nome?.toLowerCase().includes(filters.nome.toLowerCase()) &&
        (filters.turno ? t.turno === filters.turno : true) &&
        t.serieAno?.toLowerCase().includes(filters.serieAno.toLowerCase()) &&
        (filters.anoLetivo
          ? t.anoLetivo?.toString().includes(filters.anoLetivo)
          : true)
    );
  }, [todasAsTurmas, filters]);

  const handleFilterChange = (key, value) => {
    const finalValue = value === "ALL" ? "" : value;
    setFilters((prev) => ({ ...prev, [key]: finalValue }));
  };

  const handleSave = (data) => {
    if (modalState.type === "edit") {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">
              Gerenciamento de Turmas
            </h1>
          </div>
          <Dialog
            open={modalState.type === "create"}
            onOpenChange={(open) =>
              !open && setModalState({ type: null, data: null })
            }
          >
            <DialogTrigger asChild>
              <Button
                onClick={() => setModalState({ type: "create", data: null })}
              >
                <Plus className="mr-2 h-4 w-4" /> Nova Turma
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Nova Turma</DialogTitle>
              </DialogHeader>
              <TurmaForm
                onSubmit={handleSave}
                isSaving={createMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Input
              placeholder="Nome da Turma"
              value={filters.nome}
              onChange={(e) => handleFilterChange("nome", e.target.value)}
            />
            <Input
              placeholder="Série/Ano"
              value={filters.serieAno}
              onChange={(e) => handleFilterChange("serieAno", e.target.value)}
            />
            <Input
              placeholder="Ano Letivo"
              value={filters.anoLetivo}
              onChange={(e) => handleFilterChange("anoLetivo", e.target.value)}
            />
            <Select
              value={filters.turno || "ALL"}
              onValueChange={(v) => handleFilterChange("turno", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Turno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="Manhã">Manhã</SelectItem>
                <SelectItem value="Tarde">Tarde</SelectItem>
                <SelectItem value="Noite">Noite</SelectItem>
                <SelectItem value="Integral">Integral</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.status || "ALL"}
              onValueChange={(v) => handleFilterChange("status", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas</SelectItem>
                <SelectItem value="ATIVAS">Ativas</SelectItem>
                <SelectItem value="INATIVAS">Inativas</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {isError && (
          <p className="text-red-600 text-center">
            Erro ao carregar as turmas.
          </p>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <TurmasSkeleton />
          ) : turmasFiltradas.length > 0 ? (
            turmasFiltradas.map((turma) => (
              <Card key={turma.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 flex-1 items-center">
                    <div className="font-bold text-lg">{turma.nome}</div>
                    <div>
                      <p className="text-sm text-gray-500">Série/Ano</p>
                      <p>{turma.serieAno}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Turno</p>
                      <p>{turma.turno}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <Badge variant={turma.ativa ? "default" : "destructive"}>
                        {turma.ativa ? "Ativa" : "Inativa"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        navigate(`/secretaria/turmas/detalhes/${turma.id}`)
                      }
                    >
                      <Eye className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setModalState({ type: "edit", data: turma })
                      }
                    >
                      <Edit className="h-4 w-4 text-yellow-600" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          {turma.ativa ? (
                            <Trash2 className="h-4 w-4 text-red-600" />
                          ) : (
                            <RefreshCw className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Ação</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogDescription>
                          Tem certeza que deseja{" "}
                          {turma.ativa ? "DESATIVAR" : "REATIVAR"} a turma "
                          {turma.nome}"?
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              turma.ativa
                                ? deactivateMutation.mutate(turma.id)
                                : reactivateMutation.mutate(turma.id)
                            }
                          >
                            Confirmar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">
              Nenhuma turma encontrada.
            </p>
          )}
        </div>

        <Dialog
          open={modalState.type === "edit"}
          onOpenChange={(open) =>
            !open && setModalState({ type: null, data: null })
          }
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Turma</DialogTitle>
            </DialogHeader>
            <TurmaForm
              onSubmit={handleSave}
              initialData={modalState.data}
              isSaving={updateMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
