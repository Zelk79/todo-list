document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');

    // Función para cargar y mostrar las tareas
    async function loadTasks() {
        const response = await fetch('http://localhost:3000/tasks');
        const tasks = await response.json();
        taskList.innerHTML = ''; // Limpiar la tabla antes de cargar las tareas

        tasks.forEach(task => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${task.title}</td>
                <td>${task.description}</td>
                <td>
                    <span class="badge ${task.completed ? 'text-bg-success' : 'text-bg-danger'}">
                        ${task.completed ? 'Completada' : 'Pendiente'}
                    </span>
                </td>
                <td>
                    <div class="btn-group" role="group" aria-label="Task actions">
                        <button 
                            class="btn btn-sm ${task.completed ? 'btn-warning' : 'btn-success'}" 
                            onclick="toggleTaskCompletion(${task.id}, ${!task.completed})">
                            <i class="bi ${task.completed ? 'bi-x-circle' : 'bi-check-circle'} me-1"></i>
                            ${task.completed ? 'Incompleto' : 'Completar'}
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">
                            <i class="bi bi-trash me-1"></i>
                            Eliminar
                        </button>
                    </div>
                </td>

            `;
            taskList.appendChild(row);
        });        
        
    }

    // Función para agregar una nueva tarea
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;

        const response = await fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description })
        });

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: '¡Tarea agregada!',
                text: 'La tarea se ha agregado correctamente.',
            });
            loadTasks(); // Recargar la lista de tareas
            taskForm.reset(); // Limpiar el formulario
            bootstrap.Modal.getInstance(document.getElementById('taskModal')).hide(); // Cerrar el modal
        }
    });

    // Función para estado de las tareas
    window.toggleTaskCompletion = async (id, completed) => {
        const response = await fetch(`http://localhost:3000/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed })
        });

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: '¡Tarea actualizada!',
                text: 'El estado de la tarea se ha actualizado correctamente.',
            });
            loadTasks(); // Recargar la lista de tareas
        }
    };

    // Función para eliminar una tarea
    window.deleteTask = async (id) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: '¿Eliminar tarea?',
            text: '¿Estás seguro de que quieres eliminar esta tarea?',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            const response = await fetch(`http://localhost:3000/tasks/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Tarea eliminada!',
                    text: 'La tarea se ha eliminado correctamente.',
                });
                loadTasks();
            }
        }
    };

    loadTasks();
});