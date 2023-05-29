//insert cartItem cards into the page using loop (through the cart array). keep in mind each item has productId and I need to fetch to grab product details such as description and name (use fetch API from backend) Similar to milestone 3
//NOTE total quantity and total price (TIP: as you are iterating through -> update the running totals on the page not on localstorage/backend)

fetch("http://localhost:3000/api/products/")
  .then((data) => {
    return data.json();
  })
  .then((products) => {
    insertCart(products);
  });

//connect html to the items in cart
const sectionCartItem = document.getElementById("cart__items");
function insertCart(products) {
  let cartItemCards = "";
  let cart = JSON.parse(window.localStorage.getItem("cart")) || [];
  console.log(cart);
  for (let cartItem of cart) {
    //get the product from product's array for current cartItem.id
    const found = products.find((product) => {
      return product._id === cartItem.productId;
    });
    console.log(found);
    const cartArticle = document.createElement("article");
    cartArticle.classList.add("cart__item");
    cartArticle.dataset.id = found._id;
    cartArticle.dataset.color = cartItem.color;
    cartArticle.innerHTML = `
            <div class="cart__item__img">
              <img src="${found.imageUrl}" alt="${found.altTxt}">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${found.name}</h2>
                <p>${cartItem.color}</p>
                <p>€${found.price}</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartItem.quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Delete</p>
                </div>
              </div>
            </div>        
    `;

    //add a change eventListener to the input field for quantity
    let itemQuantity = cartArticle.querySelector(".itemQuantity");
    itemQuantity.addEventListener("change", ($event) => {
      let cart = JSON.parse(window.localStorage.getItem("cart")) || [];
      const clickedElement = $event.target;
      const newQuantity = parseInt(clickedElement.value);

      //FIXME need to get dataset.color from closest article and ask to getCartItem. Do this first and then delete item
      const productId = clickedElement.closest("article").dataset.id;
      const productColor = clickedElement.closest("article").dataset.color;
      const matchingItem = getCartItem(cart, productId, productColor);

      //delete from localStorage after getCartItem
      const cartItemToChange = getCartItem(cart, productId, productColor);
      console.log(newQuantity);
      const changedQuantity = newQuantity - cartItemToChange.quantity;

      //use the same format for delete eventlistner
      updateTotalQuantity(changedQuantity);
      cartItemToChange.quantity = newQuantity;

      //update the total price - create updateTotalPrice function same as we create totalQuantity (highlight -> refactor -> global)
      updateTotalPrice(changedQuantity, found.price);
      localStorage.setItem("cart", JSON.stringify(cart));
    });

    //add a click eventListener to delete <p> tag
    const deleteItem = cartArticle.querySelector(".deleteItem");
    deleteItem.addEventListener("click", ($event) => {
      let cart = JSON.parse(window.localStorage.getItem("cart")) || [];
      //remove item from browser
      const deleteLink = $event.target;
      const elementToDelete = deleteLink.closest("article");
      elementToDelete.remove();

      //remove item from local storage
      const dataId = elementToDelete.dataset.id;
      const dataColor = elementToDelete.dataset.color;
      console.log(`dataID = ${dataId}, dataColor = ${dataColor}`);
      let quantityDeleted;
      const filtered = cart.filter((cartItem) => {
        let canKeep;
        if (cartItem.productId === dataId && cartItem.color === dataColor) {
          quantityDeleted = cartItem.quantity;
          canKeep = false;
        } else {
          canKeep = true;
        }
        return canKeep;
      });
      console.log(filtered);
      localStorage.setItem("cart", JSON.stringify(filtered));

      //update totals using the functions already present
      updateTotalQuantity(-quantityDeleted);

      //FIXME update total price when an item is deleted

      updateTotalPrice(quantityDeleted, -found.price);
    });

    sectionCartItem.appendChild(cartArticle);

    //update total price and total quantity for current cartItem - we need a number to do arithmatic calculation ie) const selectedQuantity = parseInt(quantityElement.value);

    //  convert string quantity in cartItem into number
    // get the current total off the page + partInt the number string
    //  update the total number on the page with current cartItem quantity
    //get span element with #totalQuantity
    updateTotalQuantity(cartItem.quantity);
    updateTotalPrice(cartItem.quantity, found.price);
  }
}

function getCartItem(cart, productId, productColor) {
  console.log(productId);
  console.log(productColor);
  console.log(cart);
  const found = cart.find((cartItem) => {
    return cartItem.productId === productId && cartItem.color === productColor;
  });
  return found;
}

function updateTotalQuantity(quantity) {
  let currentQuantity =
    parseInt(document.getElementById("totalQuantity").innerText) || 0;
  currentQuantity += quantity;

  totalQuantity.innerText = currentQuantity;
  console.log(totalQuantity);
}

function updateTotalPrice(quantity, price) {
  let currentPrice =
    parseInt(document.getElementById("totalPrice").innerText) || 0;

  currentPrice += price * quantity;
  totalPrice.innerText = currentPrice;
  console.log(currentPrice);
}

const expName = /^[a-zA-Z\s_-]+$/;
const expEmail =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const expAdd = /^[a-zA-Z0-9\s,!.'_-]+$/;

//firstName field
firstName.addEventListener("change", ($event) => {
  const firstName = document.getElementById("firstName");
  const firstNameValue = firstName.value;
  const error = document.getElementById("firstNameErrorMsg");

  //TODO reset any previous error
  error.innerHTML = ""; // FIXME I DON'T UNDERSTAND

  //TODO test firstName input value
  if (expName.test(firstNameValue)) {
    firstName.value = firstNameValue;
    error.innerHTML = "";

    //TODO set error message if test fails
  } else {
    error.innerHTML = "Please enter valid first name";
  }
});

//LastName field
lastName.addEventListener("change", ($event) => {
  const lastName = document.getElementById("lastName");
  const lastNameValue = lastName.value;
  const error = document.getElementById("lastNameErrorMsg");

  //TODO reset any previous error
  error.innerHTML = ""; // FIXME I DON'T UNDERSTAND

  //TODO test firstName input value
  if (expName.test(lastNameValue)) {
    lastName.value = lastNameValue;
    error.innerHTML = "";

    //TODO set error message if test fails
  } else {
    error.innerHTML = "Please enter valid last name";
  }
});

document.getElementById("order").addEventListener("click", ($event) => {
  const submit = $event.target;
  //TODO when the user click order button check all inputs are validated
  //TODO fetch API to submit order to back-end (POST)
  //TODO get orderId from the response
  //TODO clear out the cart
  //TODO redirect to the confirmation page sending the orderId in the Url
});
