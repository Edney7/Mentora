import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useToast } from "../../hooks/use-toast";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Checkbox } from "../../components/ui/checkbox";
import { ArrowLeft, UserPlus } from "lucide-react";
import {
  buscarTurmasAtivas,
  buscarDisciplinas,
  cadastrarUsuario,
} from "../../services/ApiService";

const formatarCPF = (value) => {
  const somenteNumeros = value.replace(/\D/g, "");
  const numerosLimitados = somenteNumeros.slice(0, 11);
  return numerosLimitados
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

// CORREÇÃO: Função ajustada para o formato dd-MM-yyyy
const formatarDataParaBackend = (dataYYYYMMDD) => {
  if (!dataYYYYMMDD) return null;
  const [ano, mes, dia] = dataYYYYMMDD.split("-");
  return `${dia}-${mes}-${ano}`;
};

export default function Cadastro() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      nome: "",
      cpf: "",
      email: "",
      senha: "",
      confirmarSenha: "",
      tipoUsuario: "",
      sexo: "",
      dtNascimento: "",
      turmaId: "",
      disciplinaIds: [],
    },
  });

  const tipoUsuario = form.watch("tipoUsuario");

  const { data: turmas = [], isLoading: isTurmasLoading } = useQuery({
    queryKey: ["turmasAtivas"],
    queryFn: buscarTurmasAtivas,
    enabled: tipoUsuario === "ALUNO",
  });

  const { data: disciplinas = [], isLoading: isDisciplinasLoading } = useQuery({
    queryKey: ["disciplinas"],
    queryFn: buscarDisciplinas,
    enabled: tipoUsuario === "PROFESSOR",
  });

  const cadastroMutation = useMutation({
    mutationFn: cadastrarUsuario,
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Usuário cadastrado com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      form.reset();
    },
    onError: (error) => {
      const errorMsg =
        error.response?.data?.message || "Erro ao cadastrar usuário.";
      toast({
        title: "Erro no cadastro",
        description: errorMsg,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data) {
    if (data.senha && data.senha !== data.confirmarSenha) {
      form.setError("confirmarSenha", {
        type: "manual",
        message: "As senhas não coincidem.",
      });
      return;
    }

    const { confirmarSenha, ...outrosDados } = data;

    const dataToSend = {
      ...outrosDados,
      dtNascimento: formatarDataParaBackend(outrosDados.dtNascimento),
    };

    cadastroMutation.mutate(dataToSend);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-2xl flex items-center gap-2">
              <UserPlus className="h-6 w-6 text-teal-600" />
              Cadastro de Novo Usuário
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do usuário" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="000.000.000-00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(formatarCPF(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email@exemplo.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dtNascimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="senha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Mínimo 6 caracteres"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmarSenha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Repita a senha"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sexo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sexo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o sexo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Masculino">Masculino</SelectItem>
                          <SelectItem value="Feminino">Feminino</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tipoUsuario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Usuário</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SECRETARIA">Secretaria</SelectItem>
                          <SelectItem value="PROFESSOR">Professor</SelectItem>
                          <SelectItem value="ALUNO">Aluno</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {tipoUsuario === "ALUNO" && (
                  <FormField
                    control={form.control}
                    name="turmaId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Turma</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  isTurmasLoading
                                    ? "Carregando turmas..."
                                    : "Selecione a turma"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {!isTurmasLoading &&
                              turmas.map((turma) => (
                                <SelectItem
                                  key={turma.id}
                                  value={turma.id.toString()}
                                >
                                  {turma.nome}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {tipoUsuario === "PROFESSOR" && (
                  <FormField
                    control={form.control}
                    name="disciplinaIds"
                    render={() => (
                      <FormItem>
                        <FormLabel>Disciplinas</FormLabel>
                        <div className="p-2 border rounded-md max-h-40 overflow-y-auto">
                          {isDisciplinasLoading ? (
                            <p className="text-sm text-gray-500">
                              Carregando...
                            </p>
                          ) : (
                            disciplinas.map((item) => (
                              <FormField
                                key={item.id}
                                control={form.control}
                                name="disciplinaIds"
                                render={({ field }) => (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          const currentValue =
                                            field.value || [];
                                          return checked
                                            ? field.onChange([
                                                ...currentValue,
                                                item.id,
                                              ])
                                            : field.onChange(
                                                currentValue.filter(
                                                  (value) => value !== item.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {item.nome}
                                    </FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={cadastroMutation.isPending}
                  className="w-full md:w-auto"
                >
                  {cadastroMutation.isPending
                    ? "Cadastrando..."
                    : "Cadastrar Usuário"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
