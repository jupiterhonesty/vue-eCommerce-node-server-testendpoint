<template>
    <div class="signin">
        <div v-if="!signedIn">
            <amplify-authenticator></amplify-authenticator>
        </div>
        <div v-if="signedIn">
            <amplify-sign-out></amplify-sign-out>
        </div>
    </div>
</template>

<script>
    import { Auth } from 'aws-amplify'
    import { AmplifyEventBus } from 'aws-amplify-vue';

    export default {
        name: 'SignIn',
        data() {
            return {
                login: '',
                password: '',
            }
        },
        props: {
            msg: String,
        },
        created(){
            this.findUser();
            AmplifyEventBus.$on('authState', info => {
                if(info === "signedIn") {
                    this.findUser();
                } else {
                    this.$store.state.web_user.authenticated = false;
                    this.$store.state.web_user.user = null;
                }
            });
        },
        computed: {
            signedIn(){
                return this.$store.state.web_user.authenticated;
            }
        },
        methods: {
            async findUser() {
                try {
                    const user = await Auth.currentAuthenticatedUser();
                    this.$store.state.web_user.authenticated = true;
                    this.$store.state.web_user.user = user;
                    this.$store.state.app_user.authenticated = false;
                }
                catch(err) {
                    this.$store.state.web_user.authenticated = false;
                    this.$store.state.web_user.user = null;
                }
            }
        }
    }
</script>