<script>
    import { onMount } from "svelte";
    import {
        serverURL,
        serverEndpoints,
        selectedGame,
    } from "../../stores/stores.js";
    import { useNavigate, useParams } from "svelte-navigator";
    import GameEmbed from "../../components/Game/GameEmbed.svelte";
    import { SyncLoader } from "svelte-loading-spinners";

    let game;
    const navigate = useNavigate();
    const params = useParams();

    onMount(() => {
        game = $selectedGame;
        fetchGame();
    });

    async function fetchGame() {
        const url = `${$serverURL}/games/${$params.id}`;
        const response = await fetch(url, { credentials: "include" });
        const data = await response.json();
        if (response.ok) {
            game = data.data[0];
        } else {
            console.log("error");
        }
    }

    const goBackToProfile = () => {
        navigate("/games");
    };
</script>

{#if game}
    <div class="container content-box">
        <div class="header my-2">
            <button class="back-button" on:click={goBackToProfile}>
                Go Back
            </button>
            <h1>{game.name}</h1>
        </div>
        <GameEmbed src={game.src} />
    </div>
{:else}
    <div class="d-flex justify-content-center">
        <SyncLoader size="60" color="#FF3E00" unit="px" duration="1s" />
    </div>
{/if}

<style>
    .container {
        max-width: 960px;
        max-height: 600px;
    }
</style>
