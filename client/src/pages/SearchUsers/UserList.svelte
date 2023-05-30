<script>
    import { onMount, afterUpdate } from "svelte";
    import {
        session,
        serverURL,
        serverEndpoints,
    } from "../../stores/stores.js";
    import { useNavigate, useParams } from "svelte-navigator";
    import Users from "../../components/Users/Users.svelte";

    const navigate = useNavigate();
    const params = useParams();

    let users = [];
    let friends = [];
    let filteredUsers = [];
    let searchQuery = "";

    onMount(async () => {
        searchQuery = $params.searchQuery;
        const url = $serverURL + $serverEndpoints.user.searchUsers;
        const response = await fetch(url, { credentials: "include" });

        if (response.ok) {
            const data = await response.json();
            users = data.data;
            searchUsers();
        } else {
            console.error("Failed to get users:");
        }
    });

    afterUpdate(async () => {
        const newSearchQuery = $params.searchQuery;
        if (searchQuery !== newSearchQuery || filteredUsers.length === 0) {
            searchQuery = newSearchQuery;
            searchUsers();
        }
    });

    const searchUsers = () => {
        filteredUsers = users.filter((user) => {
            const query = searchQuery.toLowerCase();
            const isMatch = user.name.toLowerCase().includes(query);
            return isMatch;
        });
    };
</script>

<h1 class="page-title">Users</h1>

<div class="users">
    {#each filteredUsers as user}
        <Users {user} {friends} />
    {/each}
</div>

<style>
    .page-title {
        font-size: 32px;
        text-align: center;
        margin: 24px 0;
        color: #c6d4df;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .users {
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 20px;
        justify-items: center;
        margin: 20px;
    }
</style>
