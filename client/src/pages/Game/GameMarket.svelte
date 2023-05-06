<script>
    import { onMount } from "svelte";
    import { link } from "svelte-navigator";
    
    let games = [];

    onMount(async () => {
        // `https://api.steampowered.com/ISteamApps/GetAppList/v2/`                     // All games
        // `https://store.steampowered.com/api/appdetails?appids=${appid}&l=english`    // Gets games information by appid and in english
        // `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`        // Gets image by appid
        const response = await fetch("http://localhost:3000/api/gameMarket");
        const data = await response.json();
        games = data.applist.apps
            .filter((game) => {
                return (
                    game.name !== "" &&
                    game.name !== "test2" &&
                    game.name !== "test3"
                );
            })
            .slice(1, 50); // limit to first 50 games for demo purposes
    });
</script>

<h1>List of Games</h1>
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
</style>
