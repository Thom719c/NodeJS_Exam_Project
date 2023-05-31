    import toast from "svelte-french-toast";

    export const addToWishlist = (appid, name) => {
        const url = 'http://localhost:3000/users/wishlist';
        fetchingAddToList(url, appid, name);
    };

   export const addToOwnedGame = (appid, name) => {
        const url = 'http://localhost:3000/users/ownedGames';
        fetchingAddToList(url, appid, name);
    };

  const fetchingAddToList = async (url, appid, name) => {
        const game = { steamAppId: appid, name: name };
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
