
from flask import Flask, render_template, request, redirect, session
from werkzeug.security import check_password_hash
import json
from config import get_db_connection
import os
from flask_wtf.csrf import CSRFProtect


def creat_app():

    app = Flask(__name__)

    csrf = CSRFProtect(app)
    
    app.secret_key = os.getenv("SECRET_KEY")
    app.config["SESSION_COOKIE_HTTPONLY"] = True
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
    app.config["SESSION_COOKIE_SECURE"] = False

    @app.route("/")
    def home():
        return render_template("index.html")

    @app.route("/cart")
    def cart():
        return render_template("cart.html")

    @app.route("/checkout", methods=["GET", "POST"])
    def checkout():

        if request.method == "POST":

            full_name = request.form.get("full_name")
            email = request.form.get("email")
            phone = request.form.get("phone")
            address = request.form.get("address")
            cart_data = request.form.get("cart_data")

            connection = None
            cursor = None

            try:
                cart_items = json.loads(cart_data or "[]")

                if not cart_items:
                    return "Your cart is empty!"

                total_amount = sum(
                    float(item["price"]) * int(item["quantity"])
                    for item in cart_items
                )

                connection = get_db_connection()
                cursor = connection.cursor()

                cursor.execute(
                    """
                    INSERT INTO orders
                    (full_name, email, phone, address, total_amount)
                    VALUES (%s, %s, %s, %s, %s)
                    """,
                    (full_name, email, phone, address, total_amount)
                )

                order_id = cursor.lastrowid

                for item in cart_items:
                    quantity = int(item["quantity"])
                    price = float(item["price"])
                    subtotal = price * quantity

                    cursor.execute(
                        """
                        INSERT INTO order_items
                        (order_id, product_name, quantity, unit_price, sub_total)
                        VALUES (%s, %s, %s, %s, %s)
                        """,
                        (
                            order_id,
                            item["name"],
                            quantity,
                            price,
                            subtotal
                        )
                    )

                connection.commit()

                return render_template("order_success.html", order_id=order_id)

            except Exception as e:
                if connection:
                    connection.rollback()

                return f"Order failed: {str(e)}"

            finally:
                if cursor:
                    cursor.close()

                if connection:
                    connection.close()

        return render_template("checkout.html")

# admin--------

    @app.route("/admin")
    def admin_dashboard():

        if not session.get("admin_logged_in"):
            return redirect("/admin/login")

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                order_id,
                full_name,
                email,
                total_amount,
                order_status,
                created_at
            FROM orders
            ORDER BY created_at DESC
        """)

        orders = cursor.fetchall()
        cursor.execute("""
            SELECT
                COUNT(*) AS total_orders,
                COALESCE(SUM(total_amount), 0) AS total_revenue,
                COALESCE(SUM(order_status = 'Pending'), 0) AS pending_orders,
                COALESCE(SUM(order_status = 'Delivered'), 0) AS delivered_orders
            FROM orders
        """)

        stats = cursor.fetchone()

        cursor.close()
        connection.close()

        return render_template("admin.html", orders=orders, stats = stats)

    @app.route("/admin/order/<int:order_id>")
    def admin_order_details(order_id):

        if not session.get("admin_logged_in"):
            return redirect("/admin/login")

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            "SELECT * FROM orders WHERE order_id = %s",
            (order_id,)
        )

        order = cursor.fetchone()

        if not order:
            cursor.close()
            connection.close()
            return "Order not found", 404

        cursor.execute(
            "SELECT * FROM order_items WHERE order_id = %s",
            (order_id,)
        )

        items = cursor.fetchall()

        cursor.close()
        connection.close()

        return render_template(
            "admin_order_details.html",
            order=order,
            items=items
        )

# The route receives the selected status, checks that it is valid, updates the corresponding MySQL order and returns to the dashboard.
    @app.route("/admin/update-status/<int:order_id>", methods=["POST"])
    def update_order_status(order_id):

        if not session.get("admin_logged_in"):
            return redirect("/admin/login")

        new_status = request.form.get("order_status")

        allowed_statuses = [
            "Pending",
            "Shipped",
            "Delivered",
            "Cancelled"
        ]

        if new_status not in allowed_statuses:
            return "Invalid order status", 400

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            UPDATE orders
            SET order_status = %s
            WHERE order_id = %s
            """,
            (new_status, order_id)
        )

        connection.commit()

        cursor.close()
        connection.close()

        return redirect("/admin")

    # admin login route
    @app.route("/admin/login", methods=["GET", "POST"])
    def admin_login():

        if request.method == "POST":

            username = request.form.get("username")
            password = request.form.get("password")

            admin_username = os.getenv("ADMIN_USERNAME")
            admin_password_hash = os.getenv("ADMIN_PASSWORD_HASH")

            if (
                username == admin_username
                and admin_password_hash
                and check_password_hash(admin_password_hash, password)
            ):
                session["admin_logged_in"] = True
                return redirect("/admin")

            return render_template(
                "admin_login.html",
                error="Invalid username or password"
            )

        return render_template("admin_login.html")

    # admin logout
    @app.route("/admin/logout", methods=["POST"])
    def admin_logout():

        session.pop("admin_logged_in", None)

        return redirect("/admin/login")

    
    return app
