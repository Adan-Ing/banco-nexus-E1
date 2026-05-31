const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);

async function crearBD() {
  try {
    await client.connect();
    const db = client.db('banco_nexus');

    const clientes = db.collection('clientes');
    const cuentas = db.collection('cuentas');
    const transacciones = db.collection('transacciones');

    // Limpiar colecciones anteriores
    await clientes.deleteMany({});
    await cuentas.deleteMany({});
    await transacciones.deleteMany({});

    // Insertar clientes
    await clientes.insertMany([
      { nombre: 'Ana Ruiz',       curp: 'RUAA900101MDFXXX01' },
      { nombre: 'Luis Pérez',     curp: 'PELU850203HDFXXX02' },
      { nombre: 'María Torres',   curp: 'TOM780512MDFXXX03' },
      { nombre: 'Carlos Gómez',   curp: 'GOMC920318HDFXXX04' },
      { nombre: 'Laura Sánchez',  curp: 'SALL951120MDFXXX05' },
      { nombre: 'Jorge Mendoza',  curp: 'MEJO880730HDFXXX06' },
      { nombre: 'Sofía Ramírez',  curp: 'RASO010214MDFXXX07' },
      { nombre: 'Diego Flores',   curp: 'FLOD990605HDFXXX08' },
      { nombre: 'Valeria Cruz',   curp: 'CRUV030822MDFXXX09' },
      { nombre: 'Andrés Morales', curp: 'MORA870415HDFXXX10' },
    ]);

    // Insertar cuentas
    await cuentas.insertMany([
      { cuenta: '001', cliente: 'RUAA900101MDFXXX01', saldo: 5000 },
      { cuenta: '002', cliente: 'PELU850203HDFXXX02', saldo: 8000 },
      { cuenta: '003', cliente: 'TOM780512MDFXXX03',  saldo: 3200 },
      { cuenta: '004', cliente: 'GOMC920318HDFXXX04', saldo: 12000 },
      { cuenta: '005', cliente: 'SALL951120MDFXXX05', saldo: 6500 },
      { cuenta: '006', cliente: 'MEJO880730HDFXXX06', saldo: 9100 },
      { cuenta: '007', cliente: 'RASO010214MDFXXX07', saldo: 2200 },
      { cuenta: '008', cliente: 'FLOD990605HDFXXX08', saldo: 4700 },
      { cuenta: '009', cliente: 'CRUV030822MDFXXX09', saldo: 7800 },
      { cuenta: '010', cliente: 'MORA870415HDFXXX10', saldo: 15000 },
    ]);

    // Insertar transacciones
    await transacciones.insertMany([
      { cuenta: '001', tipo: 'deposito',     monto: 1000, fecha: new Date('2026-01-10') },
      { cuenta: '001', tipo: 'retiro',       monto: 500,  fecha: new Date('2026-01-15') },
      { cuenta: '002', tipo: 'deposito',     monto: 3000, fecha: new Date('2026-01-12') },
      { cuenta: '003', tipo: 'retiro',       monto: 800,  fecha: new Date('2026-01-20') },
      { cuenta: '004', tipo: 'deposito',     monto: 5000, fecha: new Date('2026-02-01') },
      { cuenta: '005', tipo: 'transferencia',monto: 1500, fecha: new Date('2026-02-05') },
      { cuenta: '006', tipo: 'deposito',     monto: 2000, fecha: new Date('2026-02-10') },
      { cuenta: '007', tipo: 'retiro',       monto: 300,  fecha: new Date('2026-02-14') },
      { cuenta: '008', tipo: 'deposito',     monto: 700,  fecha: new Date('2026-03-01') },
      { cuenta: '009', tipo: 'transferencia',monto: 2500, fecha: new Date('2026-03-05') },
    ]);

    console.log('✅ Base de datos banco_nexus creada con éxito.');
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await client.close();
  }
}

crearBD();