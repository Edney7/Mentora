import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";

// Componentes e Hooks
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { Skeleton } from "../../components/ui/skeleton";
import { useToast } from "../../hooks/use-toast";

// Ícones
import {
  ArrowLeft,
  BookOpen,
  Users,
  CalendarCheck,
  ClipboardEdit,
} from "lucide-react";

// Funções da API (e import do 'api' default)
import api, {
  listarAlunosDaTurma,
  listarDisciplinasDoProfessor,
  listarNotasDoAlunoPorDisciplina,
  criarOuObterAula,
  sincronizarFaltasPorAula,
} from "../../services/ApiService";

// Sub-componente para o Painel de Notas
const NotasPanel = ({ aluno, disciplinas, professorId, turmaId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const notasQuery = useQuery({
    queryKey: ["notas", aluno.id],
    queryFn: async () => {
      const todasAsNotas = {};
      if (disciplinas && disciplinas.length > 0) {
        for (const disc of disciplinas) {
          const notasDaDisciplina = await listarNotasDoAlunoPorDisciplina(
            aluno.id,
            disc.id
          );
          notasDaDisciplina.forEach((nota) => {
            if (!todasAsNotas[disc.id]) todasAsNotas[disc.id] = {};
            todasAsNotas[disc.id][nota.bimestre] = nota;
          });
        }
      }
      return todasAsNotas;
    },
    enabled: !!aluno && !!disciplinas?.length,
  });

  const form = useForm();
  const { reset, watch, register } = form;

  useEffect(() => {
    if (notasQuery.data) {
      reset(notasQuery.data);
    }
  }, [notasQuery.data, reset]);

  const notaMutation = useMutation({
    mutationFn: async (data) => {
      const url = data.id ? `/notas/${data.id}` : "/notas";
      const method = data.id ? "put" : "post";
      return api[method](url, data).then((res) => res.data);
    },
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Nota salva com sucesso." });
      queryClient.invalidateQueries({ queryKey: ["notas", aluno.id] });
    },
    onError: (err) =>
      toast({
        title: "Erro",
        description:
          err.response?.data?.message || "Não foi possível salvar a nota.",
        variant: "destructive",
      }),
  });

  const handleSalvarNota = (disciplinaId, bimestre) => {
    const notasDoForm = form.getValues(`${disciplinaId}.${bimestre}`);
    const prova1 = parseFloat(notasDoForm.prova1);
    const prova2 = parseFloat(notasDoForm.prova2);

    if (isNaN(prova1) || isNaN(prova2)) {
      toast({
        title: "Erro de Validação",
        description: "As notas devem ser números.",
        variant: "destructive",
      });
      return;
    }

    const notaDTO = {
      id: notasDoForm.id || null,
      alunoId: aluno.id,
      disciplinaId,
      professorId: parseInt(professorId),
      bimestre,
      prova1,
      prova2,
      media: (prova1 + prova2) / 2,
    };
    notaMutation.mutate(notaDTO);
  };

  return (
    <CardContent className="pt-6">
      {notasQuery.isLoading ? (
        <p>Carregando notas...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Disciplina</TableHead>
              <TableHead>Bimestre</TableHead>
              <TableHead>Prova 1</TableHead>
              <TableHead>Prova 2</TableHead>
              <TableHead>Média</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {disciplinas.map((disciplina) =>
              [1, 2, 3, 4].map((bimestre) => (
                <TableRow key={`${disciplina.id}-${bimestre}`}>
                  <TableCell>{disciplina.nome}</TableCell>
                  <TableCell>{bimestre}º</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.1"
                      {...register(`${disciplina.id}.${bimestre}.prova1`)}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.1"
                      {...register(`${disciplina.id}.${bimestre}.prova2`)}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    {((parseFloat(
                      watch(`${disciplina.id}.${bimestre}.prova1`)
                    ) || 0) +
                      (parseFloat(
                        watch(`${disciplina.id}.${bimestre}.prova2`)
                      ) || 0)) /
                      2 || 0}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => handleSalvarNota(disciplina.id, bimestre)}
                      disabled={notaMutation.isPending}
                    >
                      Salvar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </CardContent>
  );
};

// Sub-componente para o Painel de Faltas
const FaltasPanel = ({ alunos, disciplinas, professorId, turmaId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      disciplinaId: "",
      dataAula: "",
      topico: "",
      alunos: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "alunos",
  });

  useEffect(() => {
    if (alunos && alunos.length > 0) {
      replace(
        alunos.map((aluno) => ({
          alunoId: aluno.id,
          nome: aluno.nomeUsuario,
          presente: true,
          justificativa: "",
        }))
      );
    }
  }, [alunos, replace]);

  const aulaMutation = useMutation({
    mutationFn: criarOuObterAula,
    onSuccess: (aulaResponse) => {
      const faltas = form
        .getValues("alunos")
        .filter((a) => !a.presente)
        .map((a) => ({
          alunoId: a.alunoId,
          justificada: false,
          descricaoJustificativa: null,
        }));
      sincronizarFaltasMutation.mutate({
        aulaId: aulaResponse.id,
        faltas,
        professorId: parseInt(professorId),
      });
    },
    onError: (err) =>
      toast({
        title: "Erro na Aula",
        description:
          err.response?.data?.message || "Não foi possível criar a aula.",
        variant: "destructive",
      }),
  });

  const sincronizarFaltasMutation = useMutation({
    mutationFn: (data) =>
      sincronizarFaltasPorAula(data.aulaId, data.faltas, data.professorId),
    onSuccess: () =>
      toast({
        title: "Sucesso!",
        description: "Aula e faltas registradas com sucesso.",
      }),
    onError: (err) =>
      toast({
        title: "Erro nas Faltas",
        description:
          err.response?.data?.message ||
          "Não foi possível registrar as faltas.",
        variant: "destructive",
      }),
  });

  function onSubmit(data) {
    if (!data.disciplinaId || !data.dataAula || !data.topico) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha disciplina, data e tópico da aula.",
        variant: "destructive",
      });
      return;
    }

    const aulaDTO = {
      disciplinaId: parseInt(data.disciplinaId),
      professorId: parseInt(professorId),
      turmaId: parseInt(turmaId),
      dataAula: data.dataAula,
      topico: data.topico,
    };
    aulaMutation.mutate(aulaDTO);
  }

  return (
    <CardContent className="pt-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Aula</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              <FormField
                control={form.control}
                name="disciplinaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disciplina</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {disciplinas.map((d) => (
                          <SelectItem key={d.id} value={d.id.toString()}>
                            {d.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dataAula"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="topico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tópico da Aula</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Verbos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Presença</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead className="text-right">Presente</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>{field.nome}</TableCell>
                      <TableCell className="text-right">
                        <FormField
                          control={form.control}
                          name={`alunos.${index}.presente`}
                          render={({ field: switchField }) => (
                            <FormControl>
                              <Switch
                                checked={switchField.value}
                                onCheckedChange={switchField.onChange}
                              />
                            </FormControl>
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={
                aulaMutation.isPending || sincronizarFaltasMutation.isPending
              }
            >
              {aulaMutation.isPending
                ? "Criando aula..."
                : sincronizarFaltasMutation.isPending
                ? "Registrando faltas..."
                : "Salvar Aula e Faltas"}
            </Button>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

// Componente Principal da Página
export default function TurmaDetalhe() {
  const { id: turmaId } = useParams();
  const navigate = useNavigate();
  const professorId = localStorage.getItem("idProfessor");
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);

  const alunosQuery = useQuery({
    queryKey: ["alunosDaTurma", turmaId],
    queryFn: () => listarAlunosDaTurma(turmaId),
    enabled: !!turmaId,
  });

  const disciplinasQuery = useQuery({
    queryKey: ["disciplinasDoProfessor", professorId],
    queryFn: () => listarDisciplinasDoProfessor(professorId),
    enabled: !!professorId,
  });

  const isLoading = alunosQuery.isLoading || disciplinasQuery.isLoading;

  // Quando os dados dos alunos carregarem, selecione o primeiro aluno automaticamente
  useEffect(() => {
    if (alunosQuery.data && alunosQuery.data.length > 0 && !alunoSelecionado) {
      setAlunoSelecionado(alunosQuery.data[0]);
    }
  }, [alunosQuery.data, alunoSelecionado]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Detalhes da Turma
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="text-teal-600" /> Alunos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isLoading
                ? Array(5)
                    .fill(0)
                    .map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
                : alunosQuery.data?.map((aluno) => (
                    // AQUI ESTÁ A MUDANÇA: trocamos 'secondary' por 'default' para um destaque maior
                    <Button
                      key={aluno.id}
                      variant={
                        alunoSelecionado?.id === aluno.id ? "default" : "ghost"
                      }
                      className="w-full justify-start"
                      onClick={() => setAlunoSelecionado(aluno)}
                    >
                      {aluno.nomeUsuario}
                    </Button>
                  ))}
            </CardContent>
          </Card>

          <div className="lg:col-span-3">
            {isLoading ? (
              <Card className="flex items-center justify-center h-full min-h-[400px]">
                <p>Carregando dados...</p>
              </Card>
            ) : alunoSelecionado && disciplinasQuery.data ? (
              <Tabs defaultValue="notas" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="notas">
                    <ClipboardEdit className="mr-2 h-4 w-4" /> Lançar Notas
                  </TabsTrigger>
                  <TabsTrigger value="faltas">
                    <CalendarCheck className="mr-2 h-4 w-4" /> Registrar Faltas
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="notas">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Notas de {alunoSelecionado.nomeUsuario}
                      </CardTitle>
                    </CardHeader>
                    <NotasPanel
                      aluno={alunoSelecionado}
                      disciplinas={disciplinasQuery.data || []}
                      professorId={professorId}
                      turmaId={turmaId}
                    />
                  </Card>
                </TabsContent>
                <TabsContent value="faltas">
                  <Card>
                    <CardHeader>
                      <CardTitle>Registro de Presença</CardTitle>
                    </CardHeader>
                    <FaltasPanel
                      alunos={alunosQuery.data || []}
                      disciplinas={disciplinasQuery.data || []}
                      professorId={professorId}
                      turmaId={turmaId}
                    />
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[400px]">
                <p className="text-gray-500">
                  Selecione um aluno para ver os detalhes.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
