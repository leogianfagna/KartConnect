const { exec } = require("child_process");

// Comando para o servidor Node.js
const nodeServer = exec("cd node && npm start", { shell: true });
nodeServer.stdout.on("data", (data) => console.log(`[Node] ${data}`));
nodeServer.stderr.on("data", (data) => console.error(`[Node Error] ${data}`));

// Comando para o servidor Java
const javaServer = exec("mvn exec:java", { shell: true });
javaServer.stdout.on("data", (data) => console.log(`[Java] ${data}`));
javaServer.stderr.on("data", (data) => console.error(`[Java Error] ${data}`));
