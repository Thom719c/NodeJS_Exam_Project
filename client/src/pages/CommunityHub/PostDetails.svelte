<script>
    import { onMount, onDestroy } from "svelte";
    import io from "socket.io-client";
    import {
        session,
        serverURL,
        serverEndpoints,
        postRoom,
    } from "../../stores/stores.js";
    import toast from "svelte-french-toast";
    import { useNavigate, useLocation } from "svelte-navigator";

    const navigate = useNavigate();
    const location = useLocation();

    let roomId = "";
    let post = {};
    let comments = [];
    let newComment = "";
    let editCommentId = "";

    let isEditMode = false;
    let originalUserData = null;

    function enterEditMode() {
        isEditMode = true;
        originalUserData = JSON.parse(JSON.stringify(comments));
    }

    function exitEditMode(comment) {
        const editIndex = originalUserData.findIndex(
            (c) => c.id === comment.id
        );
        if (originalUserData[editIndex].content !== comment.content) {
            editComment(comment);
        }
        isEditMode = false;
        originalUserData = null;
    }

    function toggleEditMode(comment) {
        if (isEditMode) {
            exitEditMode(comment);
        } else {
            editCommentId = comment.id;
            enterEditMode();
        }
    }

    const socket = io($serverURL); // Connect to the Socket.IO server
    // Handle commentAdded event
    socket.on("commentAdded", (comment) => {
        comments = [...comments, comment];
    });

    socket.on("commentEdited", (comment) => {
        comments = comments.map((c) => {
            if (c.id === comment.id) {
                return { ...c, content: comment.content };
            }
            return c;
        });
    });

    socket.on("commentRemoved", (comment) => {
        comments = comments.filter((c) => c.id !== comment.id);
    });

    onMount(async () => {
        socket.emit("subscribeToCommentAdded");
        // Fetch post details and comments from API or any other data source
        postRoom.set($location.pathname.split("/").pop()); // extracting the last segment using pop() to get the "id" from the URL (after last "/").
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
        const response = await fetch(
            $serverURL + $serverEndpoints.communityHub.comments,
            {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: newComment,
                    roomId: $postRoom,
                }),
            }
        );
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

    async function editComment(comment) {
        const response = await fetch(
            $serverURL + $serverEndpoints.communityHub.comments,
            {
                credentials: "include",
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: comment.content,
                    id: comment.id,
                }),
            }
        );
        const data = await response.json();

        if (response.ok) {
            // Emit the comment to all connected clients
            socket.emit("editComment", roomId, comment);

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

    const removePost = async () => {
        const url = $serverURL + $serverEndpoints.communityHub.posts + post.id;
        const removePost = {
            id: post.id,
            title: post.title,
        };
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(removePost),
            credentials: "include",
        });

        if (response.ok) {
            toast.success(
                `Your post: "${post.title}" is now removed from CommunityHub.`, {
                duration: 5000,
                position: "bottom-right",
                style: "border-radius: 200px; background: #333; color: #fff;",
            });
            setTimeout(() => {
                goBackToProfile();
            }, 2000);
        } else {
            toast.error("Failed to remove the post from CommunityHub.", {
                duration: 5000,
                position: "bottom-right",
                style: "border-radius: 200px; background: #333; color: #fff;",
            });
        }
    };

    const removeComment = async (comment) => {
        const url =
            $serverURL + $serverEndpoints.communityHub.comments + post.id;

        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: comment.id }),
            credentials: "include",
        });

        if (response.ok) {
            // Emit the comment to all connected clients
            socket.emit("removeComment", roomId, comment);
            toast.success(
                `Your comment was removed successfully from CommunityHub.`, {
                duration: 5000,
                position: "bottom-right",
                style: "border-radius: 200px; background: #333; color: #fff;",
            });
            comments = comments.filter((c) => c.id !== comment.id);
        } else {
            toast.error("Failed to remove the post from CommunityHub.", {
                duration: 5000,
                position: "bottom-right",
                style: "border-radius: 200px; background: #333; color: #fff;",
            });
        }
    };

    const goBackToProfile = () => {
        navigate("/communityHub");
    };
</script>

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
        <div class="post-content-container">
            <p class="m-auto my-2">{post?.content}</p>
            <div class="button-container">
                {#if post?.gamertags == $session?.gamertag}
                    <button
                        class="small-button cancel-button"
                        on:click={removePost}
                    >
                        <i class="bi bi-x-circle" />
                    </button>
                    <button class="small-button btn btn-outline-primary">
                        <i class="bi bi-pencil-square" />
                    </button>
                {/if}
            </div>
        </div>
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
                        <div class="post-content-container">
                            {#if isEditMode && editCommentId === comment.id}
                                <textarea
                                    class="m-auto my-2 me-2"
                                    bind:value={comment.content}
                                />
                            {:else}
                                <p class="m-auto my-2">{comment.content}</p>
                            {/if}
                            <div class="button-container my-2">
                                {#if comment.gamertag == $session?.gamertag}
                                    <button
                                        class="small-button cancel-button"
                                        on:click={() => removeComment(comment)}
                                    >
                                        <i class="bi bi-x-circle" />
                                    </button>

                                    <button
                                        class="small-button btn btn-outline-primary"
                                        on:click={() => toggleEditMode(comment)}
                                    >
                                        <i class="bi bi-pencil-square" />
                                    </button>
                                {/if}
                            </div>
                        </div>
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
            <label for="comment">Add a comment</label>
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

    form {
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 10px;
        margin-bottom: 10px;
        background-color: rgba(48, 76, 96, 0.9);
    }

    textarea {
        width: 100%;
        padding: 5px;
        margin-bottom: 10px;
        background-color: #1a2226;
        color: #ecf0f5;
        border: none;
        border-bottom: 2px solid #0db8de;
        border-radius: 5px;
        font-weight: bold;
    }

    .back-button,
    .post-button {
        min-width: 90px;
    }

    .post-content-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .button-container {
        display: flex;
        align-items: center;
    }

    .small-button {
        display: flex;
        align-items: center;
        padding: 5px 10px;
        font-size: 12px;
        border-radius: 5px;
    }

    .cancel-button {
        color: red;
        background-color: rgba(48, 76, 96, 0.9);
        border: 1px solid red;
        margin-right: 10px;
    }
    .btn-outline-primary {
        border-color: #e5e047;
        background-color: rgba(48, 76, 96, 0.9);
        font-weight: bold;
        letter-spacing: 1px;
    }

    .btn-outline-primary:hover {
        background-color: #67c2dd41;
        color: white;
    }
    .cancel-button:hover {
        background-color: #ff000041;
    }
</style>
