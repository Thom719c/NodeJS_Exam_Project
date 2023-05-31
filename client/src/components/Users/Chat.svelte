<script>
    import { onMount, afterUpdate, onDestroy } from "svelte";
    import { serverURL, serverEndpoints } from "../../stores/stores.js";
    import io from "socket.io-client";
    import toast from "svelte-french-toast";
    import defaultProfileImage from "../../assets/profileDefault.png";

    export let onOpenCloseChat;
    export let selectedFriend;

    let socket = null;
    let roomId = null;
    let messages = [];
    let newMessage = "";
    let messageListContainer = null;

    onMount(async () => {
        await getMessages();

        socket = io($serverURL);
        socket.emit("joinChatRoom", roomId);
        socket.on("message", (message) => {
            messages = [...messages, message];
        });
    });

    afterUpdate(() => {
        scrollToBottom();
    });

    onDestroy(() => {
        if (socket) {
            socket.disconnect();
            socket = null;
        }
    });

    const getMessages = async () => {
        const url = $serverURL + $serverEndpoints.user.message;
        const response = await fetch(url, {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ friend: selectedFriend }),
        });

        const data = await response.json();
        if (response.ok) {
            messages = data.data;
            roomId = messages.length > 0 ? messages[0].room_id : null;
        } else {
            console.error("Failed to get users:");
        }
    };

    const sendMessage = async () => {
        const url = $serverURL + $serverEndpoints.user.messages;
        const response = await fetch(url, {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                friend: selectedFriend,
                message: newMessage,
            }),
        });
        const data = await response.json();

        if (response.ok) {
            socket.emit("sendMessage", roomId, data.data);
            roomId = data.data ? data.data.room_id : null;
            newMessage = "";
        } else {
            toast.error(data.message, {
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

    $: {
        scrollToBottom();
    }

    const scrollToBottom = () => {
        if (messageListContainer) {
            messageListContainer.scrollTop = messageListContainer.scrollHeight;
        }
    };
</script>

<div class="chat-popup">
    <div class="chat-header">
        <div class="chat-title mx-auto">
            <h3>Chat with</h3>
            <h3>{selectedFriend.name}</h3>
        </div>
        <button class="close-button" on:click={() => onOpenCloseChat()}>
            <i class="bi bi-x-lg" />
        </button>
    </div>
    <hr />
    <ul class="message-list" bind:this={messageListContainer}>
        {#each messages as message}
            <li class="message-item">
                <div class="message-sender">
                    <img
                        class="sender-profile-image"
                        src={showImage(message.sender_profile_image)}
                        alt="Sender_Profile_Image"
                    />
                    <span class="sender-gamertag">
                        {message.sender_gamertag}
                    </span>
                </div>
                <div class="message-content">
                    <p class="message-text">{message.message}</p>
                    <span class="message-timestamp">{message.created_at}</span>
                </div>
            </li>
        {/each}
    </ul>
    <div class="message-input">
        <input
            type="text"
            class="form-input"
            bind:value={newMessage}
            placeholder="Type your message..."
        />
        <button on:click={sendMessage}>Send</button>
    </div>
</div>

<style>
    .chat-popup {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 400px;
        background-color: rgba(48, 76, 96, 0.9);
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 10px;
        z-index: 3;
    }

    .chat-header {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    .chat-title {
        flex-grow: 1;
        text-align: center;
    }

    .chat-title h3 {
        margin: 0;
        font-weight: bold;
        font-size: 18px;
    }

    .chat-title h3:first-child {
        margin-bottom: 5px;
    }

    .close-button {
        background-color: #67c2dd41;
        border-color: #e5e047;
        padding: 5px 10px;
        margin-left: 10px;
    }

    .close-button:hover {
        background-color: #f35348ce;
    }

    .message-list {
        list-style: none;
        padding: 0;
        max-height: 300px;
        overflow-y: auto;
        margin-bottom: 10px;
        border-bottom: 1px solid #ccc;
    }

    .message-item {
        display: flex;
        align-items: center;
        padding: 5px 0;
    }

    .message-sender {
        display: flex;
        align-items: center;
        margin-right: 10px;
    }

    .sender-profile-image {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 8px;
    }

    .sender-gamertag {
        font-size: 14px;
        font-weight: bold;
    }

    .message-content {
        flex-grow: 1;
    }

    .message-text {
        font-size: 16px;
        margin: 0;
        margin-bottom: 5px;
    }

    .message-timestamp {
        font-size: 12px;
        color: #777;
    }

    .message-input {
        display: flex;
        align-items: center;
        margin-top: 10px;
    }

    .message-input input {
        flex-grow: 1;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .message-input button {
        background-color: #67c2dd41;
        border-color: #e5e047;
        padding: 6px 12px;
        font-weight: bold;
        font-size: 14px;
        letter-spacing: 1px;
        border-radius: 4px;
        margin-left: 10px;
        transition: background-color 0.3s;
    }

    .message-input button:hover {
        background-color: rgba(71, 135, 155, 0.255);
    }
</style>
