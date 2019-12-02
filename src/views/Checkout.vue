<template>
    <div class="testorder">

            <h1>Your Cart (popup)</h1>
            <br />
            <div v-if="shopping_cart_count">
                <div v-for="item in shoppingcartitems" v-bind:key="item.id">
                {{item.qty}} x  {{item.desc}} id: {{item.id}} unit {{ item.single_price_show }} rebate {{item.discount_qty_amount_show}} total {{item.discounted_qty_price_show}}<br />
                    <button v-on:click="updateproduct(item.id,item.qty,'plus')">Add</button>
                    <button v-on:click="updateproduct(item.id,item.qty,'minus')">Subtract</button>
                    <button v-on:click="updateproduct(item.id,item.qty,'zero')">Delete</button>
                    <br />
                    <br />
                </div>

                <!--      Please USE JSON shoping cart web_totals and not taxtotallines (depricated)-->
                
                <div v-for="tax_total_line in tax_total_lines" v-bind:key="tax_total_line.text">
                    <div v-if="tax_total_line.type !== 'topay'">
                    {{tax_total_line.text}}  {{tax_total_line.value_show}}
                        <br />
                    </div>
                </div>


                <br />
                <br />

                <div v-if="reached_medical_limit_check">
                    Legal daily limit reached: Please remove item!
                </div>
                <div v-else>
                <div v-if="medical_card_warning_check">
                    Legal limit reached: Please remove item or add Medical Card to place the order.
                </div>
                    <div v-else>
                        <router-link class="nav-link" to="/order">Checkout to order</router-link>
                    </div>
                </div>

            </div>
            <div v-if="!shopping_cart_count">
                Your shopping cart is empty
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
            longitude_latitude: function () {
                return "Location: " + this.$store.state.app_user.longitude + " / " + this.$store.state.app_user.latitude;
            },
            shoppingcart: function () {
                return this.$store.state.shoppingcart.cart;
            },
            shoppingcartitems: function () {
                return this.$store.state.shoppingcart.cart.items;
            },
            shopping_cart_count: function () {
                return this.$store.state.shoppingcart.cart_count;
            },
            medical_card_warning_check: function () {
                return this.$store.state.shoppingcart.cart.medical_card_warning;
            },
            reached_medical_limit_check: function () {
                return this.$store.state.shoppingcart.cart.reached_medical_limit;
            },
            tax_total_lines: function () {
                return this.$store.state.shoppingcart.cart.taxtotallines;
            },
            user_name: function () {
                if(this.$store.state.app_user.authenticated) {
                    return this.$store.state.app_user.user.cognitousername;
                }
                if(this.$store.state.web_user.authenticated) {
                    return this.$store.state.web_user.user.username;
                }
                return '';
            },
        },
        mounted() {

        },

        methods: {
            updateproduct: function (productid,qty,plusminusdelete) {

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

                    if(plusminusdelete === 'plus') {
                        this.qtyplusone = qty + 1;
                    }
                    if(plusminusdelete === 'minus') {
                        this.qtyplusone = qty - 1;
                        if(this.qtyplusone < 0) {
                            this.qtyplusone = 0;
                        }
                    }
                    if(plusminusdelete === 'zero') {
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
        }
    }
</script>
