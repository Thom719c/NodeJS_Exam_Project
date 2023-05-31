<script>
    import { afterUpdate, onMount } from "svelte";
    import { useNavigate } from "svelte-navigator";
    import { serverURL, serverEndpoints } from "../../stores/stores.js";
    import toast from "svelte-french-toast";
    import defaultProfileImage from "../../assets/profileDefault.png";
    import AddFriend from "./AddFriend.svelte";

    const navigate = useNavigate();

    export let user;
    export let friends;
    let isFriend = false;

    onMount(() => {
        handleCheckFriendlist();
    });

    afterUpdate(() => {
        isFriend =
            friends.find((friend) => friend.gamertag === user.gamertag) !==
            undefined;
    });

    const showImage = (avatar) => {
        if (!avatar) {
            return defaultProfileImage;
        }

        return `${$serverURL}/images/avatar/${avatar}`;
    };

    const handleCheckFriendlist = async () => {
        const url = $serverURL + $serverEndpoints.user.friendlist;
        const response = await fetch(url, { credentials: "include" });
        const data = await response.json();
        if (response.ok) {
            friends = data.data;
        } else {
            toast.error(data.message, {
                duration: 5000,
                position: "bottom-right",
                style: "border-radius: 200px; background: #333; color: #fff;",
            });
        }
    };
</script>

<div class="user-container row">
    <div class="col user-header">
        <button
            class="user-button"
            on:click={() => {
                navigate(`/profile/${user.gamertag}`, { replace: true });
            }}
        >
            <img
                class="avatar"
                src={showImage(user.profile_image)}
                alt={user.name}
            />
            <div class="user-content">
                <p>{user.name}</p>
                <p>{user.email}</p>
            </div>
        </button>
    </div>
    <div class="col-auto text-gradient add-friend">
        {#if isFriend}
            <p>Already friends</p>
        {:else}
            <AddFriend {user} on:friendAdded={handleCheckFriendlist} />
        {/if}
    </div>
</div>

<style>
    .avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin-right: 8px;
    }

    .user-container {
        display: flex;
        align-items: center;
        background-color: #1b2838;
        color: #c6d4df;
        border-color: #e5e047;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease-in-out;
        height: 100%;
        width: calc(100% - 50px);
        max-width: 600px;
    }

    .user-header {
        display: flex;
        align-items: center;
        background-color: #1b2838;
        flex: 1;
    }

    .user-button {
        display: flex;
        align-items: center;
        width: 100%;
        background: none;
        padding: 0;
        min-width: 300px;
    }

    .user-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .add-friend {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        margin-left: auto;
    }

    p {
        font-size: 16px;
        line-height: 1.5;
    }
</style>
