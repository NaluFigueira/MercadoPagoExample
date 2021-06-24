/*---------------------------------------------------------
BUTTON METHODS
---------------------------------------------------------*/

function setCheckoutButtonDisabledAttribute (isDisabled){
  let checkoutButton = document.querySelector("#checkout-btn");  

  if(checkoutButton) {
    checkoutButton.setAttribute("disabled", isDisabled);
  }
}

function createSendButton(preference) {
  let script = document.createElement("script");
  
  script.src = "https://www.mercadopago.com.br/integrations/v1/web-payment-checkout.js";
  script.type = "text/javascript";
  script.dataset.preferenceId = preference;

  let sendButton = document.getElementById("send-button");
  if(!sendButton) {
    return null;
  }
  sendButton.innerHTML = "";
  sendButton.appendChild(script);
}

/*---------------------------------------------------------
CHECKOUT FORM METHODS
---------------------------------------------------------*/

function openCheckoutForm () {
  let shoppingCartContainer = document.querySelector(".shopping-cart");
  let checkoutFormContainer = document.querySelector(".container_payment");
  if(shoppingCartContainer) {
    shoppingCartContainer.setAttribute("style", "display: none");
  }
  if(checkoutFormContainer) {
    checkoutFormContainer.setAttribute("style", "display: block");
  }
}

function closeCheckoutForm() {
  let shoppingCartContainer = document.querySelector(".shopping-cart");
  let checkoutFormContainer = document.querySelector(".container_payment");
  if(shoppingCartContainer) {
    shoppingCartContainer.setAttribute("style", "display: none");
  }
  if(checkoutFormContainer) {
    checkoutFormContainer.setAttribute("style", "display: block");
  }
  setCheckoutButtonDisabledAttribute(false);
}

/*---------------------------------------------------------
PRODUCT MANAGEMENT METHODS
---------------------------------------------------------*/

function getProductHTMLFields () {
  let quantityField = document.querySelector("#quantity");
  let descriptionField = document.querySelector("#product-description");
  let unitPriceField = document.querySelector("#unit-price");

  if(!quantityField || !descriptionField || !unitPriceField) {
    return null;
  }

  return {
    quantityField,
    descriptionField,
    unitPriceField
  }
}

function createProduct() {
  let productHTMLFields = getProductHTMLFields();
  if(!productHTMLFields) {
    return null;
  }

  let {quantityField, descriptionField, unitPriceField} = productHTMLFields;

  return {
    quantity: quantityField.value,
    description: descriptionField.innerHTML,
    unitPrice: unitPriceField.innerHTML
  };
}

function sendProduct () {
  setCheckoutButtonDisabledAttribute(true);

  let product = createProduct();

  if(!product) {
    return null;
  }
    
  fetch("/create_preference", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
    })
      .then(response => response.json())
      .then(preference => {
          createSendButton(preference.id);
          openCheckoutForm();
      })
      .catch(function() {
          alert("Unexpected error");
          setCheckoutButtonDisabledAttribute(false);
      });
}

function updatePrice() {
  let product = createProduct();

  if(!product) {
    return null;
  }
  
  let amount = parseInt(product.unitPrice) * parseInt(product.quantity);

  let cartTotalField = document.getElementById("cart-total");
  let summaryPriceField = document.getElementById("summary-price");
  let summaryQuantityField = document.getElementById("summary-quantity");
  let summaryTotalField = document.getElementById("summary-total");


  if(cartTotalField) {
    cartTotalField.innerHTML = "R$ " + amount +",00";
  }
  if(summaryPriceField) {
    summaryPriceField.innerHTML = "R$ " + product.unitPrice +",00";
  }
  if(summaryQuantityField) {
    summaryQuantityField.innerHTML = product.quantity;
  }
  if(summaryTotalField) {
    summaryTotalField.innerHTML = "R$ " + amount +",00";
  }
}

document.getElementById("quantity").addEventListener("change", updatePrice);
updatePrice(); 