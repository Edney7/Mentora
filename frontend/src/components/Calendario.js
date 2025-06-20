import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";

const Calendar = ({ eventos = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const hoje = new Date();
  const primeiroDiaDoMes = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const ultimoDiaDoMes = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  const primeiroDiaDaSemana = primeiroDiaDoMes.getDay();

  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const diasDaSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const navegarMes = (direcao) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + direcao, 1)
    );
  };

  const temEvento = (dia) => {
    const dataFormatada = `${currentDate.getFullYear()}-${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${dia.toString().padStart(2, "0")}`;
    return eventos.some((evento) => evento.date === dataFormatada);
  };

  const eHoje = (dia) => {
    return (
      hoje.getDate() === dia &&
      hoje.getMonth() === currentDate.getMonth() &&
      hoje.getFullYear() === currentDate.getFullYear()
    );
  };

  const renderizarDias = () => {
    const dias = [];

    for (let i = 0; i < primeiroDiaDaSemana; i++) {
      dias.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    for (let dia = 1; dia <= ultimoDiaDoMes.getDate(); dia++) {
      const isHoje = eHoje(dia);
      const hasEvento = temEvento(dia);

      dias.push(
        <div
          key={dia}
          className={`
            h-8 flex items-center justify-center text-sm cursor-pointer rounded-md transition-colors
            ${isHoje ? "bg-teal-600 text-white font-bold" : "hover:bg-gray-100"}
            ${
              hasEvento && !isHoje
                ? "bg-orange-100 text-orange-800 font-semibold"
                : ""
            }
          `}
        >
          {dia}
        </div>
      );
    }
    return dias;
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navegarMes(-1)}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center space-x-2">
          <CalendarIcon size={18} className="text-teal-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            {meses[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
        </div>

        <button
          onClick={() => navegarMes(1)}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {diasDaSemana.map((dia) => (
          <div
            key={dia}
            className="h-8 flex items-center justify-center text-xs font-medium text-gray-500"
          >
            {dia}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{renderizarDias()}</div>

      {eventos.length > 0 && (
        <div className="mt-4 text-xs text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-orange-200 rounded"></div>
              <span>Eventos</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-teal-600 rounded"></div>
              <span>Hoje</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
