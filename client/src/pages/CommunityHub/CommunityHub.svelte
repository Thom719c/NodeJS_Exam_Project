<script>
    import CommunityPost from "./CommunityPost.svelte";
    import { onMount } from "svelte";
    import {
        session,
        serverURL,
        serverEndpoints,
    } from "../../stores/stores.js";
    import { useNavigate } from "svelte-navigator";
    import CreatePost from "../../components/ComunnityHub/CreatePost.svelte";

    const navigate = useNavigate();

    let posts = [];
    let showCreatePostPopup = false;

    onMount(async () => {
        const response = await fetch($serverURL + "/communityHub/posts");

        if (response.ok) {
            const data = await response.json();
            posts = data.data;
        } else {
            console.error("Failed to add comment:");
        }
    });
</script>

<h1 class="page-title">Community Hub</h1>

{#if $session}
    <button
        class="post-button"
        on:click={() => (showCreatePostPopup = !showCreatePostPopup)}
    >
        Create Post
    </button>
{/if}

<div class="community-posts">
    {#each posts as post (post.id)}
        <CommunityPost {post} />
    {/each}
</div>

{#if showCreatePostPopup}
    <div class="create-post-overlay">
        <div class="create-post-popup container">
            <CreatePost />
            <button
                class="close-button"
                on:click={() => (showCreatePostPopup = false)}
                ><i class="bi bi-x-lg" /></button
            >
        </div>
    </div>
{/if}

<style>
    .page-title {
        font-size: 32px;
        text-align: center;
        margin: 24px 0;
        color: #c6d4df;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .community-posts {
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 20px;
        justify-items: center;
        margin: 20px;
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
