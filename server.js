const ytdl = require("ytdl-core");
const express = require("express");
const cors = require("cors");
const lyricsFinder = require("@jeve/lyrics-finder");
const { getChart, listCharts } = require("billboard-top-100");
const ytsr = require("ytsr");
const AutoComplete = require("youtube-autocomplete");
// const morgan = require("morgan");

const port = process.env.PORT || 8000;

const app = express();

// app.use(morgan("dev"));

app.use(cors());

//search data
app.get("/api/v1/music/search", async (req, res) => {
  const { keyword } = req.query;
  try {
    const searchResults = await ytsr(keyword);
    res.json(searchResults.items);
  } catch (error) {
    console.log(error);
  }
});

// video to audio
app.get("/api/v1/music", async (req, res) => {
  const { videoId } = req.query;
  let info = await ytdl.getInfo(videoId);
  let audioFormats = ytdl.filterFormats(info.formats, "audioonly");
  // console.log("Formats with only audio: " + audioFormats);
  res.json(audioFormats);
});

//related videos
app.get("/api/v1/music/related", async (req, res) => {
  const { videoId } = req.query;
  let info = await ytdl.getInfo(videoId);
  let related_music = info.related_videos;
  console.log("realted videos: ", related_music);
  res.json(related_music);
});

//details video
app.get("/api/v1/music/details", async (req, res) => {
  try {
    const { videoId } = req.query;
    let info = await ytdl.getInfo(videoId);
    let details = info.videoDetails;
    console.log("video details: ", details);
    res.json(details);
  } catch (error) {
    console.log(error.message);
  }
});

//get lyrics
app.get("/api/v1/lyric", async (req, res) => {
  const { title } = req.query;
  await lyricsFinder.LyricsFinder(title).then((data) => {
    const result = {
      data,
    };
    res.json(result);
  });
});

//list billboard
app.get("/api/v1/billboard", async (req, res) => {
  getChart((err, chart) => {
    if (err) console.log(err);
    res.json(chart);
  });
});

//get artist

app.get("/api/v1/artist", async (req, res) => {
  getChart("artist-100", (err, chart) => {
    if (err) console.log(err);
    res.json(chart);
  });
});

//list billboard
app.get("/api/v1/chart", async (req, res) => {
  listCharts((err, charts) => {
    if (err) console.log(err);
    // array of all charts
    res.json(charts);
    // console.log(charts);
  });
});

//autocomplete
app.get("/api/v1/queries", (req, res) => {
  const { keyword } = req.query;
  AutoComplete(keyword, (err, queries) => {
    if (err) throw err;
    res.json(queries[1]);
  });
});

app.listen(port, () => console.log(`Server running on, ${port}`));
