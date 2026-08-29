import express from "express";
import { collectDefaultMetrics, register } from "prom-client";

const app = express();
const port = Number(process.env.PORT) || 3000;
import path from "path";

collectDefaultMetrics();

app.use(express.static("public"));

app.get("/metrics", async (_req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
});

app.get("/", (req, res) => {
    const acceptHeader = req.get("accept") || "";

    if (!acceptHeader.includes("text/html")) {
        res.type("text/plain");
        res.send('DevOps Demo "devnext" läuft\n');
        return;
    }

    res.sendFile(path.join(process.cwd(), "public", "index.html"));
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

app.get("/security/runner", (req, res) => {
    res.json({
        description: "GitHub Runner auf VM 200",

        vm_start: {
            behavior: "Runner startet automatisch mit VM 200"
        },

        runner_stop: {
            command: "sudo systemctl stop actions.runner.devcontain-devnext-deploy.devops.service"
        },

        runner_check: {
            command: "sudo systemctl status actions.runner.devcontain-devnext-deploy.devops.service --no-pager",
            expected: "Active: inactive (dead)"
        },

        vm_shutdown: {
            command: "sudo shutdown -h now"
        }
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
