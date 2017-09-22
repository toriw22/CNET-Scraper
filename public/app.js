$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].header + "<br />" + "https://www.cnet.com/news" + data[i].link + "<br />" + data[i].summary + "</p>");
  }
});

$.getJSON("/comments", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#comments").append("<p data-id='" + data[i]._id + "'>" + "<br />" + "Article Title: " + data[i].title + "<br />" + "Comment: " + data[i].body + "</p>");
  }
});


$(document).on("click", "p", function() {
	console.log("you clicked a p!");
	$("#comments").empty();
	var thisId = $(this).attr("data-id");

	$.ajax({
		method: "GET",
		url:"/article/" + thisId
	})
		.done(function(data) {
			console.log(data);
			 $("#comments").append("<h2>" + data.header + "</h2>");
      		$("#comments").append("<label>Copy and Paste Article Title Here</label><input id='titleInput' name='title' >");
      		$("#comments").append("<textarea id='bodyInput' name='body'>Type Comment Here</textarea>");
     		$("#comments").append("<button data-id='" + data._id + "' id='saveComment'>Save Comment</button>");
			if (data.comment) {
				$("#titleInput").val(data.comment.title);
				$("#bodyInput").val(data.comment.body)
			}
		});
});

$(document).on("click", "#saveComment", function() {
	var thisId = $(this).attr("data-id");

	$.ajax({
		method: "POST",
		url: "/article/" + thisId,
		data: {
			title: $("#titleInput").val(),
			body: $("#bodyInput").val()
		}
	})
		.done(function(data) {
			console.log(data);
			$("#comments").empty();
		});
	$("#titleInput").val("");
	$("#bodyInput").val("");
});