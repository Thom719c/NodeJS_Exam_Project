<script>
  import { selectedGame } from "../../stores/stores.js";
  import { useNavigate } from "svelte-navigator";
  import footballImage from "../../assets/unityGames/football/footballImage.png";
  import m2Image from "../../assets/unityGames/m2Game/m2Image.png";

  const navigate = useNavigate();

  const games = [
    {
      id: 1,
      name: "Football",
      image: footballImage,
      src: "/src/assets/unityGames/football/footballGame.html",
    },
    {
      id: 2,
      name: "M2",
      image: m2Image,
      src: "/src/assets/unityGames/m2Game/m2Game.html",
    },
  ];

  function selectGame(game) {
    selectedGame.set(game);
    navigate(`/games/${game.id}`);
  }
</script>

<div class="game-container mt-4">
  {#each games as game}
    <button class="game" on:click={() => selectGame(game)}>
      <div class="game-card">
        <img
          class="game-image"
          src={game.image}
          alt={`Cover image for ${game.name}`}
        />
        <p class="game-name text-gradient">{game.name}</p>
      </div>
    </button>
  {/each}
</div>

<style>
  .game-container {
    list-style-type: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .game {
    background-color: rgba(48, 76, 96, 0.9);
    color: #c6d4df;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 10px;
    padding: 10px;
    width: 300px;
    height: 200px;
    transition: transform 0.2s ease-in-out;
  }

  .game:hover {
    transform: translateY(-5px);
  }

  .game-image {
    width: 250px;
    height: 150px;
    margin: 0 10px;
    border-radius: 5px;
  }

  .game-name {
    font-size: 18px;
    text-align: center;
  }
</style>
