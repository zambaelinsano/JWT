const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

// Ruta para el registro
router.post('/register', async(req, res) => {
    // Captura todos los campos del formulario de registro, incluyendo 'usuario'
    const { nombre, segundo_nombre, apellido_paterno, apellido_materno, usuario, password } = req.body;

    // Validación básica de campos requeridos
    if (!nombre || !apellido_paterno || !apellido_materno || !usuario || !password) {
        return res.status(400).send('Todos los campos requeridos (nombre, apellidos, usuario, contraseña) deben ser proporcionados.');
    }

    try {
        // Primero, verifica si el usuario (username) ya existe para evitar duplicados
        db.query('SELECT usuario FROM usuarios WHERE usuario = ?', [usuario], async (err, result) => {
            if (err) {
                console.error('Error al verificar usuario existente:', err);
                return res.status(500).send('Error interno del servidor al verificar usuario.');
            }
            if (result.length > 0) {
                return res.status(409).send('El nombre de usuario ya está en uso. Por favor, elige otro.'); // 409 Conflict
            }

            // Hashear la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insertar el nuevo usuario en la base de datos
            const query = 'INSERT INTO usuarios (nombre, segundo_nombre, apellido_paterno, apellido_materno, usuario, password) VALUES (?, ?, ?, ?, ?, ?)';
            db.query(query, [nombre, segundo_nombre, apellido_paterno, apellido_materno, usuario, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Error al registrar al usuario:', err);
                    return res.status(500).send('Error al registrar usuario.');
                }
                console.log("Usuario registrado con el ID:", result.insertId);
                res.status(201).send('Usuario Registrado exitosamente'); // 201 Created
            });
        });
    } catch(error) {
        console.error('Error en el servidor al momento de registrar {register}:', error);
        res.status(500).send('Error interno del servidor.');
    }
});

// Ruta de login
router.post('/login', async (req, res) => {
    // Desestructurar 'usuario' y 'password' del req.body
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).send('Usuario y contraseña son requeridos.');
    }

    // Consultar la base de datos usando el campo 'usuario'
    db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], async(err, result) => {
        if (err) {
            console.error('Error en la consulta del login:', err);
            return res.status(500).send('Error en el servidor.');
        }

        // Cuando no se encontró el usuario
        if (result.length === 0) {
            console.warn('Usuario no encontrado:', usuario);
            return res.status(401).send('Credenciales inválidas (usuario o contraseña incorrectos).');
        }

        // Si existe el usuario
        const user = result[0];

        // Validar el password hasheado
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            console.warn("Contraseña incorrecta para usuario:", usuario);
            return res.status(401).send('Credenciales inválidas (usuario o contraseña incorrectos).');
        }

        // Si las credenciales son válidas, generar el token JWT
        const token = jwt.sign(
            { id: user.id, usuario: user.usuario }, // Incluir el 'usuario' en el payload del token
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('Token Generado para el usuario:', user.usuario);
        res.json({ token });
    });
});

module.exports = router;