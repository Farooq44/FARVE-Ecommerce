# FARVÉ — Full-Stack E-Commerce Website

A modern e-commerce web application built using Python, Flask, MySQL, HTML, CSS, JavaScript, and Bootstrap.

## About the Project

FARVÉ is a fashion e-commerce website where customers can browse products, manage their shopping cart, and place orders. It also includes an admin dashboard for managing customer orders.

## Technologies Used

**Frontend**
- HTML5
- CSS3
- Bootstrap 5
- JavaScript
- Fetch API

**Backend**
- Python
- Flask

**Database**
- MySQL

**Tools**
- Visual Studio Code
- Git & GitHub

## Features

### Customer Features
- Responsive homepage and product listings
- Add products to shopping cart
- Increase and decrease product quantities
- Remove products from cart
- View cart total
- Checkout and place orders
- Order confirmation page

### Admin Features
- Secure admin login
- Admin dashboard
- View customer orders
- View order details
- Update order status
- Dashboard statistics for orders and revenue
- Admin logout

### Security
- Environment variables for sensitive configuration
- Password hashing for admin authentication
- CSRF protection for POST forms
- Session-based admin authentication

## Project Structure

```text
FARVE-Ecommerce/
│
├── app/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── static/
│   │   ├── css/
│   │   ├── images/
│   │   └── js/
│   ├── templates/
│   └── __init__.py
│
├── config.py
├── requirements.txt
├── run.py
├── README.md
└── .gitignore
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Farooq44/FARVE-Ecommerce.git
cd FARVE-Ecommerce
```

### 2. Create a virtual environment

```bash
python -m venv .venv
```

### 3. Activate the environment

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Configure environment variables

Create a `.env` file in the project root and configure:

```env
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=ecommerce_db

SECRET_KEY=your_secret_key

ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD_HASH=your_password_hash
```

Never upload your `.env` file or expose your credentials publicly.

### 6. Configure MySQL

Create the `ecommerce_db` database and configure the required tables.

### 7. Run the application

```bash
python run.py
```

Open your browser and visit:

```text
http://127.0.0.1:5000/
```

## Future Improvements

- Payment gateway integration
- Product search and filtering
- Product management for administrators
- Customer registration and login
- Order tracking
- Deployment to a cloud platform

## Developer

**Farooq Cherukuri**

GitHub: [Farooq44](https://github.com/Farooq44)

LinkedIn: [Farooq Cherukuri](https://www.linkedin.com/in/cherukuri-farooq-179947220/)

---

*FARVÉ — Style Meets Simplicity.*