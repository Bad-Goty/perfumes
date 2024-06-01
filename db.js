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

app.delete('/api/deleteUser/:email', (req, res) => {
  const email = req.params.email;
  pool.query('DELETE FROM usuarios WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      res.status(500).json({ error: 'Error en la base de datos' });
    } else {
      res.json({ message: 'Usuario eliminado correctamente' });
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



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
