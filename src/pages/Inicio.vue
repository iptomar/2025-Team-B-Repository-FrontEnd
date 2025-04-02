<script>
import { useRouter } from 'vue-router';

export default {
    setup() {
        const router = useRouter();

        const logout = () => {
            localStorage.removeItem('token');
            router.push('/');
        };

        return { logout };
    },
};
</script>

<template>
    <div>
        <h1>Início</h1>
    </div>
</template>