var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SavedArticleSchema = new Schema({
	header: {
		type: String,
		required: true
	},
	summary: {
		type: String,
		required: true
	},
	link: {
		type: String,
		required: true
	},
	comment: {
		type: Schema.Types.ObjectId,
		ref: "SavedArticle"
	}
});

var SavedArticle = mongoose.model("SavedArticle",
	SavedArticleSchema);

module.exports = SavedArticle;