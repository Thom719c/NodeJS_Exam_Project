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

<div class="container content-box">
    {#if game}
        <h1>{game.name}</h1>
        <Game src={game.src} />
    {/if}
</div>

<style>
    .container {
        flex: 1;
    }
</style>
