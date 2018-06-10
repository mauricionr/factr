const o = require('../../pages/uri.js')

module.exports = class {
	onInput() {
		this.state = {
			promotions: [],
			order_items: [],
			subtotal: 0.0,
			total: 0.0,
			taxa: 0.0,
			credito: 0.0,
			is_logged: false,
			endpoint: `promotions/`
		}
		this.state = Object.assign(this.state)
	}
	onMount(){
		if (localStorage.getItem('currentUserId') != 'null') this.state.is_logged = true

		if (localStorage.getItem('order_item')) this.state.order_items = JSON.parse("[" + localStorage.getItem('order_item') + "]")

		if (localStorage.getItem('promotion')) this.state.promotions = JSON.parse("[" + localStorage.getItem('promotion') + "]")

		for (var i in this.state.promotions) {
			this.state.subtotal += this.state.promotions[i]["value"]
			this.state.credito += this.state.promotions[i]["value_credit"]
			this.state.taxa += this.state.promotions[i]["carrier_tax"]
		}
		this.state.total = this.state.subtotal + this.state.taxa;
		console.log("Total: "+ this.state.total);
		console.log("crédito: "+ this.state.credito);
	}
	createOrder() {
		return fetch(o.api + `orders/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': FactrUser.getToken(),
				'Accept': 'application/json'
			},
			body: JSON.stringify(
				{
					"status": "Em andamento",
					"partners_id": 1, //TODO: verificar regra
					"residents_id": localStorage.getItem('currentUserId'),
					"payment_methods_id": 1
				}
			)
		})
		.then(function(response) {
			return response.json();
		})
	}
	updateOrderItem(item_id, order_id) {
		return fetch(o.api + `order_items/` + item_id, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': FactrUser.getToken(),
				'Accept': 'application/json'
			},
			body: JSON.stringify({"orders_id": order_id})
		})
		.then(function(response) {
			return response.json();
		})
	}
	close_order() {
		this.createOrder()
		.then((json) => {
			for (var i in this.state.order_items) {
				this.updateOrderItem(this.state.order_items[i].id, json.order.id)
				.then((json) => {
					localStorage.removeItem('promotion')
					localStorage.removeItem('order_item')
					toastMessage("Pedido Fechado com sucesso")
					setTimeout(function() {
		        window.location.assign('/');
		      }, 1000);
				})
				.catch(reason => {
					toastMessage(reason);
				});
			}
		})
		.catch(reason => {
			toastMessage(reason);
		});
	}
}
