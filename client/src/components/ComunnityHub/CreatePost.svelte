<script>
    import {
        serverURL,
        serverEndpoints,
        postRoom,
    } from "../../stores/stores.js";
    import toast, { Toaster } from "svelte-french-toast";
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

        const data = await response.json();

        if (response.ok) {
            postRoom.set(data.postId);
            toast.success(data.message, {
                duration: 5000,
                position: "bottom-right",
                style: "border-radius: 200px; background: #333; color: #fff;",
            });
            navigate(`/communityHub/post/${data.postId}`);
        } else {
            toast.error(data.message, {
                duration: 5000,
                position: "bottom-right",
                style: "border-radius: 200px; background: #333; color: #fff;",
            });
        }
    }
</script>

<Toaster />

<div class="post-details">
    <h1 class="title text-gradient">Create a New Post</h1>

    <div class="post-content">
        <form on:submit|preventDefault={createPost}>
            <label for="title">Title</label>
            <input type="text" id="title" bind:value={title} maxlength="50" />

            <label for="content">Content</label>
            <textarea
                id="content"
                rows="4"
                bind:value={content}
                maxlength="255"
            />

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
        font-weight: bold;
    }

    textarea {
        width: 100%;
        min-height: 100px;
        max-height: 25em;
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

    input[type="text"] {
        font-weight: bold;
        width: 100%;
    }
</style>
