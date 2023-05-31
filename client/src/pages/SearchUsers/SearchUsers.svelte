<script>
    import { onMount } from "svelte";
    import { serverURL, serverEndpoints } from "../../stores/stores.js";
    import defaultProfileImage from "../../assets/profileDefault.png";
    import { useNavigate } from "svelte-navigator";

    const navigate = useNavigate();

    let users = [];
    let filteredUsers = [];
    let searchQuery = "";

    onMount(async () => {
        const url = $serverURL + $serverEndpoints.user.searchUsers;
        const response = await fetch(url, { credentials: "include" });
        const data = await response.json();
        users = data.data;
    });

    const searchUsers = () => {
        filteredUsers = users.filter((user) => {
            const query = searchQuery.toLowerCase();
            const isMatch = user.name.toLowerCase().includes(query);
            return isMatch;
        });
    };

    const showImage = (avatar) => {
        if (!avatar) {
            return defaultProfileImage;
        }

        return `${$serverURL}/images/avatar/${avatar}`;
    };

    const goToUser = (user) => {
        searchQuery = "";
        navigate(`/profile/${user.gamertag}`, { replace: true });
    };

    const goToAllUserPage = () => {
        navigate(`/users/${searchQuery}`, { replace: true });
        searchQuery = "";
    };

    function handleKeyPress(event) {
        if (event.key === "Enter") {
            goToAllUserPage();
        }
    }
</script>

<div class="search-bar">
    <input
        class="search-input"
        type="text"
        placeholder="Search..."
        bind:value={searchQuery}
        on:input={searchUsers}
        on:keydown={handleKeyPress}
    />
    {#if searchQuery !== "" && filteredUsers.length > 0}
        <div class="suggestions">
            {#each filteredUsers as user}
                <div
                    class="card"
                    on:click={() => goToUser(user)}
                    on:keydown={() => goToUser(user)}
                >
                    <img
                        class="avatar"
                        src={showImage(user.profile_image)}
                        alt={user.name}
                    />
                    <span>{user.name}</span>
                </div>
            {/each}
        </div>
    {/if}
    <button class="search-button me-4" on:click={goToAllUserPage}>
        <i class="bi bi-search" />
    </button>
</div>

<style>
    .search-bar {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
        position: relative;
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

    .suggestions {
        position: absolute;
        top: 100%;
        left: 5px;
        right: 0;
        max-width: 190px;
        background-color: #67c2dd41;
        border: 1px solid #e5e047;
        border-top: none;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        max-height: 200px;
        overflow-y: auto;
    }

    .card {
        display: flex;
        align-items: center;
        padding: 8px;
        cursor: pointer;
    }

    .card:hover {
        background-color: rgba(71, 135, 155, 0.255);
    }

    .avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 8px;
    }
</style>
