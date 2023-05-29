<script>
    import { afterUpdate } from "svelte";
    import { useNavigate } from "svelte-navigator";
    import {
        session,
        serverURL,
        serverEndpoints,
    } from "../../stores/stores.js";
    import defaultProfileImage from "../../assets/profileDefault.png";
    import AddFriend from "../../components/Users/AddFriend.svelte";

    const navigate = useNavigate();

    export let user;
    export let friends;
    let isFriend = false;

    const showImage = (avatar) => {
        if (!avatar) {
            return defaultProfileImage;
        }

        return `${$serverURL}/images/avatar/${avatar}`;
    };

    afterUpdate(() => {
        isFriend =
            friends.find((friend) => friend.gamertag === user.gamertag) !==
            undefined;
    });
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
            <AddFriend {user} />
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
