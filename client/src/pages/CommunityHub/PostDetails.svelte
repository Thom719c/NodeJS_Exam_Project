<script>
    import { onMount, onDestroy } from "svelte";
    import io from "socket.io-client";
    import {
        session,
        serverURL,
        serverEndpoints,
        postRoom,
    } from "../../stores/stores.js";
    import toast, { Toaster } from "svelte-french-toast";
    import { useNavigate } from "svelte-navigator";

    const navigate = useNavigate();

    let roomId = "";
    let post = {};
    let comments = [];
    let newComment = "";

    const socket = io("localhost:3000"); // Connect to the Socket.IO server
    // Handle commentAdded event
    socket.on("commentAdded", (comment) => {
        comments = [...comments, comment];
    });

    onMount(async () => {
        socket.emit("subscribeToCommentAdded");
        // Fetch post details and comments from API or any other data source
        // Example data

        const response = await fetch(
            $serverURL + "/communityHub/posts/" + $postRoom
        );
        if (response.ok) {
            const data = await response.json();
            post = data.data.post;
            comments = data.data.comments;
        } else {
            // Handle the error if the post and comments were not fetched successfully
            console.error(
                "Failed to fetch post and comments:",
                response.status,
                response.statusText
            );
        }

        roomId = `room-${$postRoom}`;
        socket.emit("joinRoom", roomId);
    });

    onDestroy(() => {
        socket.disconnect();
    });

    async function addComment() {
        const response = await fetch($serverURL + "/communityHub/comments", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: newComment, roomId: $postRoom }),
        });
        const data = await response.json();

        if (response.ok) {
            // Emit the new comment to all connected clients
            socket.emit("newComment", roomId, data.comment);
            newComment = "";

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

    const goBackToProfile = () => {
        navigate("/communityHub");
    };
</script>

<Toaster />

<div class="post-details">
    <div class="header my-4">
        <button class="back-button" on:click={goBackToProfile}>
            Go Back
        </button>
        <h2 class="title text-gradient mx-3">
            {post?.title}
        </h2>
        <div class="my-auto">
            <p class="comment-date">
                Created: {post?.created_at}
            </p>
            <p class="comment-date my-auto">
                Last Edited: {post?.updated_at}
            </p>
        </div>
    </div>

    <div class="post-content">
        <p>{post?.content}</p>
        <p class="col comment-user">
            Created by: {post?.gamertags}
        </p>
    </div>

    <hr />

    <h2 class="text-gradient mt-4">Comments</h2>
    {#if comments}
        <ul class="comment-list-ul">
            {#each comments as comment (comment.id)}
                <li class="post-content my-4">
                    <div class="row">
                        <p>
                            {comment.content}
                        </p>
                        <p class="col comment-user">
                            Posted by: {comment.gamertag}
                        </p>
                        <p class="col comment-date">
                            {comment.created_at}
                        </p>
                    </div>
                </li>
            {/each}
        </ul>
    {/if}

    {#if $session}
        <form on:submit|preventDefault={addComment}>
            <label for="comment">Add a comment:</label>
            <textarea id="comment" rows="4" bind:value={newComment} />
            <button type="submit" class="post-button">Post Comment</button>
        </form>
    {:else}
        <p>Need to be logged in to be able to make comment</p>
        <button class="post-button" on:click={() => navigate(`/login`)}>
            Login
        </button>
    {/if}
</div>

<style>
    .post-details {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
    }

    .comment-list-ul {
        list-style: none;
        padding: 0;
    }

    .post-content {
        display: flex;
        flex-direction: column;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 10px;
        margin-bottom: 10px;
        background-color: rgba(48, 76, 96, 0.9);
    }

    .comment-user {
        font-size: 12px;
        color: #8395a7;
        display: flex;
        justify-content: start;
    }

    .comment-date {
        font-size: 12px;
        color: #8395a7;
        display: flex;
        justify-content: end;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
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
    }

    textarea {
        width: 100%;
        padding: 5px;
        margin-bottom: 10px;
    }

    .back-button,
    .post-button {
        background-color: #67c2dd41;
        border-color: #e5e047;
        font-weight: bold;
        font-size: 14px;
        padding: 6px 12px;
        letter-spacing: 1px;
        min-width: 90px;
    }

    .back-button:hover,
    .post-button:hover {
        background-color: rgba(71, 135, 155, 0.255);
    }
</style>
