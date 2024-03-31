const dotenv = require("dotenv");
dotenv.config({
  path: "./.env",
});
const NewsAPI = require("newsapi");
const express = require("express");
const app = express();

const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/news", (req, res) => {
  res.render("news");
});

app.post("/getNews", (req, res) => {
  const query = req.body.query;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const latestNews = req.body.latestNews;

  if (!query || query.trim() === "") {
    return res.status(422).send("Please provide a search term");
  }

  newsapi.v2
    .everything({
      q: query,
      sources: "",
      domains: "",
      from: startDate,
      to: endDate,
      language: "en",
      sortBy: latestNews === "on" ? "publishedAt" : "relevancy",
      pageSize: 20,
    })
    .then((response) => {
      res.render("news", { articles: response.articles });
    })
    .catch((error) => {
      console.log("error is : ", error);
      res.json({ status: 500, error: error });
    });
});
app.listen(PORT, () => {
  console.log(`Application is running at ${PORT}`);
});
