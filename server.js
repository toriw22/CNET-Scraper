var cheerio = require("cheerio");
var request = require("request");
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var Comment = require("./models/comment.js");
var Article = require("./models/article.js");

mongoose.Promise = Promise;

var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ 
	extended: false
}));

app.use(express.static("public"));

mongoose.connect("mongodb://heroku_psctkwk6:na8q5rg38tb2imrf2q88if0t00@ds147044.mlab.com:47044/heroku_psctkwk6");
var db = mongoose.connection;

db.on("error", function(error) {
	console.log("Mongoose Error: ", error);
});

db.once("open", function() {
	console.log("Mongoose connection successful.")
});

app.get("/scrape", function(req, res) {

	request("http://www.cnet.com/news/", function(error, response, html) {
		var $ = cheerio.load(html);
		$("a.assetHed").each(function(i, element) {
			var result = {};
			console.log("this is an article object");
			result.header = $(element).children("h3").text();
			result.summary = $(element).children("p").text();
			result.link = $(element).attr("href");
			if (result.header && result.summary && result.link) { 
				var entry = new Article(result);
				entry.save(function(err, doc) {
					if (err) {
						console.log(err);
					}
					else {
						console.log(doc)
					}
				});
			}
		});
	});
	res.send("Scrape Complete <br/> <a href= '/'><button id=home >View Articles on Home Page</button></a> <a href= '/articles'><button id=home >View JSON Articles</button></a> <a href= '/comments'><button id=home >View JSON Comments</button></a>");
});

app.get("/comments", function(req, res) {
	Comment.find({}, function(error, docs) {
		if (error) {
			console.log(error);
		}
		else {

			res.json(docs);
		}
	});
});

app.get("/articles", function(req, res) {
	Article.find({}, function(error, docs) {
		if (error) {
			console.log(error);
		}
		else {

			res.json(docs);
		}
	});
});

app.get("/article/:id", function(req, res) {
	Article.findById(req.params.id)
	.populate("comment")
	.exec(function(error, doc) {
		if (error) {
			console.log(error);
		}
		else {
			res.json(doc);
		}
	});
});

app.post("/article/:id", function(req, res) {
	var newComment = new Comment(req.body);
	newComment.save(function(error, doc) {
		if(error) {
			console.log(error);
		}
		else {
			Article.findOneAndUpdate({ "_id": req.params.id}, {"comment": doc._id})
			.exec(function(err, doc) {
				if(err) {
					console.log(err);
				}
				else {
					res.send(doc);
				}
			});
		}
	});
});

app.listen(3300, function() {
  console.log("App running on port 3300!");
});