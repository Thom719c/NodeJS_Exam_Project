<script>
    import { serverURL, serverEndpoints } from "../../stores/stores.js";
    import toast from "svelte-french-toast";
    import { useNavigate } from "svelte-navigator";
    import GamingOasisLogoIconTransparrent from "../../assets/GamingOasisLogoIconTransparrent.png"

    const navigate = useNavigate();

    let email;

    async function handleChangePassword() {
        const url = $serverURL + $serverEndpoints.mailer.forgotpassword;

        try {
            const response = await fetch(url, {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message, {
                    duration: 5000,
                    position: "bottom-right",
                    style: "border-radius: 200px; background: #333; color: #fff;",
                });
                navigate("/login", { replace: true });
            } else {
                toast.error(data.message, {
                    duration: 5000,
                    position: "bottom-right",
                    style: "border-radius: 200px; background: #333; color: #fff;",
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
</script>

<div class="container-fluid forgot-container">
    <div class="row">
        <div class="col-6 mx-auto content-box">
            <div class="col-lg-12 mt-5">
                <img
                    class="img-fluid mx-auto d-block"
                    src={GamingOasisLogoIconTransparrent}
                    width="150"
                    alt="Logo"
                />
            </div>
            <div class="col-lg-12 title text-gradient">Forgot Password</div>
            <div class="col-lg-12 text-gradient">
                <h5>Write your email below</h5>
            </div>

            <div class="col-lg-12 forgot-reset-form">
                <form
                    on:submit|preventDefault={handleChangePassword}
                    method="post"
                >
                    <div class="form-group">
                        <label class="form-control-label" for="email"
                            >E-Mail</label
                        >
                        <input
                            type="email"
                            name="email"
                            class="form-control form-input"
                            placeholder="Example@domain.com"
                            required
                            bind:value={email}
                        />
                    </div>

                    <div class="form-group text-format row mb-2">
                        <p class="col">
                            Go to <a
                                class="aStyling"
                                data-panel=".panel-signup"
                                href="/login">Login!</a
                            >
                        </p>
                    </div>

                    <div class="col-lg-12 forgot-reset-button text-gradient">
                        <button type="submit" class="btn btn-outline-primary">
                            Change password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<style>
    .forgot-container {
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

    .text-format {
        font-size: 14px;
    }
    .aStyling {
        color: #0db8de;
    }
</style>
