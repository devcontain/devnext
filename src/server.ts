import express from "express";
import { collectDefaultMetrics, register } from "prom-client";

const app = express();
const port = Number(process.env.PORT) || 3000;

collectDefaultMetrics();

app.get("/metrics", async (_req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
});

app.get("/", (req, res) => {
    res.send(`
        DevOps Demo "devnext" läuft

        DevOps Command List

        ssh tronic@192.168.178.29 → DevOps-VM verbinden
        ssh root@192.168.178.26 → Proxmox verbinden
        ssh -T git@github.com → GitHub-SSH testen
        ssh-add -l → Geladene SSH-Keys anzeigen

        gh auth status → GitHub-Login prüfen
        gh repo clone devcontain/devnext → DevNext klonen
        gh repo clone devcontain/devnext-deploy → Deploy-Repo klonen

        touch → Datei erstellen
        chmod +x → Datei ausführbar machen
        ~/start-devops.sh → DevNext + Monitoring starten

        docker ps → Laufende Container
        docker ps -a → Alle Container
        docker images → Docker-Images anzeigen
        docker start devnext → DevNext starten
        docker stop devnext → DevNext stoppen
        docker restart devnext → DevNext neu starten
        docker logs devnext → DevNext-Logs anzeigen

        docker compose ps → Compose-Status
        docker compose up -d → Compose starten
        docker compose down → Compose stoppen
        docker compose restart → Compose neu starten

        sudo poweroff → VM herunterfahren
        sudo reboot → VM neu starten
    `);
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
