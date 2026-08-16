import express from "express";

const app = express();
const port = 3000;

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
        application: "devops-demo",
        version: "1.0.0"
    });
});

app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
