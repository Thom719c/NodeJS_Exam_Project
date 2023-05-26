<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    let password = "";

    function submitPassword() {
        dispatch("submit", password);
        password = "";
    }

    function closeHandler() {
        dispatch("cancel");
        password = "";
    }
</script>

<div class="popup-background">
    <div class="popup-container">
        <div class="header">
            <h2>Enter Password</h2>
            <button class="close-btn" on:click={closeHandler}>×</button>
        </div>
        <div class="content">
            <input
                type="password"
                placeholder="Password"
                bind:value={password}
            />
            <div class="button-container">
                <button class="cancel-btn" on:click={closeHandler}
                    >Cancel</button
                >
                <button class="submit-btn" on:click={submitPassword}
                    >Submit</button
                >
            </div>
        </div>
    </div>
</div>

<style>
    .popup-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }

    .popup-container {
        background-color: #1e1e1e;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.25);
        width: 450px;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    }

    .header h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 700;
    }

    .close-btn {
        border: none;
        background: none;
        cursor: pointer;
        font-size: 30px;
        font-weight: 700;
        color: #757575;
        padding: 0;
    }

    .content {
        padding: 30px 20px;
    }

    input[type="password"] {
        padding: 0.5rem;
        border-radius: 5px;
        border: none;
        background-color: #333;
        color: #f5f5f5;
        margin-bottom: 1rem;
        width: 100%;
        box-sizing: border-box;
    }

    .button-container {
        display: flex;
        justify-content: space-around;
        width: 100%;
    }

    button {
        border: none;
        border-radius: 5px;
        padding: 0.4rem 1rem;
        font-size: 16px;
        font-weight: 700;
        color: #f5f5f5;
        background-color: #4caf50;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
    }

    .submit-btn:hover {
        background-color: #357e2a;
    }

    .cancel-btn {
        background-color: #0088cc;
        color: #fff;
        margin-right: 10px;
    }

    .cancel-btn:hover {
        background-color: #0077b3;
    }

    button + button {
        margin-left: 1rem;
    }
</style>
