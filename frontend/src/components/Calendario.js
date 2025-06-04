import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

function Calendario({ eventos}) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      margin: '20px auto',
      maxWidth: '900px'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>📅 Calendário de Eventos</h2>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={eventos}
        height="auto"
      />
      
    </div>
  );
}

export default Calendario;
