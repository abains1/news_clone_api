require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cacheService = require("express-api-cache");

const app = express();
app.use(cors());

var cache = cacheService.cache;

async function getUkraineNews() {
  const results = await axios.get(
    `https://newsdata.io/api/1/news?apikey=${process.env.API_KEY}&language=en&qInTitle=Ukraine`,
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
  return results.data;
}

async function getCovidNews() {
  const results = await axios.get(
    `https://newsdata.io/api/1/news?apikey=${process.env.API_KEY}&language=en&qInTitle=Covid&country=gb`,
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
  return results.data;
}

app.get("/api/v1/headlines/Ukraine", cache("1 hour"), async (req, res) => {
  try {
    getUkraineNews().then((data) => {
      const headlines = [];
      data.results
        .filter((result) => result.title != null && result.link != null)
        .map((item) =>
          headlines.push({ headline: item.title, link: item.link })
        );

      res.json(headlines);
    });
  } catch {
    res.sendStatus(500);
  }
});

app.get("/api/v1/stories/Ukraine", cache("1 hour"), async (req, res) => {
  try {
    getUkraineNews().then((data) => {
      const stories = [];
      data.results
        .filter(
          (result) =>
            result.title != null &&
            result.source_id != null &&
            result.pubDate != null &&
            result.image_url != null &&
            result.description != null &&
            result.link != null
        )
        .map((story) =>
          stories.push({
            title: story.title,
            source: story.source_id,
            date: story.pubDate.substring(0, 10),
            image_url: story.image_url,
            description: story.description,
            link: story.link,
          })
        );

      res.json(stories);
    });
  } catch {
    res.sendStatus(500);
  }
});

app.get("/api/v1/headlines/Covid", cache("1 hour"), async (req, res) => {
  try {
    getCovidNews().then((data) => {
      const headlines = [];
      data.results
        .filter((result) => result.title != null && result.link != null)
        .map((item) =>
          headlines.push({ headline: item.title, link: item.link })
        );

      res.json(headlines);
    });
  } catch {
    res.sendStatus(500);
  }
});

app.get("/api/v1/stories/Covid", cache("1 hour"), async (req, res) => {
  try {
    getCovidNews().then((data) => {
      const stories = [];
      data.results
        .filter(
          (result) =>
            result.title != null &&
            result.source_id != null &&
            result.pubDate != null &&
            result.image_url != null &&
            result.description != null &&
            result.link != null
        )
        .map((story) =>
          stories.push({
            title: story.title,
            source: story.source_id,
            date: story.pubDate.substring(0, 10),
            image_url: story.image_url,
            description: story.description,
            link: story.link,
          })
        );

      res.json(stories);
    });
  } catch {
    res.sendStatus(500);
  }
});

app.listen(process.env.API_PORT, () => {
  console.log(`listening on port http://localhost:${process.env.API_PORT}`);
});

module.exports = app;
