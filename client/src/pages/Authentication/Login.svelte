<script>
    import { useNavigate } from "svelte-navigator";
    import {
        serverURL,
        serverEndpoints,
        session,
    } from "../../stores/stores.js";
    import toast, { Toaster } from "svelte-french-toast";
    import Cookies from "js-cookie";
    import logo from "../../assets/GamingOasisLogoTransparrent.png";

    const navigate = useNavigate();

    let email;
    let password;

    async function handleSubmit(event) {
        event.preventDefault();
        const url = $serverURL + $serverEndpoints.authentication.login;
        const userCredentials = { email: email, password: password };

        try {
            const response = await fetch(url, {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userCredentials),
            });
            const data = await response.json();

            if (response.ok) {
                session.set(data.session);
                toast.success(data.message, {
                    duration: 5000,
                    position: "bottom-right",
                    style: "border-radius: 200px; background: #333; color: #fff;",
                });
                navigate("/profile", { replace: true });
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

<Toaster />

<div class="container-fluid login-container">
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
            <div class="col-lg-12 login-title text-gradient">Log in</div>

            <div class="col-lg-12 login-form">
                <form on:submit={handleSubmit} method="post">
                    <div class="form-group">
                        <label class="form-control-label" for="email">
                            E-MAIL
                        </label>
                        <input
                            bind:value={email}
                            type="email"
                            name="email"
                            class="form-control form-input"
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

                    <div class="form-group text-format row mb-2">
                        <p class="col">
                            Don’t have an account?
                            <a class="aStyling" href="/signup">
                                Sign Up Free!
                            </a>
                        </p>
                        <a class="col aStyling text-end" href="/forgot">
                            Forgot password?
                        </a>
                    </div>

                    <div class="col-lg-12 login-button text-gradient">
                        <button type="submit" class="btn btn-outline-primary">
                            LOGIN
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<style>
    .login-container {
        max-width: 50em;
    }

    .login-title {
        margin-top: 35px;
        text-align: center;
        font-size: 30px;
        letter-spacing: 2px;
        font-weight: bold;
    }

    .login-form {
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

    .login-button {
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
