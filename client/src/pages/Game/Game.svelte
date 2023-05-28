<script>
    import { onMount } from "svelte";
    import { useNavigate } from "svelte-navigator";
    import { selectedGame } from "../../stores/stores.js";
    import Game from "../../components/Game/Game.svelte";

    let game;
    const navigate = useNavigate();

    onMount(() => {
        game = $selectedGame;
        console.log(game);
    });

    const goBackToProfile = () => {
        navigate("/games");
    };
</script>

<div class="container game-box">
    {#if game}
        <div class="header my-2">
            <button class="back-button" on:click={goBackToProfile}>
                Go Back
            </button>
            <h1>{game.name}</h1>
        </div>
        <Game src={game.src} />
    {/if}
</div>

<style>
    .container {
        flex: 1;
        max-width: 960px;
        max-height: 600px;
    }

    .game-box {
        margin-top: 75px;
        background: rgba(48, 76, 96, 0.9);
        text-align: center;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
        border-radius: 15px;
        border: 1px solid #ccc;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .back-button {
        background-color: #67c2dd41;
        border-color: #e5e047;
        font-weight: bold;
        font-size: 14px;
        padding: 6px 12px;
        letter-spacing: 1px;
    }

    .back-button:hover {
        background-color: rgba(71, 135, 155, 0.255);
    }
</style>
