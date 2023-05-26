<script>
    import { onMount } from "svelte";
    import Cookies from "js-cookie";
    import { session, serverURL } from "../../stores/stores.js";

    /*     // check session cookie on page load
    onMount(async () => {
        const userSession = Cookies.get("userSession");
        if (userSession) {
            // user is logged in
            session.set(JSON.parse(userSession));
        } else {
            // user is not logged in
        }
    }); */
    onMount(async () => {
        const response = await fetch($serverURL + "/users/me", {
            credentials: "include",
        });
        const result = await response.json();
        session.set(result.data);
    });
</script>
