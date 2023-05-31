<script>
    import { onMount } from "svelte";
    import {
        session,
        serverURL,
        serverEndpoints,
    } from "../../stores/stores.js";
    import toast from "svelte-french-toast";
    import SessionCheck from "../../components/Authentication/SessionCheck.svelte";
    import Logout from "../../components/Authentication/Logout.svelte";
    import PopUp from "../../components/Authentication/PopUp.svelte";
    import defaultProfileImage from "../../assets/profileDefault.png";
    import { useNavigate } from "svelte-navigator";
    const navigate = useNavigate();

    let profileImage = "";
    let imageUrl = "";
    $: imageUrl = profileImage
        ? `${$serverURL}/images/avatar/${profileImage}`
        : defaultProfileImage;
    let isEditMode = false;
    let isPopupOpen = false;
    let originalUserData = null;
    let selectedFile;
    let previewImageUrl = null;

    onMount(async () => {
        const url = $serverURL + $serverEndpoints.user.profileimage;
        const response = await fetch(url, { credentials: "include" });
        const data = await response.json();
        if (response.ok) {
            profileImage = data.data.profile_image;
        } else {
            toast.error(data.message);
        }
    });

    function enterEditMode() {
        isEditMode = true;
        originalUserData = { ...$session };
    }

    function exitEditMode() {
        isEditMode = false;
        originalUserData = null;
    }

    function handleOpenPopup() {
        isPopupOpen = true;
    }

    function handleCancelPopup() {
        isPopupOpen = false;
    }

    async function handlePasswordSubmission(event) {
        if (!$session) return;
        if (
            originalUserData.name === $session.name &&
            originalUserData.email === $session.email &&
            !selectedFile
        ) {
            // No changes made, just exit edit mode
            isPopupOpen = false;
            exitEditMode();
            return;
        }

        const password = event.detail;
        if (!password) {
            toast.error("Password is required.");
            return;
        }

        // Validate the user's password
        const urlValidate =
            $serverURL + $serverEndpoints.authentication.validatepassword;
        const response = await fetch(urlValidate, {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password: password,
            }),
        });

        if (!response.ok) {
            toast.error("Incorrect password.");
            return;
        }

        if (!selectedFile) {
            updateProfile();
            return;
        }

        uploadImage();
    }

    async function uploadImage() {
        const url = $serverURL + "/fileform?purpose=profile";
        const formData = new FormData();
        formData.append("file", selectedFile);
        const response = await fetch(url, {
            credentials: "include",
            method: "POST",
            body: formData,
        });
        const data = await response.json();

        if (response.ok) {
            toast.success(data.message, {
                duration: 5000,
                position: "bottom-right",
                style: "border-radius: 200px; background: #333; color: #fff;",
            });
            updateProfile(data.data);
            exitEditMode();
        } else {
            toast.error(data.message, {
                duration: 5000,
                position: "bottom-right",
                style: "border-radius: 200px; background: #333; color: #fff;",
            });
        }
    }

    async function updateProfile(imageName) {
        // Password is correct, update the user's profile
        const updatedUserData = { ...$session };
        updatedUserData.name = originalUserData.name;
        updatedUserData.email = originalUserData.email;
        updatedUserData.profileImage = imageName;

        const urlChangeUser =
            $serverURL + $serverEndpoints.authentication.updateaccount;
        const updateResponse = await fetch(urlChangeUser, {
            credentials: "include",
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUserData),
        });
        const data = await updateResponse.json();

        if (updateResponse.ok) {
            toast.success(data.message, {
                duration: 5000,
                position: "bottom-right",
                style: "border-radius: 200px; background: #333; color: #fff;",
            });
            session.set(data.session.user);
            profileImage = imageName;
            isPopupOpen = false;
            exitEditMode();
        } else {
            toast.error(data.message, {
                duration: 5000,
                position: "bottom-right",
                style: "border-radius: 200px; background: #333; color: #fff;",
            });
        }
    }

    function handleFileInputChange(event) {
        const file = event.target.files[0];
        selectedFile = file;

        // Create a preview URL for the selected image
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImageUrl = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    function ownedGames() {
        navigate("/userGameList", { replace: true });
    }

    function wishlist() {
        navigate("/wishlist", { replace: true });
    }

    function friendList() {
        navigate("/friendList", { replace: true });
    }
</script>

<SessionCheck />

<div class="container-fluid">
    {#if isPopupOpen}
        <PopUp
            on:submit={handlePasswordSubmission}
            on:cancel={handleCancelPopup}
        />
    {/if}
    <div class="row">
        <div class="col-sm-6 col-xs mx-auto content-box">
            <div class="col-lg-12 mt-5">
                <img
                    class="img-fluid mx-auto d-block rounded-4"
                    src={previewImageUrl || imageUrl}
                    width="150"
                    alt="Profile_image"
                />
                {#if isEditMode}
                    <input
                        name="file"
                        type="file"
                        accept="image/*"
                        on:change={handleFileInputChange}
                    />
                {/if}
            </div>
            <div class="col-lg-12 title text-gradient">
                Welcome {$session.gamertag}
            </div>

            <div class="col-lg-12 profile-form">
                <div class="row">
                    <h3 class="col-auto">Information</h3>
                    {#if !isEditMode}
                        <div class="col text-gradient edit-button-container">
                            <button
                                class="btn btn-outline-primary edit-button"
                                on:click={enterEditMode}
                            >
                                <i class="bi bi-pencil-square" />
                            </button>
                        </div>
                    {/if}
                </div>

                <div class="form-group">
                    <label class="form-control-label" for="name"> Name </label>
                    {#if isEditMode}
                        <input
                            type="text"
                            bind:value={originalUserData.name}
                            class="form-control form-input"
                        />
                    {:else}
                        <input
                            type="text"
                            value={$session.name}
                            class="form-control form-input"
                            readonly
                        />
                    {/if}
                </div>

                {#if !isEditMode}
                    <div class="form-group">
                        <label class="form-control-label" for="gamertag">
                            Gamertag
                        </label>
                        <input
                            type="text"
                            value={$session.gamertag}
                            class="form-control form-input"
                            readonly
                        />
                    </div>
                {/if}
                <div class="form-group">
                    <label class="form-control-label" for="email">
                        E-mail
                    </label>
                    {#if isEditMode}
                        <input
                            type="email"
                            bind:value={originalUserData.email}
                            class="form-control form-input"
                        />
                    {:else}
                        <input
                            type="email"
                            value={$session.email}
                            class="form-control form-input"
                            readonly
                        />
                    {/if}
                </div>

                {#if isEditMode}
                    <div class="profile-button text-gradient">
                        <button
                            class="button cancel-button"
                            on:click={exitEditMode}
                        >
                            <i class="bi bi-x-circle" />
                            Cancel
                        </button>
                        <button
                            class="button save-button"
                            on:click={handleOpenPopup}
                        >
                            <i class="bi bi-save" />
                            Save Changes
                        </button>
                    </div>
                {/if}

                {#if !isEditMode}
                    <div class="col-lg-12 profile-button">
                        <Logout />
                    </div>

                    <div class="col-lg-12 title text-gradient profile-button">
                        <button
                            class="btn btn-outline-primary"
                            on:click={ownedGames}
                        >
                            <i class="bi bi-controller" />
                            Owned Games
                        </button>
                        <button
                            class="btn btn-outline-primary"
                            on:click={wishlist}
                        >
                            <i class="bi bi-controller" />
                            Wishlist
                        </button>
                        <button class="btn btn-outline-primary" on:click={friendList}>
                            <i class="bi bi-person-fill-add" />
                            Friends
                        </button>
                    </div>
                {/if}
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
        width: 170px;
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
