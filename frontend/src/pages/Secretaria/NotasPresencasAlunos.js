// pages/Secretaria/NotasPresencasAlunos.js

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// Componentes e Hooks
import { useToast } from "../../hooks/use-toast";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { ArrowLeft, GraduationCap, CalendarX } from "lucide-react";

// Funções da API
import { listarTodasNotas, listarTodasFaltas } from "../../services/ApiService";

// Componente para o estado de carregamento
function TabelaDadosSkeleton() {
  return Array(4).fill(0).map((_, i) => (
    <TableRow key={i}>
      <TableCell><Skeleton className="h-4 w-full" /></TableCell>
      <TableCell><Skeleton className="h-4 w-full" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
    </TableRow>
  ));
}

export default function NotasPresencasAlunos() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [filters, setFilters] = useState({ aluno: '', disciplina: '' });

  // 1. BUSCA DE DADOS COM REACT QUERY
  const notasQuery = useQuery({
    queryKey: ['todasNotas'],
    queryFn: listarTodasNotas,
    onError: () => toast({ title: "Erro", description: "Falha ao carregar notas.", variant: "destructive" }),
  });

  const faltasQuery = useQuery({
    queryKey: ['todasFaltas'],
    queryFn: listarTodasFaltas,
    onError: () => toast({ title: "Erro", description: "Falha ao carregar faltas.", variant: "destructive" }),
  });

  // 2. FILTRAGEM OTIMIZADA COM useMemo
  const notasFiltradas = useMemo(() => {
    if (!notasQuery.data) return [];
    return notasQuery.data.filter(nota =>
      nota.nomeAluno?.toLowerCase().includes(filters.aluno.toLowerCase()) &&
      nota.nomeDisciplina?.toLowerCase().includes(filters.disciplina.toLowerCase())
    );
  }, [notasQuery.data, filters]);

  const faltasFiltradas = useMemo(() => {
    if (!faltasQuery.data) return [];
    return faltasQuery.data.filter(falta =>
      falta.nomeAluno?.toLowerCase().includes(filters.aluno.toLowerCase()) &&
      falta.nomeDisciplina?.toLowerCase().includes(filters.disciplina.toLowerCase())
    );
  }, [faltasQuery.data, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getNotaVariant = (nota) => {
    if (nota >= 7) return 'default'; // Verde (padrão)
    if (nota >= 5) return 'secondary'; // Amarelo/Cinza (secundário)
    return 'destructive'; // Vermelho
  };
  
  const isLoading = notasQuery.isLoading || faltasQuery.isLoading;
  const isError = notasQuery.isError || faltasQuery.isError;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Notas e Presenças dos Alunos</h1>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Filtrar por nome do aluno..."
              value={filters.aluno}
              onChange={(e) => handleFilterChange('aluno', e.target.value)}
            />
            <Input
              placeholder="Filtrar por disciplina..."
              value={filters.disciplina}
              onChange={(e) => handleFilterChange('disciplina', e.target.value)}
            />
          </CardContent>
        </Card>

        {isError && !isLoading && (
            <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4 text-center text-red-700">
                    Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.
                </CardContent>
            </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Seção de Notas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-teal-600" /> Notas Lançadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Nota</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TabelaDadosSkeleton /> : notasFiltradas.length > 0 ? (
                    notasFiltradas.map((nota) => (
                      <TableRow key={`nota-${nota.id}`}>
                        <TableCell className="font-medium">{nota.nomeAluno}</TableCell>
                        <TableCell>{nota.nomeDisciplina}</TableCell>
                        <TableCell><Badge variant={getNotaVariant(nota.media)}>{nota.media}</Badge></TableCell>
                      </TableRow>
                    ))
                  ) : <TableRow><TableCell colSpan={3} className="text-center h-24">Nenhuma nota encontrada.</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Seção de Faltas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarX className="h-6 w-6 text-red-600" /> Faltas Registradas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Justificada</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TabelaDadosSkeleton /> : faltasFiltradas.length > 0 ? (
                    faltasFiltradas.map((falta) => (
                      <TableRow key={`falta-${falta.id}`}>
                        <TableCell className="font-medium">{falta.nomeAluno}</TableCell>
                        <TableCell>{falta.nomeDisciplina}</TableCell>
                        <TableCell>{falta.dataFalta || "-"}</TableCell>
                        <TableCell><Badge variant={falta.justificada ? "default" : "destructive"}>{falta.justificada ? "Sim" : "Não"}</Badge></TableCell>
                      </TableRow>
                    ))
                  ) : <TableRow><TableCell colSpan={4} className="text-center h-24">Nenhuma falta encontrada.</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}