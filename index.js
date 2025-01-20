const btns = document.querySelectorAll('.btn');
const cartCount = document.getElementById('cartCount');
const emptyCart = document.getElementById('emptyCart');
const cartSection = document.querySelector('section');
const confirmOrderButton = document.createElement('button'); // Confirm order button

let cart = [];  // Array to store cart items

// Add event listeners for all "Add to Cart" buttons
btns.forEach((btn) => {
  const parent = btn.closest('.buttonDiv'); // Parent div containing the button
  const clickedDiv = parent.querySelector('#clicked'); // Plus/Minus quantity div
  const countElement = clickedDiv.querySelector('#count'); // Quantity counter element
  const plus = clickedDiv.querySelector('#plus'); // Plus button
  const minus = clickedDiv.querySelector('#minus'); // Minus button
  const image = btn.closest('.item').querySelector('.image'); // Image element for the item

  btn.addEventListener('click', () => {
    btn.style.display = 'none';  // Hide "Add to Cart" button
    clickedDiv.style.display = 'flex';  // Show plus/minus div

    const itemElement = btn.closest('.item');
    const name = itemElement.querySelector('.details p').textContent;  // Get the item name
    const price = parseFloat(itemElement.querySelector('#amount').textContent);  // Get the item price

    // Add border to the selected item image
    image.classList.add('selected-image'); // Apply border to the selected image

    // Check if the item is already in the cart
    let existingItem = cart.find((item) => item.name === name);

    if (!existingItem) {
      existingItem = { name, price, quantity: 1 };  // Add new item to cart
      cart.push(existingItem);
    }

    // Update the display count for this item's quantity
    countElement.textContent = existingItem.quantity;

    updateCartDisplay();

    // Plus button functionality to increase the quantity
    plus.onclick = () => {
      existingItem.quantity++;
      countElement.textContent = existingItem.quantity;
      updateCartDisplay();
    };

    // Minus button functionality to decrease the quantity or remove item
    minus.onclick = () => {
      if (existingItem.quantity > 1) {
        existingItem.quantity--;
        countElement.textContent = existingItem.quantity;
      } else {
        // Remove the item from the cart entirely
        cart = cart.filter((item) => item.name !== name);
        clickedDiv.style.display = 'none';  // Hide the plus/minus div
        btn.style.display = 'inline-flex';  // Show "Add to Cart" button
        image.classList.remove('selected-image'); // Remove the border around the image
      }
      updateCartDisplay();
    };
  });
});

function updateCartDisplay() {
  // Clear existing cart items from the display
  const existingCartItems = document.querySelectorAll('.cart-item');
  existingCartItems.forEach((item) => item.remove());

  // Remove the existing total section and "Clear Cart" button
  const existingTotal = document.querySelector('.cart-total');
  if (existingTotal) existingTotal.remove();

  const clearCartButton = document.querySelector('.clear-cart');
  if (clearCartButton) clearCartButton.remove();

  // Remove the confirm order button if it exists
  if (confirmOrderButton.parentElement) {
    confirmOrderButton.parentElement.removeChild(confirmOrderButton);
  }

  let total = 0; // Total price calculation
  let totalItems = 0; // Total quantity of items

  cart.forEach((cartItem) => {
    totalItems += cartItem.quantity;  // Sum up the quantity of items
    total += cartItem.price * cartItem.quantity;  // Calculate the total price

    // Create and display each cart item
    const cartItemElement = document.createElement('div');
    cartItemElement.classList.add('cart-item');
    cartItemElement.innerHTML = `
      <div class="cartItem">
        <div>
          <p><strong>${cartItem.name}</strong></p>
          <p> <span id= "itemCount"> ${cartItem.quantity} x</span> @$${cartItem.price.toFixed(2)} <span id= "multiplied">$${cartItem.price.toFixed(2)*cartItem.quantity}</span></p>
        </div>
        <button class="delete-item">X</button>
      </div>     
      
      
    `;
    
    // Add the delete button functionality
    const deleteButton = cartItemElement.querySelector('.delete-item');
    deleteButton.addEventListener('click', () => {
      // Remove the item from the cart array
      cart = cart.filter((item) => item.name !== cartItem.name);
      
      // Find the item in the cart and remove the quantity adjuster and border
      const itemElement = Array.from(btns).find(btn => btn.closest('.item').querySelector('.details p').textContent === cartItem.name).closest('.item');
      const clickedDiv = itemElement.querySelector('#clicked');
      const image = itemElement.querySelector('.image');

      clickedDiv.style.display = 'none'; // Hide the quantity adjuster
      image.classList.remove('selected-image'); // Remove the border around the image

      // Show the "Add to Cart" button again
      const addToCartButton = itemElement.querySelector('.btn');
      addToCartButton.style.display = 'inline-flex'; // Show "Add to Cart" button

      updateCartDisplay(); // Refresh the cart display after removal
    });

    cartSection.appendChild(cartItemElement);
  });

  // Update the cart count (number of items)
  cartCount.textContent = totalItems;

  // Display empty cart message if there are no items in the cart
  if (cart.length === 0) {
    emptyCart.style.display = 'block';
  } else {
    emptyCart.style.display = 'none';

    // Add the total section to show the cart total
    const totalElement = document.createElement('div');
    totalElement.classList.add('cart-total');
    totalElement.innerHTML = `
      
      
      <p id = "cart-total">Order Total: <span id= "total"> $${total.toFixed(2)}</span></p>
      <div id = "carbon">
        <img src="./assets/images/icon-carbon-neutral.svg" alt="">
        <p>This is a <strong>Carbon-neutral</strong> delivery</p>
      </div>
    `;
    cartSection.appendChild(totalElement);


    // Add the Confirm Order button at the bottom
    confirmOrderButton.textContent = 'Confirm Order';
    confirmOrderButton.classList.add('confirm-order');
    confirmOrderButton.addEventListener('click', showOrderModal);
    cartSection.appendChild(confirmOrderButton);
  }
}

function showOrderModal() {
  // Create the modal content
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
    <div class="modal-content">
    <img src="./assets/images/icon-order-confirmed.svg">
      <h2>Order Confirmed</h2>
      <p>We hope you enjoy your food!</p>
      <div class="order-details">
        ${cart.map(item => `
          <div class="order-item">
            <p id="modalDetails"><strong>${item.name}</strong></br> <span id="modalCount">${item.quantity}x</span> <span id="itemPrice">@$${item.price.toFixed(2)}</span></p>
            <p><strong id="modalTotal">$${(item.price * item.quantity).toFixed(2)}</strong></p>
          </div>
        `).join('')}

          
        <p class="modalTotal">Order Total <strong>$${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</strong></p>
      </div>
      <button class="start-new-order" onclick="startNewOrder()">Start New Order</button>
    </div>
  `;

  // Append the modal to the body
  document.body.appendChild(modal);
}

function startNewOrder() {
  // Refresh the page to start a new order
  window.location.reload(true); // Force a reload from the server to ensure the page is reset
}

function clearCart() {
  cart = [];  // Empty the cart array
  updateCartDisplay();  // Refresh the cart display

  // Reset all "Add to Cart" buttons and hide plus/minus controls
  btns.forEach((btn) => {
    const parent = btn.closest('.buttonDiv');
    const clickedDiv = parent.querySelector('#clicked');
    const countElement = clickedDiv.querySelector('#count');

    btn.style.display = 'inline-flex'; // Show "Add to Cart" button
    clickedDiv.style.display = 'none'; // Hide quantity adjuster
    countElement.textContent = '0';
  });
}
