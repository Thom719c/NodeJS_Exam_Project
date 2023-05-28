<script>
    import { onMount } from "svelte";

    export let src;
    let iframe;

    onMount(() => {
        iframe.src = src;
    });
</script>

<div class="unityGameWrapper mb-3">
    <iframe
        src=""
        bind:this={iframe}
        class="unityGameContainer"
        scrolling="no"
        title="Game"
    />
</div>

<style>
    .unityGameWrapper {
        padding-bottom: 53%;
        position: relative;
    }

    .unityGameContainer {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 960px;
        max-height: 600px;
        width: 100%;
        height: 100%;
    }
</style>
