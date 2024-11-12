const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');

let valoresCenturion = {};

// Configuración de CORS y JSON
app.use(cors());
app.use(express.json());

// Crear un pool de conexiones
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Centurion24.', // Asegúrate de que esta sea la contraseña correcta
    database: 'BD_CENTURION_PRUEBAS',
});

// Convertimos el pool a promesas para usar async/await
const promisePool = pool.promise();

// Ruta POST para la autenticación de sesión
app.post('/sesion', async (req, res) => {
    var { usuario, password } = req.body;
    console.log('Datos recibidos:', { usuario, password });

    try {
        var [rows] = await promisePool.query('SELECT USUARIOS.EMAIL, ROLES.ROL, CIUDADES.NAME_CITY, PROYECTOS.NAME_PROY FROM USUARIOS LEFT OUTER JOIN ROLES ON (ROLES.ID = USUARIOS.ID) LEFT OUTER JOIN USUARIOS_REL_PROYECTOS ON (USUARIOS_REL_PROYECTOS.ID_USER = USUARIOS.ID) LEFT OUTER JOIN PROYECTOS ON (PROYECTOS.ID = USUARIOS_REL_PROYECTOS.ID_PROY) LEFT OUTER JOIN CIUDADES ON (CIUDADES.ID = PROYECTOS.ID_CITY) WHERE EMAIL = ? ',
            [usuario]
        );

        if (rows.length > 0) {
            console.log('Datos enviados:', rows);
            res.status(200).json(rows);
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

app.post('/Centurion', async (req, res) => {
    var { Email, Rol, Proyecto } = req.body;
    console.log('Datos recibidos:', { Email, Rol, Proyecto });

    try {
        if (Rol === 'CenturionAdmi') {
            Rol = 'Administrador';
        } else if (Rol === 'CenturionOper')
            Rol = 'Operador';
        else Rol = 'Visit';

        var [rows] = await promisePool.query('SELECT USUARIOS.EMAIL, ROLES.ROL, CIUDADES.NAME_CITY, PROYECTOS.NAME_PROY FROM USUARIOS LEFT OUTER JOIN ROLES ON(ROLES.ID = USUARIOS.ID) LEFT OUTER JOIN USUARIOS_REL_PROYECTOS ON(USUARIOS_REL_PROYECTOS.ID_USER = USUARIOS.ID) LEFT OUTER JOIN PROYECTOS ON(PROYECTOS.ID = USUARIOS_REL_PROYECTOS.ID_PROY) LEFT OUTER JOIN CIUDADES ON(CIUDADES.ID = PROYECTOS.ID_CITY) WHERE USUARIOS.EMAIL = ? ',
            [Email]
        );
        console.log('Datos BD: ', rows);

        if (rows.length > 0) {
            valoresCenturion = rows;
            res.status(200).json(rows);
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

app.post('/RecibeCenturion', async (req, res) => {
    console.log('Recibiendo los datos de Centurion: ', valoresCenturion);

    res.status(200).json(valoresCenturion);
});

// Iniciar el servidor Express
app.listen(3010, () => {
    console.log('Corriendo express en el puerto 3010');
});