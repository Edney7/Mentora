import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Componentes e Hooks
import DisciplinaForm from "../../components/DisciplinaForm";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog";
import { useToast } from "../../hooks/use-toast";

// Ícones
import { ArrowLeft, Plus, BookMarked, Edit, Trash2, Eye } from "lucide-react";

// Funções da API
import { buscarDisciplinas, excluirDisciplina, cadastrarDisciplina, atualizarDisciplina, listarProfessoresDaDisciplina } from "../../services/ApiService";

function DisciplinaSkeleton() {
    return Array(3).fill(0).map((_, i) => (
        <Card key={i}><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></CardContent></Card>
    ));
}

export default function Disciplina() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [nomeFiltro, setNomeFiltro] = useState("");
    const [modalAberto, setModalAberto] = useState({ type: null, data: null });

    const { data: disciplinas = [], isLoading, isError } = useQuery({
        queryKey: ['disciplinas'],
        queryFn: buscarDisciplinas
    });

    const { data: professoresDaDisciplina = [], isLoading: loadingDetails } = useQuery({
        queryKey: ['professoresDaDisciplina', modalAberto.data?.id],
        queryFn: () => listarProfessoresDaDisciplina(modalAberto.data.id),
        enabled: modalAberto.type === 'details' && !!modalAberto.data?.id,
    });

    const createMutation = useMutation({
        mutationFn: cadastrarDisciplina,
        onSuccess: () => {
            toast({ title: "Sucesso!", description: "Disciplina cadastrada." });
            queryClient.invalidateQueries({ queryKey: ['disciplinas'] });
            setModalAberto({ type: null, data: null });
        },
        onError: (err) => toast({ title: "Erro", description: err.response?.data?.message || "Não foi possível cadastrar.", variant: "destructive" })
    });

    const updateMutation = useMutation({
        mutationFn: (disciplinaData) => atualizarDisciplina(modalAberto.data.id, disciplinaData),
        onSuccess: () => {
            toast({ title: "Sucesso!", description: "Disciplina atualizada." });
            queryClient.invalidateQueries({ queryKey: ['disciplinas'] });
            setModalAberto({ type: null, data: null });
        },
        onError: (err) => toast({ title: "Erro", description: err.response?.data?.message || "Não foi possível atualizar.", variant: "destructive" })
    });

    const deleteMutation = useMutation({
        mutationFn: excluirDisciplina,
        onSuccess: (data, id) => {
            toast({ title: "Sucesso!", description: `Disciplina excluída.` });
            queryClient.invalidateQueries({ queryKey: ['disciplinas'] });
        },
        onError: (err) => toast({ title: "Erro", description: err.response?.data?.message || "Não foi possível excluir.", variant: "destructive" })
    });

    const disciplinasFiltradas = useMemo(() =>
        disciplinas.filter((d) => (d.nome?.toLowerCase() || "").includes(nomeFiltro.toLowerCase())),
        [disciplinas, nomeFiltro]
    );
    
    const handleSave = (data) => {
        if (modalAberto.type === 'edit') {
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
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></Button>
                        <h1 className="text-3xl font-bold text-gray-800">Gerenciar Disciplinas</h1>
                    </div>
                    {/* Botão de Criar agora usa DialogTrigger */}
                    <Dialog onOpenChange={(open) => !open && setModalAberto({type: null, data: null})}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setModalAberto({ type: 'create', data: null })}>
                                <Plus className="mr-2 h-4 w-4" /> Nova Disciplina
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Cadastrar Nova Disciplina</DialogTitle>
                            </DialogHeader>
                            <DisciplinaForm onSubmit={handleSave} isSaving={createMutation.isPending} />
                        </DialogContent>
                    </Dialog>
                </div>

                <Card className="mb-6">
                    <CardContent className="p-4">
                        <Input placeholder="Filtrar por Nome" value={nomeFiltro} onChange={(e) => setNomeFiltro(e.target.value)} />
                    </CardContent>
                </Card>

                {isError && <p className="text-red-600 text-center">Erro ao carregar as disciplinas.</p>}
                
                <div className="space-y-4">
                    {isLoading ? <DisciplinaSkeleton /> : 
                        disciplinasFiltradas.length > 0 ? (
                            disciplinasFiltradas.map((disciplina) => (
                                <Card key={disciplina.id} className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-teal-100 p-3 rounded-full"><BookMarked className="h-6 w-6 text-teal-600" /></div>
                                        <div>
                                            <h3 className="font-bold text-lg">{disciplina.nome}</h3>
                                            <p className="text-sm text-gray-600">{disciplina.descricao || "Sem descrição."}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => setModalAberto({ type: 'details', data: disciplina })}><Eye className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" onClick={() => setModalAberto({ type: 'edit', data: disciplina })}><Edit className="h-4 w-4" /></Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle></AlertDialogHeader>
                                                <AlertDialogDescription>Tem certeza que deseja excluir a disciplina "{disciplina.nome}"? Esta ação não pode ser desfeita.</AlertDialogDescription>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => deleteMutation.mutate(disciplina.id)}>Excluir</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-8">Nenhuma disciplina encontrada.</p>
                        )}
                </div>

                {/* Os modais de Edição e Detalhes agora são controlados pelo estado `modalAberto` */}
                <Dialog open={modalAberto.type === 'edit' || modalAberto.type === 'details'} onOpenChange={() => setModalAberto({type: null, data: null})}>
                    <DialogContent>
                        {modalAberto.type === 'edit' && (
                            <>
                                <DialogHeader><DialogTitle>Editar Disciplina: {modalAberto.data?.nome}</DialogTitle></DialogHeader>
                                <DisciplinaForm onSubmit={handleSave} initialData={modalAberto.data} isSaving={updateMutation.isPending} />
                            </>
                        )}
                        {modalAberto.type === 'details' && (
                            <>
                                <DialogHeader><DialogTitle>Detalhes de: {modalAberto.data?.nome}</DialogTitle></DialogHeader>
                                {loadingDetails ? <p>Carregando...</p> : (
                                    <div>
                                        <p className="mb-4"><strong>Descrição:</strong> {modalAberto.data?.descricao || "N/A"}</p>
                                        <h4 className="font-semibold mb-2">Professores:</h4>
                                        {professoresDaDisciplina.length > 0 ? (
                                            <ul className="list-disc list-inside">
                                                {professoresDaDisciplina.map(p => <li key={p.id}>{p.nomeUsuario}</li>)}
                                            </ul>
                                        ) : <p className="text-sm text-gray-500">Nenhum professor associado.</p>}
                                    </div>
                                )}
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}