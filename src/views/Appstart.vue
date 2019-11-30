<template>
    <div>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        mounted() {
            if (this.$route.query.c) {
                axios.get(this.$store.state.api_base_url + 'startweb.php?to=' + this.$route.query.t + '&cs=' + this.$route.query.c)
                    .then(val => {
                        this.$store.state.app_user.access_token  = val.data.appat;
                        this.$store.state.app_user.longitude     = val.data.longitude;
                        this.$store.state.app_user.latitude      = val.data.latitude;
                        this.$store.state.app_user.authenticated = true;
                        this.$store.state.web_user.authenticated = false;

                        this.$router.push({name: 'account'});
                    })
                    .catch(this.$router.push({name: 'home'})) // if code wrong or missing or expired, go to home page
            } else {

                // todo: this doesnt work with must_be_signed_in = false, shows account page and not home etc.
                if(!this.$store.state.must_be_signed_in) {
                    this.$router.push({name: 'account'});
                }
                else {
                    this.$router.push({name: 'home'});
                }

            }
        }
    }
</script>
