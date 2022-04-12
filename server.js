const ytdl = require("ytdl-core");
const express = require("express");
const cors = require("cors");
const PORT = 8000;

const app = express();

app.use(cors());

app.get("/api/v1/music", async (req, res) => {
  const { videoId } = req.query;
  let info = await ytdl.getInfo(videoId);
  let audioFormats = ytdl.filterFormats(info.formats, "audioonly");
  console.log("Formats with only audio: " + audioFormats);
  res.json(audioFormats);
});

app.listen(PORT, () => console.log(`Server running on, ${PORT}`));
