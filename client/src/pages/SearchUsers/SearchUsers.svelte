<script>
    import { onMount } from "svelte";
    import {
        session,
        serverURL,
        serverEndpoints,
    } from "../../stores/stores.js";
    import toast, { Toaster } from "svelte-french-toast";

    let users = [];
    let filteredUsers = [];
    let searchQuery = "";

    onMount(async () => {
        const url = $serverURL + $serverEndpoints.user.searchUsers;
        const response = await fetch(url, { credentials: "include" });
        const data = await response.json();
        users = data.data;
        console.log(users)
    });

    const searchUsers = () => {
        filteredUsers = users.filter((user) => {
            const query = searchQuery.toLowerCase();
            const isMatch = user.name.toLowerCase().includes(query);
            return isMatch;
        });
        console.log(filteredUsers)
    };
</script>

<Toaster />

<div class="search-bar">
    <input
        class="search-input"
        type="text"
        bind:value={searchQuery}
        placeholder="Search..."
        on:change={searchUsers}
    />
    <button class="search-button me-4" on:click={searchUsers}
        ><i class="bi bi-search" /></button
    >
</div>

<style>
    .search-bar {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
    }
    .search-button,
    .search-input {
        display: flex;
        align-items: center;
        height: 25px;
        background-color: rgba(48, 76, 96, 0.9);
        border-color: #e5e047;
        border-radius: 10px;
        padding: 5px 10px;
    }

    .search-input {
        width: 200px;
    }

    .search-input::placeholder {
        color: #d1d1d1e6;
    }
</style>
