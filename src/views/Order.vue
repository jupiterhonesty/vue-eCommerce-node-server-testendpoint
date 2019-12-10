<template>
  <div class="testorder">
    <div v-if="this.order_sent === 0">
      Not authorized
    </div>

    <div v-if="this.order_sent === 1">
      <h1>Place Order (popup)</h1>
      Estimated Delivery time: {{web_delivery_estimate}}
      <br />
      <br />
      <!--            {{longitude_latitude}} for {{user_name}}-->
      Todo: Search address field and special instructions here
      <br />
      <br />

      <div v-if="shopping_cart_count">
        <div v-for="item in shoppingcartitems" v-bind:key="item.id">
          {{item.qty}} x  {{item.desc}} id: {{item.id}} unit {{ item.single_price_show }} rebate {{item.discount_qty_amount_show}} total {{item.discounted_qty_price_show}}<br />
            <br />
        </div>

<!--        <div v-for="tax_total_line in tax_total_lines" v-bind:key="tax_total_line.text">-->
<!--          {{tax_total_line.text}}  {{tax_total_line.value_show}}-->
<!--          <br />-->
<!--        </div>-->

        <br />
        <div v-for="tax_web_line in web_total_lines" v-bind:key="tax_web_line.text">
          {{tax_web_line.text}}  {{tax_web_line.value_show}}
          <br />
        </div>
        <br />
       {{ web_total_title}} (info DETAILS)
        <br/>
        <div v-for="tax_web_line in web_total_details" v-bind:key="tax_web_line.text">
          {{tax_web_line.text}} * {{tax_web_line.value_show}} * {{tax_web_line.description}} * {{tax_web_line.type}}
          <br />
        </div>
        <br />
        {{ web_total_legal_text}}
        <br />
       {{ web_total_legal_url}}
        <br />
        <br />


        Chosen payment type : {{payment_type_text}}  <button v-on:click="switch_payment_method(switch_payment_option)">{{payment_switch_text}}</button>

        <br />

        <button v-on:click="send_shoppingcart_order">Place Shopping cart Order</button>

      </div>
      <div v-if="!shopping_cart_count">
        Your shopping cart is empty
      </div>
    </div>

    <div v-if="this.order_sent === 2">
      Please wait ...
    </div>

    <div v-if="this.order_sent === 3">
      {{thank_you_answer}}
      <br />
      <br />
      Order confirmation:
      <br />
      <br />
      <div v-for="order in this.last_order" v-bind:key="order.internal_order_id">
        internal order id =  {{order.internal_order_id}}
        <br />
        order date = {{order.order_date}} customer order# {{order.order_data.ordernumber}}
        <br />
        <br />
        <div v-for="item in order.order_data.items" v-bind:key="item.id">
          {{item.qty}} x  {{item.desc}} id: {{item.id}} unit {{ item.single_price_show }} rebate {{item.discount_qty_amount_show}} coupon-code  {{item.discount_code}} total {{item.discounted_qty_price_show}}<br />
        </div>
        <br />
        <div v-for="tax_total_line in order.order_data.taxtotallines" v-bind:key="tax_total_line.text">
          {{tax_total_line.text}}  {{tax_total_line.value_show}}
          <br />
        </div>
        <br />
      </div>


      <a v-bind:href="this.app_link">Open App again</a>
    </div>

  </div>
</template>

<script>

    import axios from 'axios';

    export default {
        data() {
            return {
                order_sent: 0,
                thank_you: null,
                order_status: null,
                app_link: null,
                qtyplusone: 0,
              order_id: null,
              last_order: null,
            }
        },
        computed: {
            longitude_latitude: function () {
                return "Location: " + this.$store.state.app_user.longitude + " / " + this.$store.state.app_user.latitude;
            },
            shoppingcartitems: function () {
                return this.$store.state.shoppingcart.cart.items;
            },
            shopping_cart_count: function () {
                return this.$store.state.shoppingcart.cart_count;
            },
            payment_type_text: function () {
                if(this.$store.state.shoppingcart.cart.payment_type === 2) {
                    return 'Debit Card';
                }
                return 'Cash';
            },
            payment_switch_text: function () {
                if(this.$store.state.shoppingcart.cart.payment_type === 2) {
                    return 'Switch to Cash';
                }
                return 'Switch to Debit Card';
            },
            switch_payment_option: function () {
                if(this.$store.state.shoppingcart.cart.payment_type === 2) {
                    return 1;
                }
                return 2;
            },
            tax_total_lines: function () {
                return this.$store.state.shoppingcart.cart.taxtotallines;
            },

            web_total_lines: function () {
              return this.$store.state.shoppingcart.cart.web_total_lines;
            },
            web_total_title: function () {
              return this.$store.state.shoppingcart.cart.web_total_title;
            },
            web_total_details: function () {
              return this.$store.state.shoppingcart.cart.web_total_details;
            },
            web_total_legal_text: function () {
              return this.$store.state.shoppingcart.cart.web_total_legal_text;
            },
            web_total_legal_url: function () {
              return this.$store.state.shoppingcart.cart.web_total_legal_url;
            },
            web_delivery_estimate: function () {
              return this.$store.state.shoppingcart.cart.web_delivery_estimate;
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
            thank_you_answer: function () {
                return this.thank_you;
            },
            order_id_confirmed: function () {
            return this.order_id;
          },
        },
        mounted() {
            if(this.$store.state.app_user.access_token || this.$store.state.app_user.temp_user) {
                this.order_sent = 1;
            } else {
                this.order_sent = 0;
            }
            this.thank_you =  null;
            this.order_status = null;
            this.app_link = null;
            this.last_order = null;
        },

        methods: {
            switch_payment_method: function (to_payment_type) {
                if (this.$store.state.app_user.user) {
                    const options = {
                        headers: {
                            'authorization': this.$store.state.app_user.access_token
                        }
                    }
                    axios.get(this.$store.state.api_base_url + `shoppingcart.php?f=setpayment&pmtid=` + to_payment_type + '&nocache=' + new Date().getTime(), options)
                        .then(val => {
                            if(val.data.cart_count > 0) {
                                this.$store.state.shoppingcart.cart = val.data;
                            }
                        })
                        .catch()
                }
            },
            send_shoppingcart_order: function (event) {
                if (event) {
                    this.order_sent = 2; // please wait
                    if (this.$store.state.app_user.user) {
                        const options = {
                            headers: {
                                'authorization': this.$store.state.app_user.access_token
                            }
                        }
                        axios.get(this.$store.state.api_base_url + `shoppingcart.php?f=placeorder` + '&long='+ this.$store.state.app_user.longitude + '&lat=' + this.$store.state.app_user.latitude +  '&nocache=' + new Date().getTime(), options)
                            .then(val => {
                                this.order_sent = 3;
                                this.order_status = val.data;

                                if(this.order_status.status === "OK") {
                                    this.thank_you = "Your shopping cart order was placed!";
                                    this.order_id = this.order_status.order_id;
                                    this.app_link = "highland://?confirmation=1312";
                                } else {
                                    this.thank_you = "Problem with your shopping cart order! ";
                                }
                                this.$store.state.shoppingcart.cart = [];
                                this.$store.state.shoppingcart.cart_count = null;


                              axios.get(this.$store.state.api_base_url + `/orderhistory.php`+ '?f=get' + '&orderid=' + this.order_id + '&nocache=' + new Date().getTime(), options)
                                      .then(val => {
                                        this.last_order = val.data
                                      })
                                      .catch()

                            })
                            .catch()
                    }
                }
            },

        }
    }
</script>
