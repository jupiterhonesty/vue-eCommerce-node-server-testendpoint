<template>
    <div class="account">
        <h1>This is your account page for us testing the end points</h1>

        <div v-if="app_signed_in">
        App signed In<br />
        {{user_json}}
        <br />
        {{longitude_latitude}}
        </div>

        <div v-if="web_signed_in">
            Logged in web with user:
            {{user_json}}
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
        app_signed_in: function () {
            return this.$store.state.app_user.authenticated;
        },
        web_signed_in: function () {
            return this.$store.state.web_user.authenticated;
        },
        longitude_latitude: function () {
            return "Location: " + this.$store.state.app_user.longitude + " / " + this.$store.state.app_user.latitude;
        },
        user_json: function () {
            if(this.$store.state.app_user.authenticated) {
                return this.$store.state.app_user.user;
            }
            if(this.$store.state.web_user.authenticated) {
                return this.$store.state.web_user.user.username;
            }
            return '';
        },
    },

    mounted() {

        if(this.$store.state.app_user.access_token) {

            const options = {
                headers: {
                    'authorization': this.$store.state.app_user.access_token
                }
            };

            axios.get(this.$store.state.api_base_url + `/account.php`+ '?nocache=' + new Date().getTime(), options)
                .then(val => {
                    this.$store.state.app_user.user = val.data
                    this.$store.state.app_user.temp_user = false;

                    if (this.$store.state.app_user.user && !this.$store.state.products.loaded) {

                        // Load the products
                        axios.get(this.$store.state.api_base_url + `productlist.php` + '?nocache=' + new Date().getTime(), options)
                            .then(val => {
                                this.$store.state.products.listing = val.data;
                                this.$store.state.products.loaded = true;
                            })
                            .catch()

                        // Load shoppingcart
                        axios.get(this.$store.state.api_base_url + `shoppingcart.php?f=get` + '&nocache=' + new Date().getTime(), options)
                            .then(val => {
                                this.$store.state.shoppingcart.cart = val.data
                                this.$store.state.shoppingcart.cart_count = val.data.cart_count
                            })
                            .catch()
                    }
                })
                .catch()
            }
            else {

            if (!this.$store.state.must_be_signed_in) {

                let nlp_code = localStorage.getItem('lvlacc');

                if (!nlp_code) {
                    nlp_code = 'newnlp';
                }

                const options = {
                    headers: {
                        'authorization': nlp_code
                    }
                };

                axios.get(this.$store.state.api_base_url + `productlist.php` + '?nocache=' + new Date().getTime(), options)
                    .then(val => {
                        this.$store.state.products.listing = val.data;
                        this.$store.state.products.loaded = true;
                        this.$store.state.app_user.temp_user = true;

                        if (this.$store.state.products.listing.nlp !== nlp_code) {
                            localStorage.setItem('lvlacc', this.$store.state.products.listing.nlp);
                        }
                    })
                    .catch()

                axios.get(this.$store.state.api_base_url + `shoppingcart.php?f=get` + '&nocache=' + new Date().getTime(), options)
                    .then(val => {
                        this.$store.state.shoppingcart.cart = val.data
                        this.$store.state.shoppingcart.cart_count = val.data.cart_count
                    })
                    .catch()
            }
            else {
                this.$router.push({name: 'home'});
            }
        }
    },

    }
</script>
