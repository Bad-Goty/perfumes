const mysql = require('mysql2');
const cors = require('cors');
const express = require('express');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'perfumes.cvo6gu6yqpak.us-east-2.rds.amazonaws.com',
  user: 'admin',          // Reemplaza con tu usuario
  password: '56122171',   // Reemplaza con tu contraseña
  database: 'perfumeria', // Reemplaza con tu base de datos
  port: 3306,
  ssl: {
    rejectUnauthorized: false, // Habilitar SSL si es necesario
  }
});

app.get('/api/getData', (req, res) => {
  pool.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      res.status(500).json({ error: 'Error en la base de datos' });
    } else {
      res.json(results);
    }
  });
});

app.put('/api/updateRole', (req, res) => {
  const { email, newRole } = req.body;
  pool.query('UPDATE usuarios SET admin = ? WHERE email = ?', [newRole, email], (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      res.status(500).json({ error: 'Error en la base de datos' });
    } else {
      res.json({ message: 'Rol actualizado correctamente' });
    }
  });
});

app.delete('/api/deleteUser/:email', (req, res) => {
  const email = req.params.email;
  // Verificar si el usuario existe
  pool.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      res.status(500).json({ error: 'Error en la base de datos' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      // Eliminar el usuario
      pool.query('DELETE FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) {
          console.error('Error ejecutando la consulta:', err);
          res.status(500).json({ error: 'Error en la base de datos' });
        } else {
          res.json({ message: 'Usuario eliminado correctamente' });
        }
      });
    }
  });
});



app.get('/api/getPerfumes', (req, res) => {
  pool.query('SELECT * FROM perfumes', (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      res.status(500).json({ error: 'Error en la base de datos' });
    } else {
      res.json(results);
    }
  });
});

app.put('/api/updatePerfume/:id', (req, res) => {
  const id = req.params.id;
  const { nombre, diseñador, tamaño, precio, fecha_lanzamiento, genero, conjunto, descuento, imagen } = req.body;
  pool.query(
    'UPDATE perfumes SET nombre = ?, diseñador = ?, tamaño = ?, precio = ?, fecha_lanzamiento = ?, genero = ?, conjunto = ?, descuento = ?, imagen = ? WHERE ID = ?',
    [nombre, diseñador, tamaño, precio, fecha_lanzamiento, genero, conjunto, descuento, imagen, id],
    (err, results) => {
      if (err) {
        console.error('Error ejecutando la consulta:', err);
        res.status(500).json({ error: 'Error en la base de datos' });
      } else {
        res.json({ message: 'Perfume actualizado correctamente' });
      }
    }
  );
});


app.delete('/api/deletePerfume/:id', (req, res) => {
  const id = req.params.id;
  pool.query('DELETE FROM perfumes WHERE ID = ?', [id], (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      res.status(500).json({ error: 'Error en la base de datos' });
    } else {
      res.json({ message: 'Perfume eliminado correctamente' });
    }
  });
});

app.post('/api/addPerfume', (req, res) => {
  const { ID, nombre, diseñador, tamaño, precio, fecha_lanzamiento, genero, conjunto, descuento, imagen } = req.body;
  pool.query(
    'INSERT INTO perfumes (ID, nombre, diseñador, tamaño, precio, fecha_lanzamiento, genero, conjunto, descuento, imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [ID, nombre, diseñador, tamaño, precio, fecha_lanzamiento, genero, conjunto, descuento, imagen],
    (err, results) => {
      if (err) {
        console.error('Error ejecutando la consulta:', err);
        res.status(500).json({ error: 'Error en la base de datos' });
      } else {
        res.json({ message: 'Perfume agregado correctamente' });
      }
    }
  );
});

app.get('/api/getOrders', (req, res) => {
  pool.query('SELECT * FROM ordenes', (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      res.status(500).json({ error: 'Error en la base de datos' });
    } else {
      res.json(results);
    }
  });
});

app.get('/api/getOrderDetails/:orden_id', (req, res) => {
  const ordenId = req.params.orden_id;
  pool.query('SELECT * FROM detalle_ordenes WHERE orden_id = ?', [ordenId], (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      res.status(500).json({ error: 'Error en la base de datos' });
    } else {
      res.json(results);
    }
  });
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
