// src/pages/Secretaria/EditarUsuario.js (Completo e Corrigido)

import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

// Componentes e Hooks
import { useToast } from "../../hooks/use-toast";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import { Skeleton } from "../../components/ui/skeleton";

// Ícones
import { ArrowLeft, Edit } from "lucide-react";

// Funções da API
import { buscarUsuarioPorIdIncluindoInativos, atualizarUsuario } from "../../services/ApiService";

function EditUserSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-3xl">
                <CardHeader>
                    <Skeleton className="h-8 w-64" />
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

const formatarDataParaInput = (dataDDMMYYYY) => {
    if (!dataDDMMYYYY || !dataDDMMYYYY.includes('/')) return '';
    const [dia, mes, ano] = dataDDMMYYYY.split('/');
    if (!dia || !mes || !ano) return '';
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
};

const formatarDataParaBackend = (dataYYYYMMDD) => {
    if (!dataYYYYMMDD) return null;
    const [ano, mes, dia] = dataYYYYMMDD.split('-');
    if (!dia || !mes || !ano) return dataYYYYMMDD;
    return `${dia}/${mes}/${ano}`;
};


export default function EditarUsuario() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // CORREÇÃO APLICADA AQUI
  const { data: usuario, isLoading, isError, error } = useQuery({
    queryKey: ['usuario', id],
    queryFn: () => buscarUsuarioPorIdIncluindoInativos(id), // Propriedade restaurada
  });

  const form = useForm();
  const { reset } = form;

  useEffect(() => {
    if (usuario) {
      reset({
        nome: usuario.nome || '',
        cpf: usuario.cpf || '',
        email: usuario.email || '',
        sexo: usuario.sexo || '',
        dtNascimento: formatarDataParaInput(usuario.dtNascimento),
        senha: '',
        confirmarSenha: '',
      });
    }
  }, [usuario, reset]);
  
  const updateMutation = useMutation({
    mutationFn: (formData) => atualizarUsuario(id, formData),
    onSuccess: () => {
        toast({ title: "Sucesso!", description: "Usuário atualizado com sucesso." });
        queryClient.invalidateQueries({ queryKey: ['usuarios'] });
        navigate('/secretaria/usuarios');
    },
    onError: (err) => toast({ title: "Erro", description: err.response?.data?.message || "Não foi possível atualizar.", variant: "destructive" })
  });

  function onSubmit(data) {
    if (data.senha && data.senha !== data.confirmarSenha) {
        form.setError("confirmarSenha", { type: "manual", message: "As senhas não coincidem." });
        return;
    }
    
    const dataToSend = { ...data };
    if (!dataToSend.senha) {
      delete dataToSend.senha;
    }
    delete dataToSend.confirmarSenha;
    
    dataToSend.dtNascimento = formatarDataParaBackend(dataToSend.dtNascimento);
    
    updateMutation.mutate(dataToSend);
  }
  
  if (isLoading) return <EditUserSkeleton />;
  if (isError) return <div className="p-6 text-red-600 text-center">Erro ao carregar dados do usuário: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></Button>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Edit className="h-6 w-6 text-teal-600" />
              Editar Usuário: {usuario.nome}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="nome" render={({ field }) => (
                    <FormItem><FormLabel>Nome Completo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="cpf" render={({ field }) => (
                    <FormItem><FormLabel>CPF (não pode ser alterado)</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="dtNascimento" render={({ field }) => (
                    <FormItem><FormLabel>Data de Nascimento</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="sexo" render={({ field }) => (
                    <FormItem><FormLabel>Sexo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione o sexo" /></SelectTrigger></FormControl>
                            <SelectContent><SelectItem value="Masculino">Masculino</SelectItem><SelectItem value="Feminino">Feminino</SelectItem></SelectContent>
                        </Select>
                    <FormMessage /></FormItem>
                )}/>
                <div className="md:col-span-2 space-y-2 pt-4 border-t">
                    <p className="text-sm text-gray-600">Deixe os campos de senha em branco para não alterá-la.</p>
                </div>
                <FormField control={form.control} name="senha" render={({ field }) => (
                    <FormItem><FormLabel>Nova Senha</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="confirmarSenha" render={({ field }) => (
                    <FormItem><FormLabel>Confirmar Nova Senha</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}