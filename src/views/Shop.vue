<template>
    <div class="products">
        <h1>Welcome to the store, here are our products !</h1>

        <div v-if="show_products">

            <div v-if="shopping_cart_count">
            Products in cart: {{shopping_cart_count}} <router-link class="nav-link" to="/checkout">Checkout</router-link>
                <div v-if="reached_medical_limit_check">
                    <br >
                    Legal daily limit reached: Please remove item!
                </div>
                <div v-else>
                    <div v-if="medical_card_warning_check">
                        <br >
                        Legal limit reached: Please remove item or add Medical Card to place the order.
                    </div>
                </div>
                <div v-if="total_amount_cart">
                    <br >
                    Total amount to pay (incl. taxes) {{total_amount_cart}}
                </div>
            </div>
            <div v-else>
            Shopping cart is empty!
            </div>

            <div v-for="group in group_list" v-bind:key="group.grouptitle">
                <h3>
                {{group.grouptitle}}
                </h3>
                {{group.groupsubtitle}}
                <br />
                <br />

            <li v-for="product in group.products" v-bind:key="product.productId">
                <div v-if="product.productId">

                <div v-if="product.productPictureURL">
                    <img :src="product.productPictureURL"  height="180" />
                    <br />
                </div>

                <div v-if="quantity_in_shopping_cart(product.productId)">
                    Already placed in shopping cart ({{quantity_in_shopping_cart(product.productId)}})
                    <button v-on:click="updateproduct(product.productId,quantity_in_shopping_cart(product.productId),'plus')">Add</button>
                    <button v-on:click="updateproduct(product.productId,quantity_in_shopping_cart(product.productId),'minus')">Subtract</button>
                    <button v-on:click="updateproduct(product.productId,quantity_in_shopping_cart(product.productId),'zero')">Delete</button>
                </div>
                <div v-else>
                    <button v-on:click="add_to_shopping_cart(product.productId)">Add {{product.productId}} to Shoppingcart</button>
                </div>

                {{ product.productId }}
                <br />
                {{ product.productName }}
                <br />
               Type: {{ product.type }}
                <br />
               Brand:  {{ product.brand }}
                <br />
                Price Cents: {{ product.priceInMinorUnits }} | In Stock (demo only) : {{ product.quantity }}

                <div v-if="product.cbi_arr">
                    <div v-for="cbi_pos in product.cbi_arr" v-bind:key="cbi_pos.id">
                        {{cbi_pos.name.toUpperCase()}} Lower Range: {{cbi_pos.lowerRange}} {{cbi_pos.unitOfMeasure}}
                    </div>
                </div>

                <div v-if="product.promocoupon">
                Use Promocoupon  {{ product.promocoupon }}
                <br />
            </div>
                <br /><br />
                </div>
            </li>
            </div>
            <br />
            {{longitude_latitude}}
        </div>

        <div v-if="web_signed_in">
            Logged in web with user:

            <br />
            <amplify-sign-out></amplify-sign-out>
        </div>

    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        data() {
            return {

            }
        },
        computed: {
            show_products: function () {
                return this.$store.state.app_user.authenticated || this.$store.state.app_user.temp_user;
            },
            web_signed_in: function () {
                return this.$store.state.web_user.authenticated;
            },
            medical_card_warning_check: function () {
                return this.$store.state.shoppingcart.cart.medical_card_warning;
            },
            reached_medical_limit_check: function () {
                return this.$store.state.shoppingcart.cart.reached_medical_limit;
            },
            longitude_latitude: function () {
                return "Location: " + this.$store.state.app_user.longitude + " / " + this.$store.state.app_user.latitude;
            },
            group_list: function () {
                return this.$store.state.products.listing;
            },
            shopping_cart_count: function () {
                return this.$store.state.shoppingcart.cart_count;
            },
            total_amount_cart: function() {
                let to_pay_amount = '';
                if(this.$store.state.shoppingcart.cart.taxtotallines) {
                this.$store.state.shoppingcart.cart.taxtotallines.forEach(function (line) {
                    if (line.type === 'topay') {
                        to_pay_amount = line.value_show;
                    }
                })
                }
                return to_pay_amount;
            }
        },
        methods: {
            quantity_in_shopping_cart: function (product_id) {
                let quantity = false;
                 if (this.$store.state.shoppingcart.cart.items) {
                     if (this.$store.state.shoppingcart.cart.cart_count > 0) {
                        this.$store.state.shoppingcart.cart.items.forEach(function (item) {
                            // must be ==. or it will not work with ===
                           if ((product_id == item.id) && (item.qty > 0)) {
                                quantity = item.qty;
                           }
                        })
                     }
                }
                return quantity;
            },


            add_to_shopping_cart: function (product_id) {

                let access_token = this.$store.state.app_user.access_token;

                if(!access_token && !this.$store.state.must_be_signed_in) {
                    access_token = localStorage.getItem('lvlacc');
                }

                if (access_token) {
                    const options = {
                        headers: {
                            'authorization': access_token
                        }
                    }
                    axios.get(this.$store.state.api_base_url + `shoppingcart.php?f=add&pid=` + product_id + '&nocache=' + new Date().getTime(), options)
                        .then(val => {
                            this.$store.state.shoppingcart.cart = val.data;
                            this.$store.state.shoppingcart.cart_count = val.data.cart_count;
                        })
                        .catch()
                }
            },


            updateproduct: function (productid, qty, plusminusdelete) {

                let access_token = this.$store.state.app_user.access_token;

                if(!access_token && !this.$store.state.must_be_signed_in) {
                    access_token = localStorage.getItem('lvlacc');
                }

                if (access_token) {
                    const options = {
                        headers: {
                            'authorization': access_token
                        }
                    }

                    if (plusminusdelete === 'plus') {
                        this.qtyplusone = qty + 1;
                    }
                    if (plusminusdelete === 'minus') {
                        this.qtyplusone = qty - 1;
                        if (this.qtyplusone < 0) {
                            this.qtyplusone = 0;
                        }
                    }
                    if (plusminusdelete === 'zero') {
                        this.qtyplusone = 0;
                    }
                    axios.get(this.$store.state.api_base_url + `shoppingcart.php?f=update&pid=` + productid + '&qty=' + this.qtyplusone + '&nocache=' + new Date().getTime(), options)
                        .then(val => {
                            this.$store.state.shoppingcart.cart = val.data;
                            this.$store.state.shoppingcart.cart_count = val.data.cart_count;

                        })
                        .catch()
                }
            },
        },
    }
</script>
