// pages/Secretaria/AusenciaProfessor.js (Versão Final Corrigida)

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// Nossos novos componentes e hooks
import { useToast } from "../../hooks/use-toast";
import { listarTodasAusenciasProfessor } from "../../services/ApiService";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Skeleton } from "../../components/ui/skeleton";
import { ArrowLeft, User, CalendarDays } from "lucide-react";

// Função auxiliar para converter datas
const parseDate = (dataString) => {
  if (!dataString) return null;
  let data;
  if (dataString.includes('/')) {
    const partes = dataString.split(' ')[0].split('/');
    if (partes.length === 3) {
      const [dia, mes, ano] = partes;
      data = new Date(ano, mes - 1, dia);
    }
  } else {
    data = new Date(dataString);
  }
  return !isNaN(data.getTime()) ? data : null;
};

function TabelaDeAusenciasSkeleton() {
  return Array(4).fill(0).map((_, i) => (
    <TableRow key={i}>
      <TableCell><Skeleton className="h-4 w-full" /></TableCell>
      <TableCell><Skeleton className="h-4 w-full" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
    </TableRow>
  ));
}

export default function AusenciaProfessor() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // 1. Estados de filtro unificados em um único objeto
  const [filters, setFilters] = useState({ nome: "", mesAusencia: "", mesRegistro: "" });

  const { data: todasAsAusencias = [], isLoading, isError } = useQuery({
    queryKey: ['ausencias'],
    queryFn: listarTodasAusenciasProfessor,
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao carregar a lista de ausências.",
        variant: "destructive",
      });
    }
  });

  const ausenciasFiltradas = useMemo(() => {
    let ausenciasTemp = [...todasAsAusencias];

    if (filters.nome) {
      ausenciasTemp = ausenciasTemp.filter(a => a.nomeProfessor?.toLowerCase().includes(filters.nome.toLowerCase()));
    }
    if (filters.mesAusencia) {
      const mesNum = parseInt(filters.mesAusencia, 10);
      ausenciasTemp = ausenciasTemp.filter(a => {
        const data = parseDate(a.dataAusencia);
        return data && data.getMonth() + 1 === mesNum;
      });
    }
    if (filters.mesRegistro) {
      const mesNum = parseInt(filters.mesRegistro, 10);
      ausenciasTemp = ausenciasTemp.filter(a => {
        const data = parseDate(a.dataRegistro);
        return data && data.getMonth() + 1 === mesNum;
      });
    }
    return ausenciasTemp;
  }, [filters, todasAsAusencias]);
  
  // 2. Handler unificado para todos os filtros
  const handleFilterChange = (key, value) => {
    const finalValue = value === "ALL" ? "" : value;
    setFilters(prev => ({ ...prev, [key]: finalValue }));
  };
  
  const mesesDoAno = [...Array(12).keys()].map(i => ({
    value: (i + 1).toString(),
    label: new Date(2000, i).toLocaleString('pt-BR', { month: 'long' })
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Ausências de Professores</h1>
        </div>

        <Card className="mb-6 bg-white">
          <CardHeader><CardTitle>Filtros</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Nome do professor"
                value={filters.nome}
                onChange={(e) => handleFilterChange('nome', e.target.value)}
              />
              {/* 3. SELECTS CORRIGIDOS */}
              <Select value={filters.mesAusencia || "ALL"} onValueChange={(v) => handleFilterChange('mesAusencia', v)}>
                <SelectTrigger><SelectValue placeholder="Mês da Ausência" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos os meses</SelectItem>
                  {mesesDoAno.map(mes => <SelectItem key={mes.value} value={mes.value}>{mes.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filters.mesRegistro || "ALL"} onValueChange={(v) => handleFilterChange('mesRegistro', v)}>
                <SelectTrigger><SelectValue placeholder="Mês do Registro" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos os meses</SelectItem>
                  {mesesDoAno.map(mes => <SelectItem key={mes.value} value={mes.value}>{mes.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-6 w-6 " />
              Lista de Ausências Registradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Professor</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Data da Ausência</TableHead>
                  <TableHead>Data do Registro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? <TabelaDeAusenciasSkeleton /> : isError ? (
                  <TableRow><TableCell colSpan={4} className="text-center text-red-600 py-8">Ocorreu um erro ao carregar as ausências.</TableCell></TableRow>
                ) : ausenciasFiltradas.length > 0 ? (
                  ausenciasFiltradas.map((ausencia) => (
                    <TableRow key={ausencia.id}>
                      <TableCell className="font-medium flex items-center gap-2"><User className="h-4 w-4 text-gray-400" />{ausencia.nomeProfessor}</TableCell>
                      <TableCell>{ausencia.motivo}</TableCell>
                      <TableCell>{ausencia.dataAusencia || "-"}</TableCell>
                      <TableCell>{ausencia.dataRegistro || "-"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={4} className="text-center text-gray-500 py-8">Nenhuma ausência encontrada.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}