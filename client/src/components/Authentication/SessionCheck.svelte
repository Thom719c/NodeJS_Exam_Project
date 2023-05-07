<script>
    import { onMount } from "svelte";
    import Cookies from "js-cookie";
    import { session } from "../../stores/stores.js";

    // check session cookie on page load
    onMount(async () => {
        const userSession = Cookies.get("userSession");
        if (userSession) {
            // user is logged in
            session.set(JSON.parse(userSession));
        } else {
            // user is not logged in
        }
    });
</script>
