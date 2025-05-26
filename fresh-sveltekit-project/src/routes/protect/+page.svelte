<script lang="ts">
    import type { PageData } from './$types';
    export let data: PageData;
</script>

<h1>Protected Page</h1>

<div class="content">
    <p>This is a protected page that requires authentication.</p>

    <div class="user-details">
        <h2>User Details</h2>
        <p><strong>Name:</strong> {data.user.name}</p>
        <p><strong>Email:</strong> {data.user.email}</p>
        <p><strong>ID:</strong> {data.user.id}</p>
    </div>

    <a href="/logout" class="logout-button">Logout</a>
</div>

<style>
    .content {
        max-width: 600px;
        margin: 2rem auto;
    }

    .user-details {
        background-color: #f5f5f5;
        padding: 1.5rem;
        border-radius: 8px;
        margin: 2rem 0;
    }

    .user-details h2 {
        margin-top: 0;
    }

    .logout-button {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background-color: #dc3545;
        color: white;
        text-decoration: none;
        border-radius: 4px;
    }

    .logout-button:hover {
        background-color: #c82333;
    }
</style>