<script lang="ts">
  import { page } from '$app/stores';
  // Remove this line: import '../app.css';
</script>

<nav>
  <div class="nav-container">
    <div class="nav-links">
      <a href="/" class:active={$page.url.pathname === '/'}>Home</a>
      {#if $page.data.user}
        <a href="/protected" class:active={$page.url.pathname === '/protected'}>Protected</a>
        <a href="/logout">Logout</a>
      {:else}
        <a href="/login" class:active={$page.url.pathname === '/login'}>Login</a>
      {/if}
    </div>
    {#if $page.data.user}
      <span class="user-info">Welcome, {$page.data.user.name}!</span>
    {/if}
  </div>
</nav>

<main>
  <slot />
</main>

<style>
  nav {
    background-color: #f0f0f0;
    padding: 1rem;
    margin-bottom: 2rem;
  }

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-links {
    display: flex;
    gap: 1rem;
  }

  a {
    text-decoration: none;
    color: #333;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  a:hover {
    background-color: #e0e0e0;
  }

  a.active {
    background-color: #007bff;
    color: white;
  }

  .user-info {
    color: #666;
  }

  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
</style>