import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

// Componentes e Hooks
import Calendar from "../../components/Calendario";
import { useToast } from "../../hooks/use-toast";
import { Button } from "../../components/ui/button";
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
  DialogClose,
  DialogFooter, // IMPORT ADICIONADO AQUI
} from "../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Skeleton } from "../../components/ui/skeleton";

// Ícones
import {
  CalendarDays,
  CalendarX,
  Check,
  ClipboardList,
  Plus,
  Users,
} from "lucide-react";

// Funções da API
import {
  listarTurmasDoProfessor,
  listarEventos,
  registarAusenciaProfessor,
} from "../../services/ApiService";

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="lg:col-span-1 space-y-4">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}

// Função para formatar a data para o formato que o backend espera (dd-MM-yyyy)
const formatarDataParaBackend = (dataYYYYMMDD) => {
  if (!dataYYYYMMDD) return null;
  const [ano, mes, dia] = dataYYYYMMDD.split("-");
  return `${dia}-${mes}-${ano}`;
};

export default function HomeProfessor() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const idProfessor = localStorage.getItem("idProfessor");

  const { data: turmas = [], isLoading: isTurmasLoading } = useQuery({
    queryKey: ["turmasDoProfessor", idProfessor],
    queryFn: () => listarTurmasDoProfessor(idProfessor),
    enabled: !!idProfessor, // A query só roda se o idProfessor existir
  });

  const { data: eventos = [], isLoading: isEventosLoading } = useQuery({
    queryKey: ["eventos"],
    queryFn: listarEventos,
    select: (data) =>
      data.map((ev) => ({ title: ev.titulo, date: ev.data, ...ev })),
  });

  const form = useForm({
    defaultValues: {
      dataAusencia: "",
      motivo: "",
    },
  });

  const ausenciaMutation = useMutation({
    mutationFn: registarAusenciaProfessor,
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Sua ausência foi registrada." });
      queryClient.invalidateQueries({ queryKey: ["ausenciasProfessor"] }); // Invalida outras queries se necessário
      form.reset();
      // Idealmente, fecharíamos o modal programaticamente aqui, mas o DialogTrigger cuida disso.
    },
    onError: (err) =>
      toast({
        title: "Erro",
        description:
          err.response?.data?.message ||
          "Não foi possível registrar a ausência.",
        variant: "destructive",
      }),
  });

  function onAusenciaSubmit(data) {
    if (!data.motivo || !data.dataAusencia) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos!",
        variant: "destructive",
      });
      return;
    }

    const ausenciaData = {
      motivo: data.motivo,
      dataAusencia: formatarDataParaBackend(data.dataAusencia), // Formato correto
      professorId: parseInt(idProfessor),
    };

    ausenciaMutation.mutate(ausenciaData);
  }

  const isLoading = isTurmasLoading || isEventosLoading;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard do Professor
          </h1>
          <p className="text-gray-600">
            Acesse suas turmas e registre suas ausências.
          </p>
        </div>

        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList /> Minhas Turmas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {turmas.length > 0 ? (
                    turmas.map((turma) => (
                      <div
                        key={turma.id}
                        className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => navigate(`/turmaDetalhe/${turma.id}`)}
                      >
                        <div>
                          <p className="font-bold text-lg text-teal-700">
                            {turma.nome}
                          </p>
                          <p className="text-sm text-gray-600">
                            {turma.serieAno} - Turno {turma.turno}
                          </p>
                        </div>
                        <Users className="text-gray-400" />
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      Nenhuma turma associada a você.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays /> Calendário
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar eventos={eventos} />
                </CardContent>
              </Card>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-auto p-4 flex flex-col items-start"
                  >
                    <div className="flex items-center gap-2 font-semibold text-lg">
                      <CalendarX className="text-red-500" /> Registrar Ausência
                    </div>
                    <p className="font-normal text-sm text-gray-500 text-left">
                      Informe a secretaria sobre uma ausência planejada.
                    </p>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar Ausência Planejada</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onAusenciaSubmit)}
                      className="space-y-4 pt-4"
                    >
                      <FormField
                        control={form.control}
                        name="dataAusencia"
                        rules={{ required: "A data é obrigatória." }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data da Ausência</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="motivo"
                        rules={{ required: "O motivo é obrigatório." }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Motivo (Ex: Consulta Médica)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Descreva brevemente o motivo..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter className="pt-2">
                        <DialogClose asChild>
                          <Button type="button" variant="ghost">
                            Cancelar
                          </Button>
                        </DialogClose>
                        <Button
                          type="submit"
                          disabled={ausenciaMutation.isPending}
                        >
                          {ausenciaMutation.isPending
                            ? "Enviando..."
                            : "Enviar Registro"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
