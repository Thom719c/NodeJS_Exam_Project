<script>
    import { useNavigate } from "svelte-navigator";
    import { serverURL, serverEndpoints } from "../../stores/stores.js";
    import toast from "svelte-french-toast";
    import logo from "../../assets/GamingOasisLogoTransparrent.png";

    const navigate = useNavigate();

    let name;
    let email;
    let gamertag;
    let phoneNumber;
    let password;
    let confirmPassword;

    async function handleSubmit() {
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.", {
                duration: 5000,
                position: "bottom-right",
                style: "border-radius: 200px; background: #333; color: #fff;",
            });
            return;
        }

        const userCredentials = {
            name: name,
            email: email,
            gamertag: gamertag,
            phoneNumber: phoneNumber,
            password: password,
            confirmPassword: confirmPassword,
        };

        try {
            const url = $serverURL + $serverEndpoints.authentication.signup;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userCredentials),
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

<div class="container-fluid signup-container">
    <div class="row">
        <div class="col-sm-6 col-xs mx-auto content-box">
            <div class="col-lg-12 mt-5">
                <img
                    class="img-fluid mx-auto d-block"
                    src={logo}
                    width="300"
                    alt="Logo"
                />
            </div>
            <div class="col-lg-12 signup-title text-gradient">
                Sign Up Free!
            </div>

            <div class="col-lg-12 signup-form">
                <form
                    on:submit|preventDefault={handleSubmit}
                    method="post"
                    autocomplete="off"
                >
                    <div class="form-group">
                        <label class="form-control-label" for="name">
                            NAME
                        </label>
                        <input
                            bind:value={name}
                            type="text"
                            name="name"
                            class="form-control form-input"
                            placeholder="Elena Michaels"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" for="gamertag">
                            GAMERTAG
                        </label>
                        <input
                            bind:value={gamertag}
                            type="text"
                            name="gamertag"
                            class="form-control form-input"
                            placeholder="LunaRain"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" for="email">
                            E-MAIL
                        </label>
                        <input
                            bind:value={email}
                            type="email"
                            name="email"
                            class="form-control form-input"
                            placeholder="Example@domain.com"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" for="phoneNumber">
                            PHONE NUMBER
                        </label>
                        <input
                            bind:value={phoneNumber}
                            type="tel"
                            name="phoneNumber"
                            class="form-control form-input"
                            placeholder="88888888"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" for="password">
                            PASSWORD
                        </label>
                        <input
                            bind:value={password}
                            type="password"
                            name="password"
                            class="form-control form-input"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" for="confirmPassword">
                            CONFIRM PASSWORD
                        </label>
                        <input
                            bind:value={confirmPassword}
                            type="password"
                            name="confirmPassword"
                            class="form-control form-input"
                            required
                        />
                    </div>

                    <div class="form-group text-format row mb-2">
                        <p class="col">
                            Have an account? <a
                                class="aStyling"
                                data-panel=".panel-signup"
                                href="/login"
                            >
                                Login!
                            </a>
                        </p>
                    </div>

                    <div class="col-lg-12 signup-button text-gradient">
                        <button class="btn btn-outline-primary">
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<style>
    .signup-container {
        max-width: 50em;
    }

    .signup-title {
        margin-top: 35px;
        text-align: center;
        font-size: 30px;
        letter-spacing: 2px;
        font-weight: bold;
    }

    .signup-form {
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

    .signup-button {
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
