const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

const app = express();
app.use(express.json());

const UPLOAD_FOLDER = path.join(__dirname, "code");
if (!fs.existsSync(UPLOAD_FOLDER)) fs.mkdirSync(UPLOAD_FOLDER);

app.post("/compile", (req, res) => {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: "No code provided" });

    const cppFile = path.join(UPLOAD_FOLDER, "program.cpp");
    const exeFile = path.join(UPLOAD_FOLDER, "program");

    fs.writeFileSync(cppFile, code);

    const compileCmd = `g++ ${cppFile} -o ${exeFile} -lgraph -lSDL -lX11 -lXext -lpthread -lm -static-libgcc -static-libstdc++ && chmod +x ${exeFile}`;

    exec(compileCmd, (compileErr, stdout, stderr) => {
        if (compileErr) {
            return res.json({ output: "", errors: stderr });
        }

        res.json({ message: "Compilation successful", downloadLink: "/download" });
    });
});

app.get("/download", (req, res) => {
    const exeFile = path.join(UPLOAD_FOLDER, "program");

    if (!fs.existsSync(exeFile)) {
        return res.status(404).json({ error: "File not found" });
    }

    res.download(exeFile, "compiled_program", (err) => {
        if (err) {
            console.error("Error sending file:", err);
            return res.status(500).json({ error: "Failed to send compiled file" });
        }

        fs.unlinkSync(exeFile);
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));
