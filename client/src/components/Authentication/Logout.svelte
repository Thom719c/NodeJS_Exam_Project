<script>
    import {
        session,
        serverURL,
        serverEndpoints,
    } from "../../stores/stores.js";
    import { useNavigate } from "svelte-navigator";
    import { link } from "svelte-navigator";

    export let isLink = false;

    const navigate = useNavigate();

    async function handleLogout() {
        const url = $serverURL + $serverEndpoints.authentication.logout;

        try {
            const response = await fetch(url, {credentials: "include"});
            const data = await response.json();
            if (response.ok) {
                session.set(data.user);
            }
        } catch (error) {
            console.log(error);
        }

        navigate("/", { replace: true });
    }
</script>

{#if !isLink}
    <button on:click={handleLogout}> Logout </button>
{:else}
    <a class="nav-link" href="logout" use:link on:click={handleLogout}>
        <i class="bi bi-box-arrow-right" />
    </a>
{/if}
