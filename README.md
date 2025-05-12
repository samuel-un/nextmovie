<p align="center">
  <img src="https://res.cloudinary.com/dgbngcvkl/image/upload/v1747036873/NextMovie_logo_letras_y_icono_axjmma.png" alt="NextMovie Backend">
</p>

<h1>🎬 NextMovie - Your Movie & Series Manager Platform 🍿</h1>

NextMovie is a **full-stack web application platform** that allows users to manage their favorite movies and TV shows, including functionalities such as user management, personalized lists, and recommendations.

This repository contains the **Laravel-based backend**, designed to be robust, scalable, and easy to integrate with the frontend application (built with React).

<h1>📌 Features</h1>

-   👤 **User management (CRUD)** for creating, updating, and deleting user profiles.
-   🔒 **JWT Authentication** for secure user login and registration.
-   📝 **Custom lists** for favorite movies and series (integrated with frontend).
-   ⭐ **Rating and Recommendations system** (Planned).
-   📦 **API Consumption** of TMDb (The Movie Database) for movie and series data (integrated with frontend).
-   🗄 **Database migrations and seeders** for easy setup and testing.
-   🛠 **Built with Laravel**, using routes, controllers, models, and API resources.

<h1>⚙️ Technologies Used</h1>

-   Laravel (Backend)
-   PHP
-   MySQL
-   Postman (for API testing)
-   JWT (JSON Web Tokens)
-   The Movie Database (TMDb) API (Frontend integration)
-   React (Frontend, in a separate repository)

---

> **Note:**  
> This repository contains only the backend. The frontend is developed separately and connects to this API.

<h1>🔧 Installation</h1>

```bash
# Clone the repository
git clone https://github.com/samuel-un/nextmovie.git

# Enter the project directory
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

<h1>📋 License</h1>

This project is licensed under the **MIT** license.
