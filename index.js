const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');

// Configuración de CORS y JSON
app.use(cors());
app.use(express.json());

// Crear un pool de conexiones
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root', // Asegúrate de que esta sea la contraseña correcta
    database: 'BD_CENTURION_PRUEBAS',
});

// Convertimos el pool a promesas para usar async/await
const promisePool = pool.promise();

// Ruta POST para la autenticación de sesión
app.post('/sesion', async (req, res) => {
    const { user, password } = req.body;
    console.log('Datos recibidos:', { user, password });

    try {
        const [rows] = await promisePool.query(
            'SELECT * FROM USUARIOS WHERE EMAIL = ? AND PASSWORD = ""',
            [user]
        );

        if (rows.length > 0) {
            // res.redirect(/perfil?usuario=${user}&autenticado=true);
        } else {
            res.status(401).send('Usuario o contraseña incorrectos');
        }
    } catch (err) {
        console.error('Error en la consulta:', err);  // Aquí se imprime el error en la consola
        res.status(500).send({
            error: 'Error en el servidor',
            details: err.message || 'Sin detalles del error'  // Agregar detalles del error
        });
    }
});


// Iniciar el servidor Express
app.listen(3001, () => {
    console.log('Corriendo express en el puerto 3001');
});