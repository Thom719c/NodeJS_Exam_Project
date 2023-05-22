<script>
    import {
        serverURL,
        serverEndpoints,
        postRoom,
    } from "../../stores/stores.js";
    import { useNavigate } from "svelte-navigator";

    const navigate = useNavigate();

    let title = "";
    let content = "";

    async function createPost() {
        const createdDate = new Date().toISOString().split("T")[0];
        const post = {
            title: title,
            content: content,
            state: "active",
            created_at: createdDate,
            updated_at: createdDate,
        };

        const response = await fetch($serverURL + "/communityHub/posts", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(post),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Post created:", data);
            postRoom.set(data.postId);
            navigate(`/communityHub/post/${data.postId}`);
        } else {
            console.error("Failed to create post");
        }
    }
</script>

<div class="post-details">
    <h1 class="title text-gradient">Create a New Post</h1>

    <div class="post-content">
        <form on:submit|preventDefault={createPost}>
            <label for="title">Title:</label>
            <input type="text" id="title" bind:value={title} maxlength="50" />

            <label for="content">Content:</label>
            <textarea id="content" rows="4" bind:value={content} />

            <button type="submit" class="post-button">Create Post</button>
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
    }

    textarea {
        width: 100%;
        padding: 5px;
        margin-bottom: 10px;
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
