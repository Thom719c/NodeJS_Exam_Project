<script>
    import { onMount } from "svelte";
    import {
        session,
        serverURL,
        serverEndpoints,
    } from "../../stores/stores.js";
    import { useNavigate } from "svelte-navigator";
    import toast from "svelte-french-toast";
    import defaultProfileImage from "../../assets/profileDefault.png";

    const navigate = useNavigate();

    let friends = [];

    onMount(async () => {
        const url = $serverURL + $serverEndpoints.user.friendlist;
        const response = await fetch(url, { credentials: "include" });

        if (response.ok) {
            const data = await response.json();
            friends = data.data;
        } else {
            console.error("Failed to get users:");
        }
    });

    const removeUserFromFriendList = async (friend) => {
        const url = $serverURL + $serverEndpoints.user.friendlist;
        const removeFriend = {
            id: friend.user_id,
            name: friend.name,
            gamertag: friend.gamertag
        };
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(removeFriend),
            credentials: "include",
        });

        if (response.ok) {
            friends = friends.filter(
                (f) => f.gamertag !== removeFriend.gamertag
            );
            toast.success("Friend was removed successfully from friendlist.", {
                duration: 5000,
                position: "bottom-right",
                style: "border-radius: 200px; background: #333; color: #fff;",
            });

        } else {
            toast.error("Failed to remove friend from friendlist.", {
                duration: 5000,
                position: "bottom-right",
                style: "border-radius: 200px; background: #333; color: #fff;",
            });
        }
    };

    const showImage = (avatar) => {
        if (!avatar) {
            return defaultProfileImage;
        }

        return `${$serverURL}/images/avatar/${avatar}`;
    };

    const goBackToProfile = () => {
        navigate("/profile");
    };
</script>

<div class="container">
    <div class="header my-4">
        <button class="back-button" on:click={goBackToProfile}>
            Go Back
        </button>
        <h2 class="title text-gradient">
            Your friend list {$session.gamertag}
        </h2>
    </div>

    {#if friends.length === 0}
        <div class="user">
            <p class="empty-message">Your friend list is empty.</p>
        </div>
    {:else}
        <ul class="user-list">
            {#each friends as friend}
                <li class="user">
                    <div class="image-container">
                        <img
                            class="profile-image"
                            src={showImage(friend.profile_image)}
                            alt={`Profile image for ${friend.name}`}
                        />
                    </div>
                    <div class="user-details">
                        <p class="d-flex user-name justify-content-start">
                            {friend.name}
                        </p>
                        <div class="button-container">
                            <button class="move-button">Message</button>
                            <button
                                class="remove-button"
                                on:click={() => removeUserFromFriendList(friend)}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </li>
            {/each}
        </ul>
    {/if}
</div>

<style>
    .container {
        max-width: 800px;
        margin: 0 auto;
    }

    .title {
        text-align: center;
        font-size: 30px;
        letter-spacing: 2px;
        font-weight: bold;
        flex-grow: 1;
    }

    .empty-message {
        text-align: center;
        font-weight: 400;
        font-size: 24px;
        flex-grow: 1;
    }

    .user-list {
        list-style: none;
        padding: 0;
    }

    .user {
        display: flex;
        align-items: center;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 10px;
        margin-bottom: 10px;
        background-color: rgba(48, 76, 96, 0.9);
    }

    .image-container {
        margin-left: 10px;
    }

    .profile-image {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin-right: 8px;
    }

    .user-details {
        flex-grow: 1;
        margin-left: 10px;
    }

    .user-name {
        font-size: 18px;
        font-weight: bold;
        margin: 0;
        margin-bottom: 5px;
    }

    .button-container {
        display: flex;
        justify-content: flex-end;
    }

    .move-button,
    .remove-button {
        background-color: #007bff;
        color: #fff;
        border: none;
        padding: 6px 12px;
        font-size: 14px;
        border-radius: 4px;
        margin-left: 10px;
        transition: background-color 0.3s;
    }

    .move-button:hover {
        background-color: #0056b3;
    }

    .remove-button {
        background-color: #ca2323;
    }
    .remove-button:hover {
        background-color: #aa0f0f;
    }
</style>
