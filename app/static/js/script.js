document.addEventListener("DOMContentLoaded", function () {
  // Get all Add to Cart buttons
  const cartButtons = document.querySelectorAll(".add-to-cart");

  // Get navbar cart count
  const cartCount = document.getElementById("cart-count");

  // Load saved cart products
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  // Calculate total quantity
  function updateCartCount() {
    let count = 0;

    cartItems.forEach(function (item) {
      count += item.quantity;
    });

    cartCount.textContent = `Cart (${count})`;

    // Save updated cart
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    // Save count separately for compatibility
    localStorage.setItem("cartCount", count);
  }

  // Add product to cart
  cartButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      // Get product details
      const name = button.dataset.name;
      const price = Number(button.dataset.price);

      // Find product in cart
      const existingProduct = cartItems.find(function (item) {
        return item.name === name;
      });

      if (existingProduct) {
        // Increase quantity
        existingProduct.quantity++;
      } else {
        // Add new product
        cartItems.push({
          name: name,
          price: price,
          quantity: 1,
        });
      }

      // Update and save cart
      updateCartCount();

      alert(name + " added to cart!");
    });
  });

  // Display saved cart count on page load
  updateCartCount();
});


// Update navbar cart count
function updateCartCount() {

    const cartCountElement = document.getElementById("cart-count");

    if (!cartCountElement) return;

    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    let totalQuantity = 0;

    cartItems.forEach(function (item) {
        totalQuantity += item.quantity;
    });

    cartCountElement.textContent = `Cart (${totalQuantity})`;
}

// Update count when page loads
document.addEventListener("DOMContentLoaded", updateCartCount);
