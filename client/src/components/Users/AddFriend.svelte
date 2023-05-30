<script>
    import { serverURL, serverEndpoints } from "../../stores/stores.js";
    import toast from "svelte-french-toast";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let user = {};

    async function handleAddFriend() {
        const url = $serverURL + $serverEndpoints.user.friendlist;
        const response = await fetch(url, {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user }),
        });
        const data = await response.json();
        if (response.ok) {
            toast.success(data.message, {
                duration: 5000,
                position: "bottom-right",
                style: "border-radius: 200px; background: #333; color: #fff;",
            });
            dispatch("friendAdded");
        } else {
            toast.error(data.message, {
                duration: 5000,
                position: "bottom-right",
                style: "border-radius: 200px; background: #333; color: #fff;",
            });
        }
    }
</script>

<button class="btn btn-outline-primary" on:click={handleAddFriend}>
    <i class="bi bi-person-fill-add" />
    Add Friend
</button>

<style>
    .btn-outline-primary {
        border-color: #e5e047;
        font-weight: bold;
        letter-spacing: 1px;
        width: 145px;
    }

    .btn-outline-primary:hover {
        background-color: #67c2dd41;
        color: white;
        right: 0px;
    }
</style>
