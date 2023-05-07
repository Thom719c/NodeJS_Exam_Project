<script>
    import { onMount } from "svelte";
    import {
        session,
        serverURL,
        serverEndpoints,
    } from "../../stores/stores.js";
    import toast, { Toaster } from "svelte-french-toast";
    import Cookies from "js-cookie";

    let games = [];

    onMount(async () => {
        const url = $serverURL + $serverEndpoints.authentication.ownedGame;
        const response = await fetch(url, { credentials: "include" });
        const data = await response.json();
        console.log(data);
        games = data.data;
    });
</script>

<Toaster />

<div class="container-fluid">
    <div class="row">
        <div class="col-sm-6 col-xs mx-auto content-box">
            <div class="col-lg-12 my-4 title text-gradient">
                The games you own {$session.user.gamertag}
            </div>

            <div class="col-lg-12 my-4">
                {#if games}
                    <ul>
                        {#each games as game}
                            <li class="game">
                                <img
                                    class="game-img"
                                    src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.steam_app_id}/header.jpg`}
                                    alt={`Cover image for ${game.name}`}
                                />
                                <p class="game-p">{game.game_name}</p>
                            </li>
                        {/each}
                    </ul>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    .title {
        text-align: center;
        font-size: 30px;
        letter-spacing: 2px;
        font-weight: bold;
        color: #ecf0f5;
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
