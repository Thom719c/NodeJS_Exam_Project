<script>
    import { serverURL, serverEndpoints } from "../../stores/stores.js";
    import toast from "svelte-french-toast";
    import { useNavigate, useLocation } from "svelte-navigator";
    import logo from "../../assets/GamingOasisLogoTransparrent.png";

    const navigate = useNavigate();
    const location = useLocation();

    let email;
    let newPassword;
    let confirmPassword;

    async function handleChangePassword() {
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match", {
                duration: 5000,
                position: "bottom-right",
                style: "border-radius: 200px; background: #333; color: #fff;",
            });
            return;
        }

        const params = new URLSearchParams($location.search);
        const token = params.get("token");
        const url = $serverURL + $serverEndpoints.authentication.resetpassword;
        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    newPassword,
                    confirmPassword,
                    token,
                }),
            });

            const data = await response.json();

            const toastSettings = {
                duration: 5000,
                position: "bottom-right",
                style: "border-radius: 200px; background: #333; color: #fff;",
            };

            if (response.ok) {
                // @ts-ignore
                toast.success(data.message, toastSettings);
                navigate("/login", { replace: true });
            } else {
                // @ts-ignore
                toast.error(data.message, toastSettings);
            }
        } catch (error) {
            console.error(error);
        }
    }
</script>

<div class="container-fluid reset-container">
    <div class="row">
        <div class="col-6 mx-auto content-box">
            <div class="col-lg-12 mt-5">
                <img
                    class="img-container img-fluid mx-auto d-block"
                    src={logo}
                    width="300"
                    alt="Logo"
                />
            </div>
            <div class="col-lg-12 title text-gradient">Reset Password</div>

            <div class="col-lg-12 forgot-reset-form">
                <form on:submit|preventDefault={handleChangePassword}>
                    <div class="form-group">
                        <label class="form-control-label" for="newPassword">
                            New password
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            class="form-control form-input"
                            required
                            bind:value={newPassword}
                        />
                    </div>

                    <div class="form-group">
                        <label class="form-control-label" for="confirmPassword">
                            Confirm password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            class="form-control form-input"
                            required
                            bind:value={confirmPassword}
                        />
                    </div>

                    <div class="col-lg-12 forgot-reset-button text-gradient">
                        <button type="submit" class="btn btn-outline-primary">
                            Reset Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<style>
    .reset-container {
        max-width: 50em;
    }

    .title {
        margin-top: 35px;
        text-align: center;
        font-size: 30px;
        letter-spacing: 2px;
        font-weight: bold;
    }

    .forgot-reset-form {
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
    }

    .forgot-reset-button {
        padding-right: 0px;
        text-align: center;
        margin-bottom: 25px;
    }
</style>
