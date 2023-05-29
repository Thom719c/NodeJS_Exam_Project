<script>
    import { useNavigate } from "svelte-navigator";
    import { serverURL, serverEndpoints } from "../../stores/stores.js";
    import toast from "svelte-french-toast";
    import logo from "../../assets/GamingOasisLogoTransparrent.png";

    const navigate = useNavigate();

    let subject;
    let email;
    let message;

    async function handleSubmit() {
        const url = $serverURL + $serverEndpoints.mailer.contact;
        const userCredentials = {
            subject: subject,
            email: email,
            message: message,
        };
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
            toast.success(data.message, {
                duration: 5000,
                position: "bottom-right",
                style: "border-radius: 200px; background: #333; color: #fff;",
            });
            setTimeout(() => {
                navigate("/", { replace: true });
            }, 2000);
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
                    class="img-fluid mx-auto d-block"
                    src={logo}
                    width="300"
                    alt="Logo"
                />
            </div>
            <div class="col-lg-12 title text-gradient">
                Please give us feedback
            </div>

            <div class="col-lg-12 feedback-form">
                <form on:submit|preventDefault={handleSubmit} method="post">
                    <div class="form-group">
                        <label class="form-control-label" for="subject">
                            Subject
                        </label>
                        <input
                            type="text"
                            name="subject"
                            class="form-control form-input"
                            placeholder="What is your message about?"
                            required
                            bind:value={subject}
                        />
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" for="email">
                            E-Mail
                        </label>
                        <input
                            type="email"
                            name="email"
                            class="form-control form-input"
                            placeholder="Example@domain.com"
                            required
                            bind:value={email}
                        />
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" for="message">
                            Message
                        </label>
                        <textarea
                            cols="30"
                            rows="10"
                            name="message"
                            class="form-control"
                            placeholder="Enter your question or feedback"
                            bind:value={message}
                        />
                    </div>

                    <div
                        class="col-lg-12 feedback-button-container text-gradient"
                    >
                        <button type="submit" class="feedback-button">
                            Send feedback
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<style>
    .title {
        color: #ecf0f5;
        margin-top: 35px;
        font-size: 30px;
        text-align: center;
        font-weight: bold;
        letter-spacing: 2px;
    }

    .feedback-form {
        margin-top: 25px;
        text-align: left;
    }

    textarea {
        background-color: #1a2226;
        color: #ecf0f5;
        border-bottom: 2px solid #0db8de;
    }

    textarea::placeholder {
        color: #777777;
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

    .feedback-button {
        margin: auto;
        background-color: #67c2dd41;
        border-color: #e5e047;
        font-weight: bold;
        font-size: 16px;
        padding: 6px 12px;
        letter-spacing: 1px;
    }

    .feedback-button:hover {
        background-color: rgba(71, 135, 155, 0.255);
    }

    .feedback-button-container {
        padding-right: 0px;
        text-align: center;
        margin-bottom: 25px;
    }
</style>
