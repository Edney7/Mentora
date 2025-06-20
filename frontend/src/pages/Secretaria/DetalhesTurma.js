// // pages/Secretaria/DetalhesTurma.js (Completo e Refatorado)

// import React, { useState, useMemo } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// // Componentes e Hooks
// import { Button } from "../../components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
// import { Skeleton } from "../../components/ui/skeleton";
// import { useToast } from "../../hooks/use-toast";
// import { ArrowLeft, Plus, Users, BookOpen } from "lucide-react";

// // Funções da API
// import { buscarTurmaDetalhada, buscarDisciplinas, listarProfessoresDaDisciplina, vincularDisciplinaEProfessorNaTurma, listarDisciplinaTurma } from "../../services/ApiService";

// function DetalhesSkeleton() {
//     return (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <Card><CardHeader><Skeleton className="h-6 w-24" /></CardHeader><CardContent><Skeleton className="h-20 w-full" /></CardContent></Card>
//             <Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent><Skeleton className="h-20 w-full" /></CardContent></Card>
//         </div>
//     );
// }

// export default function DetalhesTurma() {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const { toast } = useToast();
//     const queryClient = useQueryClient();

//     // -- QUERIES: Buscando todos os dados necessários para a página --
//     const { data: turma, isLoading: isTurmaLoading } = useQuery({
//         queryKey: ['turmaDetalhada', id],
//         queryFn: () => buscarTurmaDetalhada(id)
//     });

//     const { data: todasDisciplinas = [] } = useQuery({
//         queryKey: ['disciplinas'],
//         queryFn: buscarDisciplinas
//     });

//     const { data: ofertas = [], isLoading: isOfertasLoading } = useQuery({
//         queryKey: ['ofertas', id],
//         queryFn: () => listarDisciplinaTurma(id)
//     });

//     // -- ESTADO E LÓGICA DO MODAL --
//     const [modalAberto, setModalAberto] = useState(false);
//     const [disciplinaSelecionada, setDisciplinaSelecionada] = useState("");
//     const [professorSelecionado, setProfessorSelecionado] = useState("");

//     const { data: professoresDaDisciplina = [], isLoading: isLoadingProfessores } = useQuery({
//         queryKey: ['professoresDaDisciplina', disciplinaSelecionada],
//         queryFn: () => listarProfessoresDaDisciplina(disciplinaSelecionada),
//         enabled: !!disciplinaSelecionada, // Query só é executada se uma disciplina for selecionada
//     });
    
//     // -- MUTAÇÃO PARA VINCULAR DISCIPLINA --
//     const vincularMutation = useMutation({
//         mutationFn: (data) => vincularDisciplinaEProfessorNaTurma(data.turmaId, data.disciplinaId, data.professorId),
//         onSuccess: () => {
//             toast({ title: "Sucesso!", description: "Disciplina vinculada à turma." });
//             queryClient.invalidateQueries({ queryKey: ['ofertas', id] });
//             setModalAberto(false);
//             resetModalState();
//         },
//         onError: (err) => toast({ title: "Erro", description: err.response?.data?.message || "Não foi possível vincular.", variant: "destructive" })
//     });

//     const handleVincular = () => {
//         if (!disciplinaSelecionada || !professorSelecionado) {
//             toast({ title: "Atenção", description: "Selecione uma disciplina e um professor.", variant: "destructive" });
//             return;
//         }
//         vincularMutation.mutate({ turmaId: id, disciplinaId: disciplinaSelecionada, professorId: professorSelecionado });
//     };

//     const resetModalState = () => {
//         setDisciplinaSelecionada("");
//         setProfessorSelecionado("");
//     };
    
//     const isLoading = isTurmaLoading;
//     if (isLoading) return <div className="p-6"><DetalhesSkeleton /></div>;
//     if (!turma) return <div className="p-6 text-center">Turma não encontrada.</div>;

//     return (
//         <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//             <div className="max-w-7xl mx-auto">
//                 <div className="mb-6 flex items-center gap-4">
//                     <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></Button>
//                     <div>
//                         <h1 className="text-3xl font-bold text-gray-800">Detalhes da Turma</h1>
//                         <p className="text-lg text-teal-600 font-semibold">{turma.nome}</p>
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                     {/* Painel de Alunos */}
//                     <Card className="lg:col-span-1">
//                         <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-teal-600" /> Alunos Matriculados</CardTitle></CardHeader>
//                         <CardContent>
//                             {turma.alunos && turma.alunos.length > 0 ? (
//                                 <ul className="space-y-2">
//                                     {turma.alunos.map(aluno => <li key={aluno.id} className="p-2 rounded-md bg-gray-100">{aluno.nomeUsuario}</li>)}
//                                 </ul>
//                             ) : <p className="text-sm text-gray-500 text-center py-4">Nenhum aluno nesta turma.</p>}
//                         </CardContent>
//                     </Card>

//                     {/* Painel de Disciplinas */}
//                     <Card className="lg:col-span-2">
//                         <CardHeader className="flex flex-row items-center justify-between">
//                             <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-teal-600" /> Disciplinas e Professores</CardTitle>
//                             <Dialog open={modalAberto} onOpenChange={setModalAberto}>
//                                 <DialogTrigger asChild><Button size="sm"><Plus className="mr-2 h-4 w-4" /> Adicionar</Button></DialogTrigger>
//                                 <DialogContent>
//                                     <DialogHeader><DialogTitle>Adicionar Disciplina à Turma</DialogTitle></DialogHeader>
//                                     <div className="space-y-4 py-4">
//                                         <div className="space-y-2">
//                                             <label className="text-sm font-medium">1. Selecione a Disciplina</label>
//                                             <Select value={disciplinaSelecionada} onValueChange={setDisciplinaSelecionada}><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent>{todasDisciplinas.map(d => <SelectItem key={d.id} value={d.id.toString()}>{d.nome}</SelectItem>)}</SelectContent></Select>
//                                         </div>
//                                         {disciplinaSelecionada && (
//                                             <div className="space-y-2">
//                                                 <label className="text-sm font-medium">2. Selecione o Professor</label>
//                                                 <Select value={professorSelecionado} onValueChange={setProfessorSelecionado} disabled={isLoadingProfessores}>
//                                                     <SelectTrigger><SelectValue placeholder={isLoadingProfessores ? "Carregando..." : "Selecione..."} /></SelectTrigger>
//                                                     <SelectContent>
//                                                         {professoresDaDisciplina.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.nomeUsuario}</SelectItem>)}
//                                                         {!isLoadingProfessores && professoresDaDisciplina.length === 0 && (<SelectItem value="none" disabled>Nenhum professor disponível</SelectItem>)}
//                                                     </SelectContent>
//                                                 </Select>
//                                             </div>
//                                         )}
//                                     </div>
//                                     <div className="flex justify-end">
//                                         <Button onClick={handleVincular} disabled={!professorSelecionado || vincularMutation.isPending}>{vincularMutation.isPending ? "Adicionando..." : "Adicionar"}</Button>
//                                     </div>
//                                 </DialogContent>
//                             </Dialog>
//                         </CardHeader>
//                         <CardContent>
//                             <Table>
//                                 <TableHeader><TableRow><TableHead>Disciplina</TableHead><TableHead>Professor</TableHead></TableRow></TableHeader>
//                                 <TableBody>
//                                     {isOfertasLoading ? (
//                                         <TableRow><TableCell colSpan={2}><Skeleton className="h-10 w-full" /></TableCell></TableRow>
//                                     ) : ofertas.length > 0 ? (
//                                         ofertas.map(oferta => (
//                                             <TableRow key={oferta.id}>
//                                                 <TableCell className="font-medium">{oferta.nomeDisciplina}</TableCell>
//                                                 <TableCell>{oferta.nomeProfessor || "Não definido"}</TableCell>
//                                             </TableRow>
//                                         ))
//                                     ) : <TableRow><TableCell colSpan={2} className="text-center h-24">Nenhuma disciplina vinculada.</TableCell></TableRow>}
//                                 </TableBody>
//                             </Table>
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>
//         </div>
//     );
// }