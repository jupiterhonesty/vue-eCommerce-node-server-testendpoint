<template>
    <div class="orderhistory">
        <br />
        <button v-on:click="get_order_history">Get order history</button>
        <br />
        <br />
        <div v-for="order in order_history" v-bind:key="order.internal_order_id">
           internal order id =  {{order.internal_order_id}}
            <br />
            order date = {{order.order_date}} delivery date = {{order.delivery_date}} customer order# {{order.order_data.ordernumber}}
            <br />
            <br />
            <div v-for="item in order.order_data.items" v-bind:key="item.id">
                {{item.qty}} x  {{item.desc}} id: {{item.id}} unit {{ item.single_price_show }} rebate {{item.discount_qty_amount_show}} coupon-code  {{item.discount_code}} total {{item.discounted_qty_price_show}}<br />
            </div>
            <br />

<!--            use this to show all details instead -->
<!--            <div v-for="tax_total_line in order.order_data.taxtotallines" v-bind:key="tax_total_line.text">-->
<!--                {{tax_total_line.text}}  {{tax_total_line.value_show}}-->
<!--                <br />-->
<!--            </div>-->

            <div v-for="tax_web_line in order.order_data.web_total_lines" v-bind:key="tax_web_line.text">
                {{tax_web_line.text}}  {{tax_web_line.value_show}}
                <br />
            </div>
            <br />
            (i) Information details button:
            <div v-for="tax_web_detail in order.order_data.web_total_details" v-bind:key="tax_web_detail.text">
                {{tax_web_detail.text}} * {{tax_web_detail.value_show}} * {{tax_web_detail.description}} * {{tax_web_detail.type}}
                <br />
            </div>
            <br />

            *******************
            <br />
            <br />
        </div>
    </div>
</template>

<script>

    import axios from 'axios';

    export default {
        data() {
            return {
                orderhistory_data: null,
            }
        },
        computed: {
            order_history: function () {
                return this.orderhistory_data;
            },

        },
        methods: {
            get_order_history: function () {
                if(this.$store.state.app_user.access_token) {
                    const options = {
                        headers: {
                            'authorization': this.$store.state.app_user.access_token
                        }
                    };
                    axios.get(this.$store.state.api_base_url + `/orderhistory.php`+ '?f=get&limit=3&nocache=' + new Date().getTime(), options)
                        .then(val => {
                            this.orderhistory_data = val.data
                        })
                        .catch()
                }
            },
        }
    }
</script>
