<script>
    import CommunityPost from "./CommunityPost.svelte";
    import { onMount } from "svelte";
    import {
        session,
        serverURL,
        serverEndpoints,
    } from "../../stores/stores.js";
    import { useNavigate } from "svelte-navigator";

    const navigate = useNavigate();

    let posts = [];

    onMount(async () => {
        const response = await fetch($serverURL + "/communityHub/posts");

        if (response.ok) {
            const data = await response.json();
            posts = data.data;
        } else {
            console.error(
                "Failed to add comment:",
                response.status,
                response.statusText
            );
        }
    });
</script>

<h1 class="page-title">Community Hub</h1>

{#if $session}
    <button
        class="post-button"
        on:click={() => navigate(`/communityHub/create-post`)}
    >
        Create Post
    </button>
{/if}

<div class="community-posts">
    {#each posts as post (post.id)}
        <CommunityPost {post} />
    {/each}
</div>

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
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
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
</style>
