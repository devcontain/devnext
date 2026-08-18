import express from "express";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.get("/", (req, res) => {
    res.send("DevOps Demo läuft");
});

app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

app.get("/api/info", (req, res) => {
    res.json({
        application: "devnext",
        version: "1.0.0"
    });
});

const server = app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});

process.on("SIGTERM", () => {
    console.log("SIGTERM empfangen – Server wird beendet.");

    server.close(() => {
        console.log("Server sauber beendet.");
        process.exit(0);
    });
});
