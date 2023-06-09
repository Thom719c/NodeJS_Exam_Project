<script>
    import { onMount } from "svelte";
    import {
        session,
        serverURL,
        serverEndpoints,
    } from "../../stores/stores.js";
    import toast from "svelte-french-toast";
    import { useNavigate, useParams } from "svelte-navigator";
    import { addToOwnedGame } from "../../components/FetchingService/GameListUtils.js";

    let games = [];
    const navigate = useNavigate();
    const params = useParams();

    onMount(async () => {
        const url =
            $serverURL + $serverEndpoints.user.wishlist + $params.gamertag;
        const response = await fetch(url, { credentials: "include" });
        const data = await response.json();
        games = data.data;
    });

    const moveGameToOwned = async (game) => {
        // Perform the logic to move the game to the owned games list
        addToOwnedGame(game.steam_app_id, game.game_name);
        // Show a toast message after successful move
        toast.success(`Game "${game.game_name}" moved to Owned Games.`, {
            duration: 5000,
            position: "bottom-right",
            style: "border-radius: 200px; background: #333; color: #fff;",
        });
        removeGameFromWishlist(game, true);
    };

    const removeGameFromWishlist = async (game, moved) => {
        const url = $serverURL + $serverEndpoints.user.wishlist;
        const removeGame = {
            steamAppId: game.steam_app_id,
            name: game.game_name,
        };
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(removeGame),
            credentials: "include",
        });

        if (response.ok) {
            games = games.filter(
                (g) => g.steam_app_id !== removeGame.steamAppId
            );
            if (!moved) {
                toast.success(
                    `Game "${game.game_name}" removed from Wishlist.`,
                    {
                        duration: 5000,
                        position: "bottom-right",
                        style: "border-radius: 200px; background: #333; color: #fff;",
                    }
                );
            }
        } else {
            toast.error("Failed to remove the game from Wishlist.", {
                duration: 5000,
                position: "bottom-right",
                style: "border-radius: 200px; background: #333; color: #fff;",
            });
        }
    };

    const goBackToProfile = () => {
        if ($params.gamertag !== $session.gamertag) {
            navigate("/profile/" + $params.gamertag);
            return;
        }
        navigate("/profile");
    };
</script>

<div class="container">
    <div class="header my-4">
        <button class="back-button" on:click={goBackToProfile}>
            Go Back
        </button>
        <h2 class="title text-gradient">
            Your wishlist {$params.gamertag}
        </h2>
    </div>

    {#if games.length === 0}
        <div class="game">
            <p class="empty-message">Your wishlist is empty.</p>
        </div>
    {:else}
        <ul class="game-list">
            {#each games as game}
                <li class="game">
                    <div class="image-container">
                        <img
                            class="game-image"
                            src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.steam_app_id}/header.jpg`}
                            alt={`Cover image for ${game.name}`}
                        />
                    </div>
                    <div class="game-details">
                        <p class="d-flex game-name justify-content-start">
                            {game.game_name}
                        </p>
                        <div class="button-container">
                            {#if $params.gamertag === $session.gamertag}
                                <button
                                    class="move-button"
                                    on:click={() => moveGameToOwned(game)}
                                    >Move to Owned</button
                                >
                                <button
                                    class="remove-button"
                                    on:click={() =>
                                        removeGameFromWishlist(game)}
                                    >Remove</button
                                >
                            {/if}
                        </div>
                    </div>
                </li>
            {/each}
        </ul>
    {/if}
</div>

<style>
    .container {
        max-width: 800px;
        margin: 0 auto;
    }

    .title {
        text-align: center;
        font-size: 30px;
        letter-spacing: 2px;
        font-weight: bold;
        flex-grow: 1;
    }

    .empty-message {
        text-align: center;
        font-weight: 400;
        font-size: 24px;
        flex-grow: 1;
    }

    .game-list {
        list-style: none;
        padding: 0;
    }

    .game {
        display: flex;
        align-items: center;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 10px;
        margin-bottom: 10px;
        background-color: rgba(48, 76, 96, 0.9);
    }

    .image-container {
        width: 200px;
        height: 100px;
        overflow: hidden;
        border-radius: 5px;
    }

    .game-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .game-details {
        flex-grow: 1;
        margin-left: 10px;
    }

    .game-name {
        font-size: 18px;
        font-weight: bold;
        margin: 0;
        margin-bottom: 5px;
    }

    .button-container {
        display: flex;
        justify-content: flex-end;
    }

    .move-button,
    .remove-button {
        background-color: #007bff;
        color: #fff;
        border: none;
        padding: 6px 12px;
        font-size: 14px;
        border-radius: 4px;
        margin-left: 10px;
        transition: background-color 0.3s;
    }

    .move-button:hover {
        background-color: #0056b3;
    }

    .remove-button {
        background-color: #ca2323;
    }
    .remove-button:hover {
        background-color: #aa0f0f;
    }
</style>
