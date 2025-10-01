const { dir } = require("console");
const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "..Frontend")));

app.get("/api/hello", (req, res) => {
    resizeBy.json({message: "Hello from backend api"});
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/JusMash.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));