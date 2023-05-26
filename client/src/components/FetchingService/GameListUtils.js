    import toast, { Toaster } from "svelte-french-toast";

    export const addToWishlist = (appid, gameInfo) => {
        const url = 'http://localhost:3000/auth/wishlist';
        fetchingAddToList(url, appid, gameInfo);
    };

   export const addToOwnedGame = (appid, gameInfo) => {
        const url = 'http://localhost:3000/auth/addOwnedGame';
        fetchingAddToList(url, appid, gameInfo);
    };

  const fetchingAddToList = async (url, appid, gameInfo) => {
        const game = { steamAppId: appid, name: gameInfo.name };
        try {
            const response = await fetch(url, {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(game),
            });
            const data = await response.json();

            if (response.ok) {
                toast.success(data.message, {
                    duration: 5000,
                    position: "bottom-right",
                    style: "border-radius: 200px; background: #333; color: #fff;",
                });
            } else {
                toast.error(data.message, {
                    duration: 5000,
                    position: "bottom-right",
                    style: "border-radius: 200px; background: #333; color: #fff;",
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
