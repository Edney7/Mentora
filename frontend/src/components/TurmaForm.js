// src/components/TurmaForm.jsx (Versão Robusta)

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";

const defaultFormValues = {
  nome: "",
  turno: "",
  serieAno: "",
  anoLetivo: new Date().getFullYear(),
};

export default function TurmaForm({ onSubmit, initialData, isSaving }) {
  // AQUI ESTÁ A CORREÇÃO PRINCIPAL
  // Usamos `initialData || defaultFormValues` para garantir que `useForm`
  // nunca receba `null` ou `undefined`, mesmo durante a renderização de fechamento.
  const form = useForm({
    defaultValues: initialData || defaultFormValues,
  });

  const { reset } = form;

  // O useEffect também é protegido com o mesmo fallback.
  useEffect(() => {
    reset(initialData || defaultFormValues);
  }, [initialData, reset]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Turma</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 3º Ano B" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="serieAno"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Série/Ano</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 3º Ano" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="turno"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Turno</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Manhã">Manhã</SelectItem>
                    <SelectItem value="Tarde">Tarde</SelectItem>
                    <SelectItem value="Noite">Noite</SelectItem>
                    <SelectItem value="Integral">Integral</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="anoLetivo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ano Letivo</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Ex: 2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar Turma"}
          </Button>
        </div>
      </form>
    </Form>
  );
}