<script>
    import { onMount, afterUpdate } from "svelte";
    import {
        session,
        serverURL,
        serverEndpoints,
    } from "../../stores/stores.js";
    import toast from "svelte-french-toast";
    import defaultProfileImage from "../../assets/profileDefault.png";
    import { useNavigate, useLocation } from "svelte-navigator";
    const navigate = useNavigate();
    const location = useLocation();

    let user = {};
    let gamertag = "";

    onMount(() => {
        fetchUser();
    });

    afterUpdate(() => {
        fetchUser();
    });

    async function fetchUser() {
        gamertag = $location.pathname.split("/").pop();
        const url =
            $serverURL +
            $serverEndpoints.user.searchUsers +
            "/profile/" +
            gamertag;
        const response = await fetch(url, { credentials: "include" });
        const data = await response.json();
        if (response.ok) {
            user = data.data[0];
        } else {
            toast.error(data.message);
        }
    }

    const showImage = (avatar) => {
        if (!avatar) {
            return defaultProfileImage;
        }

        return `${$serverURL}/images/avatar/${avatar}`;
    };

    function ownedGames() {
        navigate("/userGameList", { replace: true });
    }

    function wishlist() {
        navigate("/wishlist", { replace: true });
    }

    async function addFriend() {
        console.log(user)
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
        } else {
            toast.error(data.message, {
                duration: 5000,
                position: "bottom-right",
                style: "border-radius: 200px; background: #333; color: #fff;",
            });
        }
    }
</script>

<div class="container-fluid">
    <div class="row">
        <div class="col-sm-6 col-xs mx-auto content-box">
            <div class="col-lg-12 mt-5">
                <img
                    class="img-fluid mx-auto d-block rounded-4"
                    src={showImage(user.profile_image)}
                    width="150"
                    alt="Profile_image"
                />
            </div>
            <div class="col-lg-12 title text-gradient">
                {gamertag}
            </div>

            <div class="col-lg-12 profile-form">
                <div class="row">
                    <h3 class="col-auto">Information</h3>
                </div>

                <div class="form-group">
                    <label class="form-control-label" for="name"> Name </label>

                    <input
                        type="text"
                        value={user.name}
                        class="form-control form-input"
                        readonly
                    />
                </div>

                <div class="form-group">
                    <label class="form-control-label" for="gamertag">
                        Gamertag
                    </label>
                    <input
                        type="text"
                        value={gamertag}
                        class="form-control form-input"
                        readonly
                    />
                </div>

                <div class="form-group">
                    <label class="form-control-label" for="email">
                        E-mail
                    </label>
                    <input
                        type="email"
                        value={user.email}
                        class="form-control form-input"
                        readonly
                    />
                </div>

                <div class="col-lg-12 title text-gradient profile-button">
                    <button
                        class="btn btn-outline-primary"
                        on:click={ownedGames}
                    >
                        <i class="bi bi-controller" />
                        Owned Games
                    </button>
                    <button class="btn btn-outline-primary" on:click={wishlist}>
                        <i class="bi bi-controller" />
                        Wishlist
                    </button>
                    <button
                        class="btn btn-outline-primary"
                        on:click={addFriend}
                    >
                        <i class="bi bi-controller" />
                        Add Friend
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .title {
        margin-top: 35px;
        text-align: center;
        font-size: 30px;
        letter-spacing: 2px;
        font-weight: bold;
        color: #ecf0f5;
    }

    .profile-form {
        margin-top: 25px;
        text-align: left;
    }

    .form-group {
        margin-bottom: 40px;
        outline: 0px;
    }

    .form-control:focus {
        border-color: inherit;
        box-shadow: none;
        border-bottom: 2px solid #0dde29;
        outline: 0;
        background-color: #1a2226;
        color: #ecf0f5;
    }

    input:focus {
        outline: none;
        box-shadow: 0 0 0;
    }

    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 1000px #1a2226 inset !important;
        -webkit-text-fill-color: #ecf0f5 !important;
    }

    .form-control-label {
        font-size: 12px;
        color: rgb(103, 193, 221);
        font-weight: bold;
        letter-spacing: 1px;
    }

    .btn-outline-primary {
        border-color: #e5e047;
        font-weight: bold;
        letter-spacing: 1px;
    }

    .btn-outline-primary:hover {
        background-color: #67c2dd41;
        color: white;
        right: 0px;
    }

    .profile-button {
        padding-right: 0px;
        text-align: center;
        margin-bottom: 25px;
    }

    .edit-button-container {
        display: flex;
        align-items: center;
        padding: 0;
    }

    .edit-button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
    }

    .button {
        margin: auto;
        background-color: #67c2dd41;
        border-color: #e5e047;
        font-weight: bold;
        font-size: 16px;
        padding: 6px 12px;
        letter-spacing: 1px;
    }

    .save-button:hover {
        background-color: #47879b41;
    }

    .cancel-button:hover {
        background-color: #ff000041;
    }
</style>
