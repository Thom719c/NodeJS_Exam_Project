<script>
    import { useNavigate } from "svelte-navigator";
    import { postRoom } from "../../stores/stores.js";

    const navigate = useNavigate();

    export let post;
</script>

<button
    class="post col-lg-4 col-md-6 col-sm-12"
    on:click={() => {
        postRoom.set(post.id);
        navigate(`/communityHub/post/${post.id}`);
    }}
>
    <div class="post-header">
        <h2>{post.title}</h2>
        <div class="post-dates">
            <p class="post-date">Created: {post.created_at}</p>
        </div>
    </div>
    <p class="post-content">{post.content}</p>
    <div class="post-dates">
        <p class="post-date">Last Edited: {post.updated_at}</p>
    </div>
</button>

<style>
    .post {
        background-color: #1b2838;
        color: #c6d4df;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease-in-out;
        height: 100%;
        width: calc(100% - 30px);
    }

    .post:hover {
        transform: translateY(-5px);
    }

    .post-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 10px;
    }

    h2 {
        font-size: 20px;
        color: #c6d4df;
    }

    .post-dates {
        display: flex;
        justify-content: end;
    }

    .post-date {
        font-size: 12px;
        color: #8395a7;
    }

    .post-content {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        /* Number of lines to show and if more it adds ...*/
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }

    p {
        font-size: 16px;
        line-height: 1.5;
    }
</style>
