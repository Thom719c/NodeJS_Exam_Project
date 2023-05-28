<script>
    import { onMount } from "svelte";
    import { useNavigate } from "svelte-navigator";
    import { selectedGame } from "../../stores/stores.js";
    import GameEmbed from "../../components/Game/GameEmbed.svelte";

    let game;
    const navigate = useNavigate();

    onMount(() => {
        game = $selectedGame;
    });

    const goBackToProfile = () => {
        navigate("/games");
    };
</script>

<div class="container content-box">
    {#if game}
        <div class="header my-2">
            <button class="back-button" on:click={goBackToProfile}>
                Go Back
            </button>
            <h1>{game.name}</h1>
        </div>
        <GameEmbed src={game.src} />
    {/if}
</div>

<style>
    .container {
        max-width: 960px;
        max-height: 600px;
    }
</style>
