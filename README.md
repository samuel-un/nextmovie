
<p align="center">
<img src="https://res.cloudinary.com/dgbngcvkl/image/upload/v1747036873/NextMovie_logo_letras_y_icono_axjmma.png" alt="NextMovie Logo">
</p>

<h1>🎬 NextMovie - Your Movie & Series Manager Platform 🍿</h1>

NextMovie is a **full-stack web application platform** that allows users to manage their favorite movies and TV shows, including functionalities such as user management, personalized lists, and recommendations.

This repository contains both the **Laravel-based backend** and the **React-based frontend**, designed to be robust, scalable, and user-friendly.

---

<h1>📌 Features</h1>

- 👤 **User management (CRUD)** for creating, updating, and deleting user profiles.
- 🔒 **JWT Authentication** for secure user login and registration.
- 📝 **Custom lists** for favorite movies and series.
- ⭐ **Rating and Recommendations system** (Planned).
- 🎥 **API Consumption** of TMDb (The Movie Database) for movie and series data.
- 🗄 **Database migrations and seeders** for easy setup and testing.
- 🛠 **Built with Laravel & React**, using routes, controllers, models, API resources, and modern React components.

---

<h1>⚙️ Technologies Used</h1>

- **Backend**:
  - Laravel (PHP)
  - MySQL
  - JWT (JSON Web Tokens)
  - Postman (for API testing)

- **Frontend**:
  - React (Vite)
  - JavaScript (ES6+)
  - CSS Modules
  - Axios (API requests)
  - React Router

---

<h1>🛠 Backend Installation</h1>

```bash
# Clone the repository
git clone https://github.com/samuel-un/nextmovie.git

# Enter the backend directory
cd nextmovie-backend

# Install dependencies
composer install

# Configure the .env file with your database information
cp .env.example .env

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=backend-nextmovie
DB_USERNAME=root
DB_PASSWORD=

# Generate a new application key
php artisan key:generate

# Run migrations and seeders
php artisan migrate --seed

# Start the server
php artisan serve
```

---

<h1>💻 Frontend</h1>

The frontend for **NextMovie** is a fully responsive React application that connects seamlessly to the backend API. It provides users with an intuitive and visually appealing interface to manage their favorite movies and TV shows.

**Key features:**
- User registration and login with real-time validation and password security checks
- JWT authentication integrated with the backend
- Custom movie and series lists for each user
- Responsive design for both desktop and mobile (based on Figma design)
- Error and success messages for all user actions
- Movie list component connected to the API
- Navigation between login and registration using React Router

**Technologies:**
- React (Vite)
- JavaScript (ES6+)
- CSS Modules
- Axios (for API requests)
- React Router

**Repository:**  
The frontend code is available in the [`frontend-nextmovie`](./frontend-nextmovie) folder of this repository.

---

<h1>🚀 Frontend Installation</h1>

```bash
# Enter the frontend directory
cd frontend-nextmovie

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173) by default.

---

<h1>🖼️ Frontend Screenshots</h1>

**User Registration:**  
![User Registration](https://res.cloudinary.com/dgbngcvkl/image/upload/v1747050135/register_irv5jd.png)

**User Login:**  
![User Login](https://res.cloudinary.com/dgbngcvkl/image/upload/v1747050135/login_k4r4fg.png)

---

> **Note:**  
> The frontend requires the backend API to be running and accessible at the configured URL (default: `http://localhost:8000`).

---

<h1>🧪 API Tests (Postman)</h1>

This project includes a fully functional user CRUD API.
Here are the Postman tests for each CRUD operation:

### 1. Create User (POST `/api/users`)

- **Request JSON:**

```json
{
"name": "Samuel",
"email": "Samuel@email.com",
"password": "123456"
}
```

- **Expected response:** Status **201** and created user data.

![Create user](https://res.cloudinary.com/dgbngcvkl/image/upload/v1747036150/Crear_usuario_joxmtr.png)

---

### 2. List all Users (GET `/api/users`)

- **Expected response:** Status **200** and array of users.

![List users](https://res.cloudinary.com/dgbngcvkl/image/upload/v1747036151/Listar_usuarios_fwyt2f.png)

---

### 3. View a Specific User (GET `/api/users/{id}`)

- **Expected response:** Status **200** and user data.

![View user](https://res.cloudinary.com/dgbngcvkl/image/upload/v1747036151/Ver_usuario_hvj3bh.png)

---

### 4. Update User (PUT `/api/users/{id}`)

- **Request JSON:**

```json
{
"name": "Juan Updated"
}
```

- **Expected response:** Status **200** and updated data.

![Update user](https://res.cloudinary.com/dgbngcvkl/image/upload/v1747036150/Actualizar_usuario_zbtpll.png)

---

### 5. Delete User (DELETE `/api/users/{id}`)

- **Expected response:** Status **204** and no content.

![Delete user](https://res.cloudinary.com/dgbngcvkl/image/upload/v1747036150/Eliminar_usuario_eolnkq.png)

---

<h1>📊 Methodology</h1>

This project was developed using the **SCRUM** methodology and **Pair Programming** to ensure efficient collaboration and agile development.

---

<h1>📋 License</h1>

This project is licensed under the **MIT** license.
