<script>
  import { useNavigate, useLocation } from "svelte-navigator";
  import { session } from "../../stores/stores.js";
  import { SyncLoader } from "svelte-loading-spinners";
  import { onMount } from "svelte";

  const navigate = useNavigate();
  const location = useLocation();
  let isLoading = true;

  onMount(async () => {
    let isSessionInitialized = false;

    session.subscribe((value) => {
      isLoading = false;
      if (!isSessionInitialized) {
        isSessionInitialized = true;
        return;
      }

      if (!value) {
        navigate("/login", {
          state: { from: $location.pathname },
          replace: true,
        });
      }
    });
  });
</script>

{#if isLoading}
  <div class="d-flex justify-content-center">
    <SyncLoader size="60" color="#FF3E00" unit="px" duration="1s" />
  </div>
{:else if $session}
  <slot />
{/if}
