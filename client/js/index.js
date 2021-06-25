const mp = new MercadoPago("PUBLIC_KEY", {
  locale: 'pt-BR'
});

function createProductFactory () {
  let productFactory = {};

  productFactory.createProduct = (name, description, unitPrice) => {
    document.getElementById("product-name").innerHTML = name;
    document.getElementById("product-description").innerHTML = description;
    document.getElementById("unit-price").innerHTML = unitPrice + ",00";
    document.getElementById("quantity").value = 1;

    return {
      name, 
      description, 
      unitPrice,
      quantity: 1
    }
  }

  productFactory.updateProductQuantity = (product) => {
    let quantityField = document.querySelector("#quantity");
    if(quantityField) {
      product.quantity = quantityField.value;
    }
  }

  return productFactory;
};

const productFactory = createProductFactory();
const product = productFactory.createProduct(
  "Site institucional", 
  "Site dinâmico com manutenção inclusa", 
  1200
);

function sendProduct () {
  fetch("http://localhost:8080/create_preference", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
    })
      .then(response => response.json())
      .then(preference => {
          mp.checkout({
            preference: {
                id: preference.id
            },
            autoOpen: true
          })
      })
      .catch(function() {
          alert("Ocorreu um erro, tente novamente.");
      });
}

function onQuantityChange() {
  productFactory.updateProductQuantity(product);
  updatePrice();
}

function updatePrice() {
  let amount = parseInt(product.unitPrice) * parseInt(product.quantity);

  let cartTotalField = document.getElementById("cart-total");
  let summaryPriceField = document.getElementById("summary-price");
  let summaryQuantityField = document.getElementById("summary-quantity");
  let summaryTotalField = document.getElementById("summary-total");

  if(cartTotalField){
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

document.getElementById("quantity").addEventListener("change", onQuantityChange);
updatePrice(); 