<script>
    import { onMount } from "svelte";
    import { useLocation, useNavigate } from "svelte-navigator";
    import {
        serverURL,
        serverEndpoints,
        session,
    } from "../../stores/stores.js";
    import toast, { Toaster } from "svelte-french-toast";
    import { SyncLoader } from "svelte-loading-spinners";

    const location = useLocation();
    const navigate = useNavigate();

    let appid;
    let gameInfo;
    let sanitizedDescription = "";

    onMount(async () => {
        const params = new URLSearchParams($location.search);
        appid = params.get("appid");

        const response = await fetch(
            "http://localhost:3000/api/gameInfo/" + appid
        );
        const data = await response.json();
        gameInfo = data[appid].data;
    });

    const addToWishlist = () => {
        const url = $serverURL + $serverEndpoints.authentication.wishlist;
        fetchingAddToList(url);
    };

    const addToOwnedGame = () => {
        const url = $serverURL + $serverEndpoints.authentication.addOwnedGame;
        fetchingAddToList(url);
    };

    const fetchingAddToList = async (url) => {
        const game = { steamAppId: appid, name: gameInfo.name };
        try {
            const response = await fetch(url, {
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
        } catch (error) {
            console.log(error);
        }
    };
    const goBackToProfile = () => {
        navigate("/gameMarket");
    };
</script>

<Toaster />

{#if gameInfo}
    <div class="container">
        {#if gameInfo.background}
            <img
                class="background"
                src={gameInfo.background}
                alt="background"
            />
        {/if}
        <div class="content">
            <div class="me-auto">
                <button class="back-button" on:click={goBackToProfile}>
                    Go Back
                </button>
            </div>
            <div class="image-content mt-3">
                <img
                    class="header-image"
                    src={gameInfo.header_image}
                    alt="header_image"
                />

                <button class="wishlistButton" on:click={addToWishlist}>
                    Add to Wishlist
                </button>
                <button class="ownedGameButton" on:click={addToOwnedGame}>
                    <i class="bi bi-star-fill" />
                </button>
            </div>

            <div class="title">{gameInfo.name}</div>

            <div class="releaseDate">
                {#if gameInfo.release_date && gameInfo.release_date.coming_soon}
                    Coming soon
                {:else}
                    Release date {gameInfo.release_date.date}
                {/if}
            </div>

            <div class="description">
                {@html gameInfo.detailed_description}
            </div>

            <div class="priceContainer">
                <div class="priceDetails">
                    {#if gameInfo.price_overview && gameInfo.price_overview.discount_percent}
                        <div class="discountPrice">
                            <div class="discountPercentage">
                                {gameInfo.price_overview.discount_percent}%
                            </div>
                            <div class="initialPrice">
                                {gameInfo.price_overview.initial_formatted}
                            </div>
                        </div>
                    {/if}
                    <div class="price">
                        {gameInfo.price_overview
                            ? gameInfo.price_overview.final_formatted
                            : "Free to play"}
                    </div>
                </div>
            </div>

            <div class="categories">
                {#if gameInfo.categories}
                    {#each gameInfo.categories as category}
                        <div class="category">{category.description}</div>
                    {/each}
                {:else}
                    <div class="category">Uncategorized</div>
                {/if}
            </div>

            <div class="genres">
                {#if gameInfo.genres}
                    {#each gameInfo.genres as genre}
                        <div class="genre">{genre.description}</div>
                    {/each}
                {:else}
                    <div class="genre">No Genre</div>
                {/if}
            </div>
        </div>
    </div>
{:else}
    <div class="d-flex justify-content-center">
        <SyncLoader size="60" color="#FF3E00" unit="px" duration="1s" />
    </div>
{/if}

<style>
    .container {
        flex: 1;
    }

    .content {
        position: relative;
        display: flex;
        flex-direction: column;
        padding: 20px;
        background-color: rgba(0, 0, 0, 0.5) !important;
        margin: 20px;
        border-radius: 10px;
        z-index: 1;
    }

    .image-content {
        position: relative;
    }

    .background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 1;
    }

    .header-image {
        height: 200px;
        width: 100%;
        object-fit: fill;
        border-radius: 10px;
        margin-bottom: 20px;
    }

    .title {
        font-size: 24px;
        font-weight: bold;
        margin-top: 10px;
        margin-bottom: 5px;
        color: white;
    }

    .releaseDate {
        font-style: italic;
        margin-bottom: 10px;
        color: white;
    }

    .description {
        font-size: 16px;
        line-height: 22px;
        margin-bottom: 20px;
        color: white;
    }

    .priceContainer {
        position: relative;
        align-self: flex-end;
        margin-bottom: 10px;
        border-radius: 5px;
        padding: 5px;
        padding-left: 5px;
        padding-right: 5px;
        background-color: #444;
        border-width: 1px;
        border-color: #ccc;
    }

    .priceDetails {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .discountPrice {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .discountPercentage {
        background-color: #2ecc71;
        color: #fff;
        padding: 5px;
        margin-right: 5px;
        border-radius: 5px;
        font-weight: bold;
        font-size: 18px;
    }

    .initialPrice {
        text-decoration-line: line-through;
        color: #777;
        font-size: 14px;
        position: absolute;
        top: -3px;
        left: 60px;
    }

    .price {
        font-weight: bold;
        font-size: 18px;
        align-self: flex-end;
        color: #fff;
    }

    .categories {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin-top: 15px;
    }

    .category {
        background-color: rgba(48, 76, 96, 0.9);
        color: rgb(103, 193, 221);
        padding: 5px;
        margin-right: 10px;
        margin-bottom: 10px;
        border-radius: 5px;
        overflow: hidden;
        font-size: 12px;
    }

    .genres {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin-top: 15px;
    }

    .genre {
        background-color: rgba(48, 76, 96, 0.9);
        color: rgb(103, 193, 221);
        padding: 5px;
        margin-right: 10px;
        margin-bottom: 10px;
        border-radius: 5px;
        overflow: hidden;
        font-size: 12px;
    }

    .wishlistButton {
        position: absolute;
        top: 5px;
        right: 5px;
        padding: 5px;
        border-radius: 5px;
        background-color: rgba(48, 76, 96, 0.9);
        color: rgb(103, 193, 221);
        font-weight: bold;
    }

    .ownedGameButton {
        position: absolute;
        top: 5px;
        left: 5px;
        padding: 5px;
        border-radius: 5px;
        background-color: rgba(48, 76, 96, 0.9);
        color: rgb(103, 193, 221);
        font-weight: bold;
        width: 35px;
    }

    .ownedGameButton:hover {
        color: yellow;
    }
    .back-button {
        /* position: absolute;
        top: 85px;
        left: 30px; */
        margin: auto;

        background-color: #67c2dd41;
        border-color: #e5e047;
        font-weight: bold;
        font-size: 14px;
        padding: 6px 12px;
        letter-spacing: 1px;
        /* z-index: 2; */
    }

    .back-button:hover {
        background-color: rgba(71, 135, 155, 0.255);
    }
</style>
