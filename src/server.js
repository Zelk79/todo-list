const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Habilitar CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Index
app.use(express.static(path.join(__dirname, '../public')));

// Datos
let tasks = [
    {
        id: 1,
        title: "Revisar inventario",
        description: "Verificar el stock de productos en el almacén principal.",
        completed: false
    },
    {
        id: 2,
        title: "Planificar ruta de envío",
        description: "Optimizar la ruta para la entrega de pedidos del día.",
        completed: false
    },
    {
        id: 3,
        title: "Coordinar con proveedores",
        description: "Contactar a proveedores para confirmar la llegada de nuevos suministros.",
        completed: false
    },
    {
        id: 4,
        title: "Actualizar sistema de seguimiento",
        description: "Ingresar los datos de los envíos realizados en el sistema de logística.",
        completed: false
    },
    {
        id: 5,
        title: "Revisar vehículos de transporte",
        description: "Realizar mantenimiento preventivo a los vehículos de la flota.",
        completed: false
    }
];

// Rutas API

app.get('/tasks', (req, res) => res.json(tasks));

app.post('/tasks', (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) return res.status(400).json({ message: "Faltan datos" });

    const newTask = { id: tasks.length + 1, title, description, completed: false };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return res.status(404).json({ message: "Tarea no encontrada" });

    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
    res.json(tasks[taskIndex]);
});

app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    tasks = tasks.filter(task => task.id !== taskId);
    res.status(204).send();
});

// Puerto
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
