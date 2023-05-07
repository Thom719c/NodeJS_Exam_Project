<script>
    import { Router, Link, link, Route } from "svelte-navigator";
    import { session } from "../../stores/stores";
    import Home from "../../pages/Home/Home.svelte";
    import GameMarket from "../../pages/Game/GameMarket.svelte";
    import GameInfo from "../../pages/Game/GameInfo.svelte";
    import Login from "../../pages/Authentication/Login.svelte";
    import Profile from "../../pages/Profile/Profile.svelte";
    import PrivateRoute from "../PrivateRoutes/PrivateRoute.svelte";
    import Logout from "../Authentication/Logout.svelte";
    import UserGameList from "../../pages/Game/UserGameList.svelte";
</script>

<Router>
    <nav
        class="navbar navbar-expand-lg bg-body-tertiary navbar-dark"
        data-bs-theme="dark"
    >
        <div class="container-fluid">
            <a class="navbar-brand" href="/">
                <img
                    id="logo"
                    src="src/assets/GamingOasisLogoIconTransparrent.png"
                    width="50"
                    alt="Logo"
                />
            </a>
            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon" />
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" href="/" use:link>Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/games" use:link> Games </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/gameMarket" use:link>
                            Game Market
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/video" use:link> Video </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/events" use:link> Events </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/communnityHub" use:link>
                            Communnity Hub
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/feedback" use:link>
                            Feedback/Contact us
                        </a>
                    </li>
                </ul>
                <ul class="navbar-nav">
                    {#if $session}
                        <li class="nav-item">
                            <a class="nav-link" href="/profile" use:link
                                >Profile</a
                            >
                        </li>
                        <li class="nav-item">
                            <Logout isLink={true} />
                        </li>
                    {:else}
                        <li class="nav-item">
                            <a class="nav-link" href="/login" use:link>Login</a>
                        </li>
                    {/if}
                </ul>
            </div>
        </div>
    </nav>

    <main>
        <Route path="/login">
            <Login />
        </Route>

        <Route path="/">
            <Home />
        </Route>

        <Route path="/gameMarket">
            <GameMarket />
        </Route>

        <Route path="/gameInfo" component={GameInfo} />

        <!-- <Route path="signup" component={Signup} primary={false}>
            <Signup />
        </Route> -->

        <PrivateRoute path="/profile">
            <Profile />
        </PrivateRoute>

        <PrivateRoute path="/userGameList">
            <UserGameList />
        </PrivateRoute>
    </main>
</Router>

<style>
    nav {
        display: flex;
        justify-content: center;
        align-self: center;
        font-size: 18px;
        gap: 20px;
        z-index: 2;
    }
</style>
