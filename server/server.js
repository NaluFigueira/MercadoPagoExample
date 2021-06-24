const express = require("express");
const app = express();
const mercadopago = require("mercadopago");

//REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel/credentials
mercadopago.configurations.setAccessToken("YOUR_ACCESS_TOKEN"); 

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("../../client"));

app.get("/", (_, res) => res.status(200).sendFile("index.html")); 

app.post("/create_preference", (req, res) => {
	let preference = {
		items: [{
			title: req.body.description,
			unit_price: Number(req.body.unitPrice),
			quantity: Number(req.body.quantity),
		}],
		back_urls: {
			"success": "http://localhost:8080/feedback",
			"failure": "http://localhost:8080/feedback",
			"pending": "http://localhost:8080/feedback"
		},
		auto_return: 'approved',
	};

	mercadopago.preferences.create(preference)
		.then(response => res.json({id :response.body.id}))
		.catch(error => console.log(error));
});

app.get('/feedback', (request, response) =>
	 response.json({
		Payment: request.query.payment_id,
		Status: request.query.status,
		MerchantOrder: request.query.merchant_order_id
	})
);

app.listen(8080, () => {
  console.log("The server is now running on Port 8080");
});
