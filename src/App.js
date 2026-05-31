import { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

function App() {
  const [cuenta, setCuenta] = useState('');
  const [datos, setDatos] = useState(null);
  const [monto, setMonto] = useState('');
  const [mensaje, setMensaje] = useState('');

  const consultar = async () => {
    setMensaje('');
    const res = await fetch(`http://localhost:4000/api/cuenta/${cuenta}`);
    const data = await res.json();
    setDatos(data);
  };

  const depositar = async () => {
    const res = await fetch('http://localhost:4000/api/deposito', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cuenta, monto: Number(monto) })
    });
    const data = await res.json();
    setMensaje(data.mensaje || data.error);
    consultar();
  };

  const retirar = async () => {
    const res = await fetch('http://localhost:4000/api/retiro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cuenta, monto: Number(monto) })
    });
    const data = await res.json();
    setMensaje(data.mensaje || data.error);
    consultar();
  };

  const graficaDatos = datos?.transacciones.map((t, i) => ({
    fecha: new Date(t.fecha).toLocaleDateString(),
    monto: t.monto
  }));

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial', maxWidth: '800px', margin: 'auto' }}>
      <h1>🏦 Banco Nexus</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          placeholder="Número de cuenta (ej: 001)"
          value={cuenta}
          onChange={e => setCuenta(e.target.value)}
          style={{ padding: '8px', marginRight: '10px', width: '250px' }}
        />
        <button onClick={consultar} style={{ padding: '8px 16px', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Consultar
        </button>
      </div>

      {datos && (
        <div>
          <div style={{ backgroundColor: '#f0f4ff', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h2>👤 {datos.cliente}</h2>
            <h3>💰 Saldo: ${datos.saldo.toLocaleString()}</h3>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              placeholder="Monto"
              value={monto}
              onChange={e => setMonto(e.target.value)}
              type="number"
              style={{ padding: '8px', marginRight: '10px', width: '150px' }}
            />
            <button onClick={depositar} style={{ padding: '8px 16px', backgroundColor: '#34a853', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
              Depositar
            </button>
            <button onClick={retirar} style={{ padding: '8px 16px', backgroundColor: '#ea4335', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Retirar
            </button>
          </div>

          {mensaje && <p style={{ color: mensaje.includes('❌') ? 'red' : 'green' }}>{mensaje}</p>}

          <h3>📋 Transacciones</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#1a73e8', color: 'white' }}>
                <th style={{ padding: '10px' }}>Tipo</th>
                <th style={{ padding: '10px' }}>Monto</th>
                <th style={{ padding: '10px' }}>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {datos.transacciones.map((t, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#f9f9f9' : 'white' }}>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{t.tipo}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>${t.monto.toLocaleString()}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{new Date(t.fecha).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>📈 Historial de Montos</h3>
          <LineChart width={600} height={250} data={graficaDatos}>
            <Line type="monotone" dataKey="monto" stroke="#1a73e8" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </div>
      )}
    </div>
  );
}

export default App;