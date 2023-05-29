<script>
    import {
        serverURL,
        serverEndpoints,
        postRoom,
    } from "../../stores/stores.js";
    import toast, { Toaster } from "svelte-french-toast";
    import { useNavigate } from "svelte-navigator";

    const navigate = useNavigate();

    let name = "";
    let image = "";
    let filename = "";
    let src = "";
    let genre = "";
    let isGamingOasis = "others";
    let selectedFile;

    const createGame = () => {
        if (!selectedFile) {
            addGame();
        } else {
            uploadImage();
        }
    };

    const uploadImage = async () => {
        const url = $serverURL + "/fileform?purpose=game";
        const formData = new FormData();
        formData.append("file", selectedFile);
        const response = await fetch(url, {
            credentials: "include",
            method: "POST",
            body: formData,
        });
        const data = await response.json();

        if (response.ok) {
            toast.success(data.message);
            addGame(data.data);
        } else {
            toast.error(data.message);
        }
    }

    const addGame = async (filename) => {
        const game = {
            name: name,
            image: filename || image,
            src: src,
            genre: genre,
            isGamingOasis: isGamingOasis,
        };

        const response = await fetch($serverURL + "/games", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(game),
        });

        const data = await response.json();

        if (response.ok) {
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
    }

    function handleFileImageInputChange(event) {
        image = "";
        const file = event.target.files[0];
        selectedFile = file;
    }
</script>

<Toaster />

<div class="post-details">
    <h1 class="title text-gradient">Add Game</h1>

    <div class="post-content">
        <form on:submit|preventDefault={createGame}>
            <label for="name">Name</label>
            <input type="text" id="name" bind:value={name} maxlength="50" />

            <hr />

            <label for="file">Image Or public link to image</label>
            <input
                name="file"
                type="file"
                accept="image/*"
                on:change={handleFileImageInputChange}
            />
            {#if selectedFile}
                <input
                    type="text"
                    id="image"
                    class="mt-2"
                    name="image"
                    bind:value={image}
                    maxlength="50"
                    disabled
                />
            {:else}
                <input
                    type="text"
                    id="image"
                    class="mt-2"
                    name="image"
                    bind:value={image}
                    maxlength="50"
                />
            {/if}

            <hr />

            <label for="src">Source</label>
            <input type="text" id="src" bind:value={src} maxlength="50" />

            <label for="genre">Genre</label>
            <input type="text" id="genre" bind:value={genre} maxlength="50" />

            <div class="owner">
                <label for="owner">Games from</label>
                <div class="ms-3 mt-2">
                    <label for="gamingOasis">
                        <input
                            type="radio"
                            id="gamingOasis"
                            name="isGamingOasis"
                            value="gamingOasis"
                            bind:group={isGamingOasis}
                        />
                        Gaming Oasis
                    </label>
                    <label for="others">
                        <input
                            type="radio"
                            id="others"
                            name="isGamingOasis"
                            value="others"
                            bind:group={isGamingOasis}
                        />
                        Others
                    </label>
                </div>
            </div>

            <hr />

            <button type="submit" class="post-button">Add Game</button>
        </form>
    </div>
</div>

<style>
    .post-details {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
    }

    .post-content {
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 10px;
        margin-bottom: 10px;
        background-color: rgba(48, 76, 96, 0.9);
    }

    .title {
        text-align: center;
        font-size: 30px;
        letter-spacing: 2px;
        font-weight: bold;
        flex-grow: 1;
    }

    label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }

    .post-button {
        background-color: #67c2dd41;
        border-color: #e5e047;
        font-weight: bold;
        font-size: 14px;
        padding: 6px 12px;
        letter-spacing: 1px;
    }

    .post-button:hover {
        background-color: rgba(71, 135, 155, 0.255);
    }

    input[type="text"] {
        font-weight: bold;
        width: 100%;
    }

    .owner {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .owner label {
        display: flex;
        align-items: center;
        cursor: pointer;
        margin-top: 10px;
    }

    .owner input[type="radio"] {
        margin-right: 10px;
        transform: scale(1.25);
    }
</style>
