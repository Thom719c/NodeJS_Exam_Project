<script>
    import { onMount } from "svelte";
    import { session, serverURL } from "../../stores/stores.js";

    onMount(async () => {
        const response = await fetch($serverURL + "/users/me", {
            credentials: "include",
        });
        const result = await response.json();
        session.set(result.data);
    });
</script>
