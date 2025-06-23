// src/components/DisciplinaForm.jsx

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
// ... (resto do código)

export default function DisciplinaForm({ onSubmit, initialData, isSaving }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || { nome: "", descricao: "" },
  });

  useEffect(() => {
    reset(initialData || { nome: "", descricao: "" });
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="nome">Nome da Disciplina</Label>
        <Input
          id="nome"
          {...register("nome", { required: "O nome é obrigatório." })}
        />
        {errors.nome && (
          <p className="text-sm text-red-600 mt-1">{errors.nome.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          placeholder="Opcional"
          {...register("descricao")}
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button className="text-white bg-blue-600 hover:bg-blue-700" type="submit" disabled={isSaving}>
          {isSaving ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
