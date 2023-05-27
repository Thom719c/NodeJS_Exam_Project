<!-- <script>
    import Game from "../../components/Game/Game.svelte";
  
    const games = [
      { name: "Football", image: "", src: "src/assets/unityGames/football/footballGame.html" },
      { name: "M2 Game", image: "", src: "src/assets/unityGames/m2Game/m2Game.html" },
      // Add more games to the array
    ];
  
    let selectedGame;
  
    function selectGame(game) {
      selectedGame = game;
    }
  </script>
  
  <div>
    {#each games as game}
      <button on:click={() => selectGame(game)}>
        {game.name}
      </button>
    {/each}
  </div>
  
  {#if selectedGame}
    <Game src={selectedGame.src} />
  {/if}
   -->
<script>
    import { selectedGame } from "../../stores/stores.js";
    import { useNavigate } from "svelte-navigator";

    const navigate = useNavigate();

    const games = [
        {
            id: 1,
            name: "Football",
            image: "",
            src: "/src/assets/unityGames/football/footballGame.html",
        },
        {
            id: 2,
            name: "M2 Game",
            image: "",
            src: "/src/assets/unityGames/m2Game/m2Game.html",
        },
    ];

    function selectGame(game) {
        selectedGame.set(game);
        navigate(`/games/${game.id}`);
    }
</script>

<div>
    {#each games as game}
        <button on:click={() => selectGame(game)}>
            {game.name}
        </button>
    {/each}
</div>
