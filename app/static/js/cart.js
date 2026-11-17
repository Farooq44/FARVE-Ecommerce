document.addEventListener("DOMContentLoaded", function () {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const clearCartButton = document.getElementById("clear-cart");
  const checkoutButton = document.getElementById("checkout");

  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  // Save cart data
  function saveCart() {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    let count = 0;

    cartItems.forEach(function (item) {
      count += item.quantity;
    });

    localStorage.setItem("cartCount", count);
    window.dispatchEvent(new Event("cartUpdated"));
  }

  window.addEventListener("cartUpdated", function () {
    const cartCountElement = document.getElementById("cart-count");

    if (cartCountElement) {
      const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);

      cartCountElement.textContent = `Cart (${count})`;
    }
  });

  // Display cart products
  function displayCart() {
    cartItemsContainer.innerHTML = "";

    let total = 0;

    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML =
        "<p class='text-muted'>Your cart is empty!</p>";

      cartTotal.textContent = "0";
      saveCart();
      return;
    }

    cartItems.forEach(function (item, index) {
      const subtotal = item.price * item.quantity;
      total += subtotal;

      const product = document.createElement("div");

      product.className = "cart-item-row";

      // Product details
      const details = document.createElement("div");

      const name = document.createElement("h5");
      name.textContent = item.name;

      const price = document.createElement("p");
      price.textContent = `₹${item.price.toLocaleString("en-IN")} each`;

      details.appendChild(name);
      details.appendChild(price);

      // Quantity controls
      const controls = document.createElement("div");
      controls.className = "cart-quantity-controls";

      const decreaseButton = document.createElement("button");
      decreaseButton.textContent = "−";
      decreaseButton.className = "btn btn-outline-secondary";

      decreaseButton.addEventListener("click", function () {
        if (item.quantity > 1) {
          item.quantity--;
        }

        saveCart();
        displayCart();
      });

      const quantity = document.createElement("span");
      quantity.textContent = item.quantity;

      const increaseButton = document.createElement("button");
      increaseButton.textContent = "+";
      increaseButton.className = "btn btn-outline-secondary";

      increaseButton.addEventListener("click", function () {
        item.quantity++;

        saveCart();
        displayCart();
      });

      controls.appendChild(decreaseButton);
      controls.appendChild(quantity);
      controls.appendChild(increaseButton);

      // Product subtotal
      const amount = document.createElement("strong");
      amount.className = "cart-item-subtotal";
      amount.textContent = `₹${subtotal.toLocaleString("en-IN")}`;

      
      product.appendChild(details);
      product.appendChild(controls);
      product.appendChild(amount);

      // Create Remove button
      const removeButton = document.createElement("button");

      removeButton.textContent = "Remove";
      removeButton.className = "btn btn-outline-danger btn-sm cart-remove-btn";

      // Remove selected product
      removeButton.addEventListener("click", function () {
      cartItems.splice(index, 1);

  saveCart();


  displayCart();
});

product.appendChild(removeButton);

cartItemsContainer.appendChild(product);

    });

    cartTotal.textContent = total.toLocaleString("en-IN");

    saveCart();
  }


  // Clear the entire cart
  clearCartButton.addEventListener("click", function () {

      if (cartItems.length === 0) {
          alert("Your cart is already empty!");
          return;
      }

      const confirmClear = confirm(
          "Are you sure you want to remove all products?"
      );

      if (confirmClear) {
          cartItems = [];

          saveCart();
          displayCart();

          alert("Your cart has been cleared!");
      }

  });

  displayCart();

  // proceed to checkout button
  checkoutButton.addEventListener("click", function(){
    if (cartItems.length === 0){
      alert("your cart is empty!");
      return;
    }
    window.location.href = "/checkout";
  });

});
