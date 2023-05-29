import { readable, writable } from "svelte/store";

export const serverURL = readable("http://localhost:3000");

export const serverEndpoints = readable({
    authentication: {
        login: "/auth/login",
        logout: "/auth/logout",
        signup: "/auth/signup",
        updateaccount: "/auth/updateAccount",
        changepassword: "/auth/changepassword",
        resetpassword: "/auth/reset-password",
        deleteaccount: "/auth/delete-account",
        validatepassword: "/auth/validatepassword",
    },
    mailer: {
        contact: "/mail/contact",
        forgotpassword: "/mail/forgot-password",
    },
    communityHub: {
        posts: "/communityHub/posts/",
        comments: "/communityHub/comments/"
    },
    user: {
        profileimage: "/user/profileImage",
        ownedGame: "/user/ownedGames",
        wishlist: "/user/wishlist",
    }
});

export const session = writable(null);
export const postRoom = writable('');

export const selectedGame = writable(null);