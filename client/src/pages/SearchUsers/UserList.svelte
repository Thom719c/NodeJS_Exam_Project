<script>
    import { onMount, afterUpdate } from "svelte";
    import {
        session,
        serverURL,
        serverEndpoints,
    } from "../../stores/stores.js";
    import { useNavigate, useLocation } from "svelte-navigator";
    import toast from "svelte-french-toast";
    import Users from "../../components/Users/Users.svelte";

    const navigate = useNavigate();
    const location = useLocation();

    let users = [];
    let friends = [];
    let filteredUsers = [];
    let searchQuery = "";

    onMount(async () => {
        checkFriendslist();
        searchQuery = $location.pathname.split("/").pop();
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

    const checkFriendslist = async () => {
        const url = $serverURL + $serverEndpoints.user.friendlist;
        const response = await fetch(url, { credentials: "include" });
        const data = await response.json();
        if (response.ok) {
            friends = data.data;
        } else {
            toast.error(data.message, {
                duration: 5000,
                position: "bottom-right",
                style: "border-radius: 200px; background: #333; color: #fff;",
            });
        }
    };

    afterUpdate(() => {
        searchQuery = $location.pathname.split("/").pop();
        searchUsers();
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
