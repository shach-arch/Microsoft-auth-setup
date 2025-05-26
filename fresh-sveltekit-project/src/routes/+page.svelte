<script lang="ts">
    import { page } from '$app/stores';
</script>

<h1>Welcome to SvelteKit Microsoft Auth Demo</h1>

{#if $page.data.user}
    <p>You are logged in as <strong>{$page.data.user.name}</strong></p>
    <p>Email: {$page.data.user.email}</p>
    <a href="/protected" class="button">Go to Protected Page</a>
{:else}
    <p>Please log in to access protected content.</p>
    <a href="/login" class="button">Login with Microsoft</a>
{/if}

<style>
    h1 {
        color: #333;
    }

    .button {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        margin-top: 1rem;
    }

    .button:hover {
        background-color: #0056b3;
    }
</style>