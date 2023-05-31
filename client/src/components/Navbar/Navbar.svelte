<script>
    import { Router, link, Route } from "svelte-navigator";
    import { session } from "../../stores/stores";
    import { Toaster } from "svelte-french-toast";
    import Home from "../../pages/Home/Home.svelte";
    import GameMarket from "../../pages/Game/GameMarket.svelte";
    import GameInfo from "../../pages/Game/GameInfo.svelte";
    import Login from "../../pages/Authentication/Login.svelte";
    import Profile from "../../pages/Profile/Profile.svelte";
    import PrivateRoute from "../PrivateRoutes/PrivateRoute.svelte";
    import Logout from "../Authentication/Logout.svelte";
    import UserGameList from "../../pages/Game/UserGameList.svelte";
    import CommunityHub from "../../pages/CommunityHub/CommunityHub.svelte";
    import Signup from "../../pages/Authentication/Signup.svelte";
    import UserWishlist from "../../pages/Game/UserWishlist.svelte";
    import PostDetails from "../../pages/CommunityHub/PostDetails.svelte";
    import logoIcon from "../../assets/GamingOasisLogoIconTransparrent.png";
    import Contact from "../../pages/Contact/Contact.svelte";
    import Games from "../../pages/Game/Games.svelte";
    import Game from "../../pages/Game/Game.svelte";
    import ForgotPassword from "../../pages/Authentication/ForgotPassword.svelte";
    import ResetPassword from "../../pages/Authentication/ResetPassword.svelte";
    import SearchUsers from "../../pages/SearchUsers/SearchUsers.svelte";
    import UserProfile from "../../pages/Profile/UserProfile.svelte";
    import UserList from "../../pages/SearchUsers/UserList.svelte";
    import FriendList from "../Users/FriendList.svelte";
</script>

<Router>
    <nav
        class="navbar navbar-expand-lg bg-body-tertiary navbar-dark"
        data-bs-theme="dark"
    >
        <div class="container-fluid">
            <a class="navbar-brand" href="/">
                <img id="logo" src={logoIcon} width="50" alt="Logo" />
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
                        <a class="nav-link" href="/communityHub" use:link>
                            Community Hub
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/contact" use:link>
                            Contact us
                        </a>
                    </li>
                </ul>
                <ul class="navbar-nav">
                    {#if $session}
                        <li class="nav-item my-auto d-flex align-items-center justify-content-center">
                            <SearchUsers />
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/profile" use:link>
                                Profile
                            </a>
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

    <Toaster />

    <main>
        <Route path="/login" primary={false}>
            <Login />
        </Route>

        <Route path="/">
            <Home />
        </Route>

        <Route path="/games" primary={false}>
            <Games />
        </Route>

        <Route path="/games/:id">
            <Game />
        </Route>

        <Route path="/gameMarket" primary={false}>
            <GameMarket />
        </Route>

        <Route path="/gameInfo" primary={false}>
            <GameInfo />
        </Route>

        <Route path="/communityHub" primary={false}>
            <CommunityHub />
        </Route>

        <Route path="/communityHub/post/:id" primary={false}>
            <PostDetails />
        </Route>

        <Route path="/contact" primary={false}>
            <Contact />
        </Route>

        <Route path="/signup" component={Signup} primary={false}>
            <Signup />
        </Route>

        <PrivateRoute path="/profile">
            <Profile />
        </PrivateRoute>

        <PrivateRoute path="/profile/:gamertag">
            <UserProfile />
        </PrivateRoute>

        <PrivateRoute path="/users/:searchQuery">
            <UserList />
        </PrivateRoute>

        <PrivateRoute path="/userGameList">
            <UserGameList />
        </PrivateRoute>

        <PrivateRoute path="/wishlist">
            <UserWishlist />
        </PrivateRoute>

        <PrivateRoute path="/friendList">
            <FriendList />
        </PrivateRoute>

        <Route path="/forgot-password" primary={false}>
            <ForgotPassword />
        </Route>
        <Route path="/reset-password" primary={false}>
            <ResetPassword />
        </Route>
    </main>
</Router>

<style>
    nav {
        display: flex;
        justify-content: center;
        align-self: center;
        font-size: 18px;
        gap: 20px;
        z-index: 3;
    }
</style>
