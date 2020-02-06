// Global variables:
var users;
var hours;
var games;
var beers;

// Search Event
$("#add-game").on("submit", function (e) {
	e.preventDefault();
	let title = $(this).find("input").val().trim();
	$("#add-game").children().val("")
	searchGame(title);
});

$("#add-beer").on("submit", function (e) {
	e.preventDefault();
	const newBeer = {
		beer_name: $("#new-beer-name").val().trim(),
		brewery: $("#new-brewery-name").val().trim(),
		brewery_location: $("#new-brewery-location").val().trim(),
		short_description: $("#new-beer-short").val().trim(),
		long_description: $("#new-beer-long").val().trim(),
		abv: $("#new-abv").val().trim(),
		price: $("#new-price").val().trim()
	}
	$("#add-beer").children().val("")
	$.post("/api/beers", newBeer).then((data) => {
		console.log("Success!")
	}).catch(err => {
		throw err
	})
})

$("#select-beer").on("submit", function (e) {
	e.preventDefault()
	let id = $("#choose-beer option:selected").val();
	console.log(id);
	//  Make sure dynamically generated options have a id of the beer's id
	$.get(`/api/beers/${id}`).then((data) => {
		console.log(data);
		$("#chosen-beer").val(data.beer_name)
		$("#update-brewery").val(data.brewery)
		$("#update-location").val(data.brewery_location)
		$("#update-abv").val(data.abv)
		$("#update-price").val(data.price)
		$("#update-short").val(data.short_description)
		$("#update-long").val(data.long_description)
		$("#update-beer").attr("id", id)
	}).catch(err => {
		throw err
	})
})

$("#update-beer").on("submit", function (e) {
	e.preventDefault()
	const updatedBeer = {
		beer_name: $("#chosen-beer").val().trim(),
		brewery: $("#update-brewery").val().trim(),
		brewery_location: $("#update-location").val().trim(),
		abv: $("#update-abv").val().trim(),
		price: $("#update-price").val().trim(),
		short_description: $("#update-short").val().trim(),
		long_description: $("#update-long").val().trim()
	}
	let id = $("#choose-beer option:selected").val();
	console.log(updatedBeer)
	$("#update-beer").children().val("") // Clears everything
	$.ajax({
		url: `/api/beers/${id}`,
		type: 'PUT',
		data: updatedBeer
	}).then((data) => {
		console.log(data)
	}).catch((err) => {
		throw err
	});
});


function parseBoardGameData(data) {
	var game = data.games[0];
	var boardGame = {
		img_thumb: game.thumb_url,
		img_original: game.image_url,
		url: game.url,
		game_name: game.name,
		rating: parseFloat(game.average_user_rating).toFixed(2),
		min_time: game.min_playtime,
		max_time: game.max_playtime,
		min_players: game.min_players,
		max_players: game.max_players,
		short_description: game.description_preview,
		long_description: game.description,
		categories: game.categories[0].id
	};
	return boardGame
}

function searchGame(title) {
	var apiKey = 'CEx4Nnqb8e' //get rid of it
	var queryURL = `https://www.boardgameatlas.com/api/search?name=${title}&client_id=${apiKey}`;
	$.ajax({
	url: queryURL,
	method: "GET"
}).then(function(response) {
	// renderRow(response);
	var boardGame = parseBoardGameData(response);
	console.log(boardGame);
	// This is where we will run a post route
	$.post("/api/games", boardGame);
}).catch(err => {
	throw err;
});
};


init();

// OnLoad we want to grab the information from our database and store in a global variable
function init() {
	getTableData("games", data =>	{
		populateDeleteSelector("game", data);
		// // Functionality currently not added
		// populateUpdateSelector("game", data);
	});
	getTableData("beers", data =>	{
		populateDeleteSelector("beer", data);
		populateUpdateSelector("beer", data);
	});
	// Functionality currently not added
	getTableData("permissions", data =>	{
		// console.log(data);
		populateDeleteSelector("login", data);
		populateUpdateSelector("login", data);
	});

}
// Gets the table data //permission
function getTableData(table, cb) {
	$.get(`/api/${table}`, function(data) {
		console.log(data)
		return cb(data)
	}).catch(err => {
		throw err;
	});
}
// Populate delete selectors function
function populateDeleteSelector(row, data) {
	row = row;
	for (let item of data) {
		console.log(item);
		let selectionId = item.id;
		let selectionName = item[`${row}_name`];
		if (row === "login") {
			selectionName = item[row];
		};
		$(`#del-${row}-select`).append($(`<option value="${selectionId}">${selectionName}</option>`));
	}
}
// Populate update selectors function
function populateUpdateSelector(row, data) {
	for (let item of data) {
		console.log(item);
		let selectionId = item.id;
		let selectionName = item[`${row}_name`];
		if (row === "login") {
			selectionName = item[row];
		};
		$(`#choose-${row}`).append($(`<option value="${selectionId}">${selectionName}</option>`));
	}
}
