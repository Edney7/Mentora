import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Componentes e Hooks
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
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
  Edit,
  Trash2,
  RefreshCw,
  MoreHorizontal,
} from "lucide-react";

// Funções da API
import {
  listarTodosOsUsuarios,
  desativarUsuario,
  reativarUsuario,
} from "../../services/ApiService";

function CardUsuarioSkeleton() {
  return Array(3)
    .fill(0)
    .map((_, i) => (
      <Card key={i} className="p-6 border-l-4">
        <div className="flex justify-between items-center">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 flex-1">
            {Array(7)
              .fill(0)
              .map((_, j) => (
                <div key={j} className="space-y-1">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-5 w-24" />
                </div>
              ))}
          </div>
          <div className="flex gap-2 ml-6">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </Card>
    ));
}

export default function ListaUsuarios() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    nome: "",
    tipoUsuario: "",
    sexo: "",
    status: "ATIVO",
  });

  const {
    data: usuarios = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["usuarios"],
    queryFn: listarTodosOsUsuarios,
  });

  const invalidateAndToast = (message) => {
    toast({ title: "Sucesso!", description: message });
    queryClient.invalidateQueries({ queryKey: ["usuarios"] });
  };

  const deactivateMutation = useMutation({
    mutationFn: desativarUsuario,
    onError: (err) =>
      toast({
        title: "Erro",
        description:
          err.response?.data?.message || "Não foi possível desativar.",
        variant: "destructive",
      }),
  });

  const reactivateMutation = useMutation({
    mutationFn: reativarUsuario,
    onError: (err) =>
      toast({
        title: "Erro",
        description:
          err.response?.data?.message || "Não foi possível reativar.",
        variant: "destructive",
      }),
  });

  const handleDeactivate = (usuario) => {
    deactivateMutation.mutate(usuario.id, {
      onSuccess: () =>
        invalidateAndToast(`Usuário "${usuario.nome}" desativado.`),
    });
  };

  const handleReactivate = (usuario) => {
    reactivateMutation.mutate(usuario.id, {
      onSuccess: () =>
        invalidateAndToast(`Usuário "${usuario.nome}" reativado.`),
    });
  };

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      const statusMatch =
        filters.status === "ATIVO"
          ? u.ativo
          : filters.status === "INATIVO"
          ? !u.ativo
          : true;
      return (
        u.nome?.toLowerCase().includes(filters.nome.toLowerCase()) &&
        (filters.tipoUsuario ? u.tipoUsuario === filters.tipoUsuario : true) &&
        (filters.sexo ? u.sexo === filters.sexo : true) &&
        statusMatch
      );
    });
  }, [usuarios, filters]);

  const handleFilterChange = (key, value) => {
    const finalValue = value === "ALL" ? "" : value;
    setFilters((prev) => ({ ...prev, [key]: finalValue }));
  };

  const getTipoBorderColor = (tipo) => {
    switch (tipo) {
      case "PROFESSOR":
        return "border-l-blue-500";
      case "SECRETARIA":
        return "border-l-purple-500";
      case "ALUNO":
        return "border-l-orange-500";
      default:
        return "border-l-gray-500";
    }
  };

  const getTipoBadgeVariant = (tipo) => {
    switch (tipo?.toUpperCase()) {
      case "SECRETARIA":
        return "destructive";
      case "PROFESSOR":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-white hover:shadow-md transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gerenciamento de Usuários
              </h1>
            </div>
          </div>
          <Button
            onClick={() => navigate("/cadastro")}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" /> Novo Usuário
          </Button>
        </div>

        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Nome
                </label>
                <Input
                  placeholder="Buscar por nome..."
                  value={filters.nome}
                  onChange={(e) => handleFilterChange("nome", e.target.value)}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Tipo de Usuário
                </label>
                <Select
                  value={filters.tipoUsuario || "ALL"}
                  onValueChange={(v) => handleFilterChange("tipoUsuario", v)}
                >
                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos os tipos</SelectItem>
                    <SelectItem value="SECRETARIA">Secretaria</SelectItem>
                    <SelectItem value="ALUNO">Aluno</SelectItem>
                    <SelectItem value="PROFESSOR">Professor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Sexo
                </label>
                <Select
                  value={filters.sexo || "ALL"}
                  onValueChange={(v) => handleFilterChange("sexo", v)}
                >
                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Todos os sexos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos os sexos</SelectItem>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <Select
                  value={filters.status || "ALL"}
                  onValueChange={(v) => handleFilterChange("status", v)}
                >
                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos os status</SelectItem>
                    <SelectItem value="ATIVO">Apenas Ativos</SelectItem>
                    <SelectItem value="INATIVO">Apenas Inativos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {isError && (
          <p className="text-red-600 text-center">
            Erro ao carregar os usuários.
          </p>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <CardUsuarioSkeleton />
          ) : usuariosFiltrados.length > 0 ? (
            usuariosFiltrados.map((usuario) => (
              <Card
                key={usuario.id}
                className={`shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200 border-l-4 ${getTipoBorderColor(
                  usuario.tipoUsuario
                )}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 flex-1 items-center">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Nome
                        </label>
                        <p className="font-medium text-gray-900">
                          {usuario.nome}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          CPF
                        </label>
                        <p className="text-gray-700 font-mono text-sm">
                          {usuario.cpf}
                        </p>
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Email
                        </label>
                        <p className="text-gray-700 text-sm truncate">
                          {usuario.email}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Tipo
                        </label>
                        <Badge
                          variant={getTipoBadgeVariant(usuario.tipoUsuario)}
                        >
                          {usuario.tipoUsuario}
                        </Badge>
                      </div>
                      {/* LINHA CORRIGIDA */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Nascimento
                        </label>
                        <p className="text-gray-700 text-sm">
                          {usuario.dtNascimento}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Status
                        </label>
                        <Badge variant={usuario.ativo ? "default" : "outline"}>
                          {usuario.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(
                                  `/secretaria/editarUsuario/${usuario.id}`
                                )
                              }
                            >
                              <Edit className="mr-2 h-4 w-4 text-yellow-600" /> 
                              <p className="text-yellow-600">Editar</p>
                            </DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className={
                                  usuario.ativo
                                    ? "text-red-600"
                                    : "text-green-600"
                                }
                              >
                                {usuario.ativo ? (
                                  <>
                                    <Trash2 className="mr-2 h-4 w-4" />{" "}
                                    Desativar
                                  </>
                                ) : (
                                  <>
                                    <RefreshCw className="mr-2 h-4 w-4" />{" "}
                                    Reativar
                                  </>
                                )}
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Ação</AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogDescription>
                            Tem certeza que deseja{" "}
                            {usuario.ativo ? "DESATIVAR" : "REATIVAR"} o usuário
                            "{usuario.nome}"?
                          </AlertDialogDescription>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                usuario.ativo
                                  ? handleDeactivate(usuario)
                                  : handleReactivate(usuario)
                              }
                            >
                              Confirmar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum usuário encontrado
                </h3>
                <p className="text-gray-600">
                  Tente ajustar os filtros para encontrar o que procura.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
