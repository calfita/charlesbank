# 🏦 Charles Bank

Aplicación bancaria fullstack construida con React, Node.js, MongoDB y Docker. Simula funcionalidades clave de un home banking moderno, tanto para usuarios finales como para administradores.

---

## 🧰 Tecnologías utilizadas

### 📦 Backend (`/homebanking-backend`)
- Node.js + Express
- MongoDB Atlas
- Mongoose ODM
- JSON Web Tokens (JWT)
- Dotenv para manejo de variables
- Arquitectura modular con controladores y rutas

### 💻 Frontend (`/frontend`)
- React + Vite
- Context API para auth
- Componentes reutilizables
- Fetch centralizado con headers dinámicos
- Nginx para servir en producción

### 🐳 Orquestación
- Docker & Docker Compose
- Variables de entorno por `build args`
- Nginx como reverse proxy para el frontend

---

## ✅ Casos de uso implementados

- Registro e inicio de sesión con validación JWT
- Dashboard de cuentas bancarias
- Transferencias entre cuentas propias y a terceros
- Panel administrativo para gestionar movimientos y solicitudes
- Edición de perfil del usuario
- Visual feedback en acciones (modales, loaders, confirmaciones)

---

## 🚀 Instrucciones de uso

### 🔧 Clonar el proyecto

```bash
git clone https://github.com/TU_USUARIO/charlesbank.git
cd charlesbank
