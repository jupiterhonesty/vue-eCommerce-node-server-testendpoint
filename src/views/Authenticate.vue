<template>
    <div class="authenticate">
        <SignIn msg="Welcome to Authenticate"/>
    </div>
</template>

<script>
    // @ is an alias to /src
    import SignIn from '@/components/SignIn.vue'

    export default {
        name: 'signin',
        components: {
            SignIn
        }
    }
</script>
