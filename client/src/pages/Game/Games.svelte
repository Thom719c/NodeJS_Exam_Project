<script>
  import { onMount } from "svelte";
  import {
    session,
    selectedGame,
    serverURL,
    serverEndpoints,
  } from "../../stores/stores.js";
  import toast, { Toaster } from "svelte-french-toast";
  import defaultGameImage from "../../assets/defaultGameImage.png";
  import { useNavigate } from "svelte-navigator";
  import AddGame from "../../components/Game/AddGame.svelte";

  const navigate = useNavigate();

  let games = [];
  let filteredGames = [];
  let searchQuery = "";
  let selectedRadioValue = "all";
  let selectedGenre = "all";
  let showAddGamePopup = false;

  onMount(async () => {
    const url = $serverURL + "/games";
    const response = await fetch(url, { credentials: "include" });
    const data = await response.json();
    games = data.data;
    filteredGames = games.slice();
  });

  function selectGame(game) {
    selectedGame.set(game);
    navigate(`/games/${game.id}`);
  }

  const searchGames = () => {
    filteredGames = games.filter((game) => {
      const query = searchQuery.toLowerCase();
      const isMatch = game.name.toLowerCase().includes(query);

      const isOwnerMatch =
        selectedRadioValue === "all" ||
        (selectedRadioValue === "gamingOasis" && game.is_gaming_oasis) ||
        (selectedRadioValue === "others" && !game.is_gaming_oasis);

      const isGenreMatch =
        selectedGenre === "all" ||
        game.genre.toLowerCase().includes(selectedGenre.toLowerCase());

      return isMatch && isOwnerMatch && isGenreMatch;
    });
  };

  const showImage = (gameImage) => {
    if (!gameImage) {
      return defaultGameImage;
    }

    if (gameImage.startsWith("http")) {
      return gameImage;
    }

    return `${$serverURL}/images/games/${gameImage}`;
  };

  const handleRemoveGame = async (removeGame) => {
    const url = $serverURL + "/games";
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(removeGame),
      credentials: "include",
    });
    const data = await response.json();

    if (response.ok) {
      filteredGames = games.filter((g) => g.id !== removeGame.id);
      toast.success(data.message, {
        duration: 5000,
        position: "bottom-right",
        style: "border-radius: 200px; background: #333; color: #fff;",
      });
    } else {
      toast.error(data.message, {
        duration: 5000,
        position: "bottom-right",
        style: "border-radius: 200px; background: #333; color: #fff;",
      });
    }
  };
</script>

<Toaster />

<div>
  <h1>Games</h1>
</div>

{#if $session}
  <button
    class="post-button"
    on:click={() => (showAddGamePopup = !showAddGamePopup)}
  >
    Add Game
  </button>
{/if}

{#if showAddGamePopup}
  <div class="create-post-overlay z-1">
    <div class="create-post-popup container">
      <AddGame />
      <button class="close-button" on:click={() => (showAddGamePopup = false)}>
        <i class="bi bi-x-lg" />
      </button>
    </div>
  </div>
{/if}

<div class="container-fluid row">
  <div class="col game-container mt-4">
    {#each filteredGames as game}
      {#if $session?.role === "admin"}
        <div class="game-wrapper">
          <button class="game" on:click={() => selectGame(game)}>
            <div class="row">
              <img
                class="col game-image"
                src={showImage(game.image)}
                alt={`Cover image for ${game.name}`}
              />
              <p class="col game-name text-gradient">{game.name}</p>
            </div>
          </button>
          <button class="remove-button" on:click={() => handleRemoveGame(game)}>
            Remove
          </button>
        </div>
      {:else}
        <button class="game-user" on:click={() => selectGame(game)}>
          <div class="row">
            <img
              class="col game-image"
              src={showImage(game.image)}
              alt={`Cover image for ${game.name}`}
            />
            <p class="col game-name text-gradient">{game.name}</p>
          </div>
        </button>
      {/if}
    {/each}
  </div>
  <div class="col-2 sticky-top filter z-0">
    <!-- Fields for filter -->
    <div class="search-bar mb-3">
      <input
        class="search"
        type="text"
        placeholder="Search..."
        bind:value={searchQuery}
        on:input={searchGames}
      />
    </div>

    <hr class="my-2" />

    <div class="genres">
      <p>Games from</p>
      <div class="ms-3 mt-2">
        <label for="all">
          <input
            type="radio"
            id="all"
            name="isGamingOasis"
            value="all"
            bind:group={selectedRadioValue}
            on:change={searchGames}
          />
          All
        </label>
        <label for="gamingOasis">
          <input
            type="radio"
            id="gamingOasis"
            name="isGamingOasis"
            value="gamingOasis"
            bind:group={selectedRadioValue}
            on:change={searchGames}
          />
          Gaming Oasis
        </label>
        <label for="others">
          <input
            type="radio"
            id="others"
            name="isGamingOasis"
            value="others"
            bind:group={selectedRadioValue}
            on:change={searchGames}
          />
          Others
        </label>
      </div>
    </div>

    <hr class="my-2" />

    <div class="genres">
      <p>Genres</p>
      <div class="ms-3 mt-2">
        <label for="allGenre">
          <input
            type="radio"
            id="allGenre"
            name="genres"
            value="all"
            bind:group={selectedGenre}
            on:change={searchGames}
          />
          All
        </label>
        <label for="action">
          <input
            type="radio"
            id="action"
            name="genres"
            value="action"
            bind:group={selectedGenre}
            on:change={searchGames}
          />
          Action
        </label>
        <label for="adventure">
          <input
            type="radio"
            id="adventure"
            name="genres"
            value="adventure"
            bind:group={selectedGenre}
            on:change={searchGames}
          />
          Adventure
        </label>
        <label for="rpg">
          <input
            type="radio"
            id="rpg"
            name="genres"
            value="rpg"
            bind:group={selectedGenre}
            on:change={searchGames}
          />
          RPG
        </label>
        <label for="sport">
          <input
            type="radio"
            id="sport"
            name="genres"
            value="sport"
            bind:group={selectedGenre}
            on:change={searchGames}
          />
          Sport
        </label>
        <label for="simulation">
          <input
            type="radio"
            id="simulation"
            name="genres"
            value="simulation"
            bind:group={selectedGenre}
            on:change={searchGames}
          />
          Simulation
        </label>
        <label for="racing">
          <input
            type="radio"
            id="racing"
            name="genres"
            value="racing"
            bind:group={selectedGenre}
            on:change={searchGames}
          />
          Racing
        </label>
        <label for="board">
          <input
            type="radio"
            id="board"
            name="genres"
            value="board"
            bind:group={selectedGenre}
            on:change={searchGames}
          />
          Board
        </label>
        <label for="arcade">
          <input
            type="radio"
            id="arcade"
            name="genres"
            value="arcade"
            bind:group={selectedGenre}
            on:change={searchGames}
          />
          Arcade
        </label>
        <label for="other">
          <input
            type="radio"
            id="other"
            name="genres"
            value="other"
            bind:group={selectedGenre}
            on:change={searchGames}
          />
          Other
        </label>
      </div>
    </div>
  </div>
</div>

<style>
  h1 {
    font-size: 32px;
    text-align: center;
    margin: 24px 0;
  }

  .game-container {
    list-style-type: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .game-wrapper {
    background-color: #1b2838;
    color: #c6d4df;
    border: 1px solid #ccc;
    border-radius: 5px;
    max-width: 400px;
    max-height: 250px;
    min-height: 200px;
    margin: 10px;
    padding: 10px;
    transition: transform 0.2s ease-in-out;
  }

  .game {
    border-color: #e5e047;
  }
  .game-user {
    background-color: rgba(48, 76, 96, 0.9);
    color: #c6d4df;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 10px;
    padding: 10px;
    width: 100%;
    max-width: 400px;
    max-height: 250px;
    min-height: 200px;
    transition: transform 0.2s ease-in-out;
  }

  .game:hover {
    transform: translateY(-5px);
  }

  .game-image {
    width: 50%;
    height: 150px;
    padding: 0;
    margin: 0 10px;
    border-radius: 5px;
  }

  .game-name {
    font-size: 18px;
    text-align: center;
    min-width: 150px;
  }

  .remove-button {
    width: 75px;
    height: 35px;
    background-color: #ff0000;
    color: #fff;
    border-radius: 5px;
    padding: 5px 10px;
    font-weight: bold;
  }

  .filter {
    background-color: rgba(48, 76, 96, 0.9);
    color: #c6d4df;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 200px;
    height: 475px;
    margin-top: 35px;
    padding: 10px;
    top: 50px;
    overflow-y: auto;
    max-height: calc(100vh - 100px);
  }

  .search-bar {
    display: flex;
    align-items: center;
  }

  .search {
    display: flex;
    align-items: center;
    height: 35px;
    margin-right: 5px;
    width: 100%;
    background-color: rgba(48, 76, 96, 0.9);
    border-color: #e5e047;
    border-radius: 10px;
    padding: 5px 10px;
  }

  .search::placeholder {
    color: #d1d1d1e6;
  }

  .genres p {
    font-weight: bold;
    margin: 0;
  }

  .genres label {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .genres input[type="radio"] {
    margin-right: 10px;
    transform: scale(1.25);
  }

  .create-post-popup {
    background-color: #242424;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 35em;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    z-index: 2;
  }

  .create-post-overlay {
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .close-button {
    background-color: #67c2dd41;
    border-color: #e5e047;
    padding: 5px 10px;
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .close-button:hover {
    background-color: #f35348ce;
  }
</style>
