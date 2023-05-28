<script>
    import { onMount } from "svelte";
    import { selectedGame } from "../../stores/stores.js";
    import Game from "../../components/Game/Game.svelte";

    let game;

    onMount(() => {
        game = $selectedGame;
        console.log(game);
    });
</script>

<div class="container game-box">
    {#if game}
        <h1>{game.name}</h1>
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
</style>
