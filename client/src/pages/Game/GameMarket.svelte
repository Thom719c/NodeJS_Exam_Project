<script>
    import { onMount } from "svelte";
    import { link, useNavigate, useLocation } from "svelte-navigator";

    const navigate = useNavigate();
    const location = useLocation();

    let games = [];
    let currentPage = 1;
    let pageSize = "10";
    let searchParam;
    let isImage = true;

    onMount(async () => {
        const params = new URLSearchParams($location.search);
        currentPage = parseInt(params.get("page")) || 1;
        updateURL();
        await fetchGames();
    });

    const fetchGames = async () => {
        // `https://api.steampowered.com/ISteamApps/GetAppList/v2/`                     // All games
        // `https://store.steampowered.com/api/appdetails?appids=${appid}&l=english`    // Gets games information by appid and in english
        // `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`        // Gets image by appid
        const url = `http://localhost:3000/api/gameMarket${searchParam}?page=${currentPage}&pageSize=${pageSize}`;
        const response = await fetch(url);
        const data = await response.json();
        games = data;
    };

    const nextPage = () => {
        currentPage += 1;
        updateURL();
        fetchGames();
    };

    const previousPage = () => {
        if (currentPage > 1) {
            currentPage -= 1;
            updateURL();
            fetchGames();
        }
    };
    const handlePageChange = () => {
        if (currentPage != 0) {
            updateURL();
            fetchGames();
        }
    };

    const updateURL = () => {
        navigate(`?page=${currentPage}`);
    };

    const handleFetchGames = () => {
        fetchGames();
    };
</script>

<h1>List of Games</h1>

<div class="container-fluid">
    <div class="search-bar mb-2">
        <input
            class="search"
            type="text"
            bind:value={searchParam}
            placeholder="Search..."
            on:change={handleFetchGames}
        />
        <button class="search me-4" on:click={handleFetchGames}
            ><i class="bi bi-search" /></button
        >
    </div>

    <label for="pageSize">Games per Page:</label>
    <select
        class="pageSize"
        id="pageSize"
        bind:value={pageSize}
        on:change={handleFetchGames}
    >
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
    </select>
</div>

<ul>
    {#each games as game}
        <a href={`/gameInfo?appid=${game.appid}`} use:link>
            <li class="game">
                <img
                    class="game-img"
                    src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`}
                    alt={`Cover image for ${game.name}`}
                />
                <p class="game-p">{game.name}</p>
            </li>
        </a>
    {/each}
</ul>

<div class="pagination my-4">
    <button
        class="pagination-button"
        on:click={previousPage}
        disabled={currentPage === 1}
    >
        Previous
    </button>
    <input
        class="pageChange"
        bind:value={currentPage}
        on:change={handlePageChange}
    />
    <button class="pagination-button" on:click={nextPage}> Next </button>
</div>

<style>
    h1 {
        font-size: 32px;
        text-align: center;
        margin: 24px 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    li {
        background-color: rgba(48, 76, 96, 0.9);
        color: #c6d4df;
        margin: 10px;
        width: 400px;
        height: 200px;
        transition: transform 0.2s ease-in-out;
    }
    li:hover {
        transform: translateY(-5px);
    }

    .game {
        display: flex;
        align-items: center;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }
    .game-img {
        width: 150px;
        height: 150px;
        margin: 0 10px;
    }
    .game-p {
        font-size: 18px;
        text-align: center;
    }

    .pagination {
        display: flex;
        justify-content: center;
    }

    .pagination-button {
        background-color: rgba(48, 76, 96, 0.9);
        border-color: #e5e047;
        padding: 8px 16px;
        font-size: 14px;
        border-radius: 4px;
        margin: 0 5px;
        width: 100px;
        transition: background-color 0.3s;
    }

    .pagination-button:hover {
        background-color: rgba(71, 135, 155, 0.255);
    }

    .pagination-button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    .pageChange {
        background-color: rgba(48, 76, 96, 0.9);
        border-color: #e5e047;
        padding: 8px 16px;
        font-size: 14px;
        border-radius: 4px;
        margin: 0 5px;
        max-width: 50px;
        text-align: center;
    }

    .search-bar {
        display: flex;
        justify-content: end;
        align-items: center;
        gap: 5px;
    }

    .search {
        display: flex;
        align-items: center;
        height: 35px;
        background-color: rgba(48, 76, 96, 0.9);
        border-color: #e5e047;
        border-radius: 10px;
        padding: 5px 10px;
    }

    .search::placeholder {
        color: #d1d1d1e6;
    }

    .pageSize {
        background-color: #67c2dd41;
        border-color: #e5e047;
        border-radius: 5px;
    }

    option {
        color: black;
    }
</style>
