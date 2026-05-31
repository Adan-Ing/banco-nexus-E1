const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);
let db;

async function conectar() {
  await client.connect();
  db = client.db('banco_nexus');
  console.log('✅ Conectado a MongoDB');
}

// Consultar cuenta
app.get('/api/cuenta/:cuenta', async (req, res) => {
  const cuenta = await db.collection('cuentas').findOne({ cuenta: req.params.cuenta });
  if (!cuenta) return res.status(404).json({ error: 'Cuenta no encontrada' });
  const cliente = await db.collection('clientes').findOne({ curp: cuenta.cliente });
  const transacciones = await db.collection('transacciones').find({ cuenta: req.params.cuenta }).toArray();
  res.json({ cliente: cliente.nombre, saldo: cuenta.saldo, transacciones });
});

// Depositar
app.post('/api/deposito', async (req, res) => {
  const { cuenta, monto } = req.body;
  if (!cuenta || !monto || monto <= 0) return res.status(400).json({ error: 'Datos inválidos' });
  await db.collection('cuentas').updateOne({ cuenta }, { $inc: { saldo: monto } });
  await db.collection('transacciones').insertOne({ cuenta, tipo: 'deposito', monto, fecha: new Date() });
  const actualizada = await db.collection('cuentas').findOne({ cuenta });
  res.json({ mensaje: '✅ Depósito exitoso', saldo: actualizada.saldo });
});

// Retirar
app.post('/api/retiro', async (req, res) => {
  const { cuenta, monto } = req.body;
  if (!cuenta || !monto || monto <= 0) return res.status(400).json({ error: 'Datos inválidos' });
  const cuentaDoc = await db.collection('cuentas').findOne({ cuenta });
  if (!cuentaDoc) return res.status(404).json({ error: 'Cuenta no encontrada' });
  if (cuentaDoc.saldo < monto) return res.status(400).json({ error: 'Saldo insuficiente' });
  await db.collection('cuentas').updateOne({ cuenta }, { $inc: { saldo: -monto } });
  await db.collection('transacciones').insertOne({ cuenta, tipo: 'retiro', monto, fecha: new Date() });
  const actualizada = await db.collection('cuentas').findOne({ cuenta });
  res.json({ mensaje: '✅ Retiro exitoso', saldo: actualizada.saldo });
});

conectar().then(() => {
  app.listen(4000, () => console.log('🚀 Servidor corriendo en http://localhost:4000'));
});