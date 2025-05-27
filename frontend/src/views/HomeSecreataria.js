import React from "react";
import "../styles/Home.css";

const HomeSecretaria = () => {
  return (
    <div className="container">
      <div className="leftSide">
        <div className="headerCard">
          <div className="userIcon"></div>
          <h2>Gerenciar Usuarios</h2>
        </div>

        <div className="btnGroup">
          <button className="btn tealBtn">Gerenciar Turmas</button>
          <button className="btn tealBtn">Gerenciar Disciplinas</button>
        </div>
      </div>

      <div className="rightSide">
        <div className="whiteBox"></div>

        <div className="eventToday">
          <span>Evento Hoje</span>
          <span>07:00 | 7:45</span>
        </div>

        <div className="absenceProf">
          <span>Ausência professor</span>
          <span>XX/XX</span>
        </div>

        <div className="nextHoliday">
          <span>Proximo Feriado</span>
          <span>XX/XX</span>
        </div>
      </div>
    </div>
  );
};

export default HomeSecretaria;
