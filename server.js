//dependencies
const express = require("express");
const logger = require("morgan");
const request = require("request");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//Require models
const db = require("./models");

const PORT = 3000;

//initialize express
const app = express();

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/wsj", { useNewUrlParser: true });

//database configuration
const databaseUrl = "wsj";
const collections = ["scrapedArticles"];


// Routes


// GET route for scraping WSJ website
app.get("/scrape", function(req, res) {
    request("https://www.nytimes.com/", function(error, response, html) {
        const $ = cheerio.load(html);

        $("article a").each(function(i, element) {
            const result = {};
    
            result.title = $(this).children().children("h2").text();
            result.link = $(this).attr("href");
            result.summary = $(this).children("p").text();
            console.log(result);

            if (result.title && result.link && result.summary) {
                db.scrapedArticles.insert({
                    title: result.title,
                    link: result.link,
                    summary: result.summary
                },
                function(err, inserted) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(inserted);
                    }                
                });
            }
            });
        // $("p .wsj-summary").each(function(i, element) {
        //     const sResult = {};

        //     sResult.summary = $(this).children("span").text();
        });
    }) 
// })

app.listen(PORT, function() {
    console.log(`App running on port ${PORT}!` );
})