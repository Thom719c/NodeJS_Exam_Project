import dotenv from "dotenv/config";
import express from "express";
const app = express();

import helmet from "helmet";
app.use(helmet());

app.use(express.json());

import cors from "cors";
app.use(cors({
    credentials: true,
    origin: true
}));

import session from "express-session";
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

import http from "http";
const server = http.createServer(app);

import { Server } from "socket.io";
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["*"],
    }
});

import rateLimit from 'express-rate-limit'
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // 15 minutes
    max: 100,                   // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true,      // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,       // Disable the `X-RateLimit-*` headers
});
app.use(apiLimiter);

app.use("/auth", rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
}));

io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("joinRoom", (roomId) => {
        console.log("Client joined", roomId);
        socket.join(roomId);
    });

    // Handle new comment submission
    socket.on("newComment", (roomId, comment) => {
        // Store the comment in the database
        console.log(roomId, comment)

        // Emit the comment to all connected clients
        io.to(roomId).emit("commentAdded", comment);
    });

    // Handle client disconnection
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

// Routes

import authRouter from "./routers/authRouter.js"
app.use("/auth", authRouter);

import mailer from "./routers/mailerRouter.js"
app.use(mailer);

import communityHub from "./routers/communityHubRouter.js"
app.use("/communityHub", communityHub);

/* app.get('/api/games', async (req, res) => {
    const url = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/';
    const response = await fetch(url);
    const data = await response.json();
    res.send(data);
}); */

app.get('/api/gameMarket:name', async (req, res) => {
    let name = req.params.name || '';
    if (name === "undefined") {
        name = '';
    }
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    let startIndex = (page - 1) * pageSize;
    let endIndex = page * pageSize;

    const url = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/';
    const response = await fetch(url);
    const data = await response.json();
    const games = data.applist.apps
        .filter(game => game.name !== "" && game.name !== "test2" &&
            game.name !== "test3" && game.name.toLowerCase().includes(name) &&
            !game.name.includes('Pieterw test app76'))
        .slice(startIndex, endIndex);
    res.send(games);
});

import sanitizeHtml from 'sanitize-html';
app.get('/api/gameInfo/:appid', async (req, res) => {
    const url = 'https://store.steampowered.com/api/appdetails?appids=' + req.params.appid + '&l=english';
    const response = await fetch(url);
    const data = await response.json();

    if (!data[req.params.appid].data.detailed_description) {
        res.status(404).send({ message: "No detail description found", data })
    }
    // Sanitize the detailed description HTML
    const sanitizedDescription = sanitizeHtml(data[req.params.appid].data.detailed_description, {
        allowedTags: ['img', 'ul', 'li', 'br'],
    }).replace(/<img /g, '<img class="description-img" ');

    // Update the data object with the sanitized description
    data[req.params.appid].data.detailed_description = sanitizedDescription;

    res.status(200).send(data);
});

app.get("/users/me", (req, res) => {
    res.send({ data: req.session.user });
});


/**
 * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
 * ┃           PORT            ┃
 * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
 */
const PORT = process.env.PORT || 3000;
server.listen(PORT, (error) => {
    if (error) {
        console.log(error);
        return;
    }
    console.log("Server is running on port", PORT);
});