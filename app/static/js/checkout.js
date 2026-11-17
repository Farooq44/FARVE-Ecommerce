document.addEventListener("DOMContentLoaded", function () {
  const checkoutItems = document.getElementById("checkout-items");
  const checkoutTotal = document.getElementById("checkout-total");

  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  let total = 0;

  checkoutItems.innerHTML = "";

  if (cartItems.length === 0) {
    checkoutItems.innerHTML = "<p class='text-muted'>Your cart is empty.</p>";
  } else {
    cartItems.forEach(function (item) {
      const subtotal = item.price * item.quantity;
      total += subtotal;

      const product = document.createElement("div");
      product.className = "d-flex justify-content-between mb-3";

      product.innerHTML = `
                <span>${item.name} × ${item.quantity}</span>
                <strong>₹${subtotal.toLocaleString("en-IN")}</strong>
            `;

      checkoutItems.appendChild(product);
    });
  }

  checkoutTotal.textContent = total.toLocaleString("en-IN");

  const checkoutForm = document.getElementById("checkout-form");
  const cartDataInput = document.getElementById("cart-data");

  checkoutForm.addEventListener("submit", function(){
    cartDataInput.value = localStorage.getItem("cartItems") || "[]";
  });

});
