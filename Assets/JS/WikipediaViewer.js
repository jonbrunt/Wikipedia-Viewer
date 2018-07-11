init(); //initializes the app on page load

function init() {
	fadeIn(document.querySelector('body'), 2000); //fades in page on load over 2000ms
	main();
}

//function passing arguments of targeted element and time in milliseconds for fade in
function fadeIn(element, time) {
	let milli = new Date().getTime();
	//function that brings opacity from 0 - 1 based on time argument
	let animate = function () {
		element.style.opacity = +element.style.opacity + (new Date() - milli) / time;
		milli = new Date().getTime();
		if (+element.style.opacity < 1) {
			(window.requestAnimationFrame && requestAnimationFrame(animate)) || setTimeout(animate, 10);
		}
	};
	//calls function for fade in animation
	animate();
}
//function that updates and renders the search results
function update(title, pageId, snippet) {
	let listNode = document.createElement('ul'); //creates ul in empty div
	document.querySelector('.results').appendChild(listNode);
	//iterates over the data passed in as arguments, creating a li for each set of data
	for (let i = 0; i <= 9; i++) {
		//creates new list element
		let itemNode = document.createElement('li');
		//concatenates the inner HTML of the new li, based on data passed in arguments
		itemNode.innerHTML = '<span class="boldTitle"><a href="https://en.wikipedia.org/?curid=' + pageId[i].toString() + '" target="_blank">' + title[i] + '</a></span>&nbsp&nbsp' + snippet[i];
		//appends li to ul
		document.querySelector('ul').appendChild(itemNode);
	}
}
//function that receives the user entered search as an argument and requests the corresponding data from the MediaWiki API
function receive(query) {
	//assigns url variable for fetch function, using encoded query argument, to request search data from API
	let url = 'https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&list=search&srsearch=' + encodeURIComponent(query) + '&utf8=';
	var title = [], pageId = [], snippet = []; //initializes data arrays
	fetch(url)
		.then(res => res.json())
		.then(function (data) {
			//iterates over the data and pushes each set of data into the appropriate arrays
			for (let i = 0; i <= 9; i++) {
				title.push(data.query.search[i].title);
				pageId.push(data.query.search[i].pageid);
				snippet.push(data.query.search[i].snippet);
			}
			update(title, pageId, snippet); //calls update() and passes new data in as arguments
		})
		.catch(function (error) { //error alert backup
			alert('An error ocurred while trying to load results. Please try again.');
		})
}
//function that checks for and removes ul if present
function removeUl() {
	let ul = document.querySelector('ul');
	if (ul) {
		let parent = document.querySelector(".results");
		parent.removeChild(ul);
	}
}
//function that executes the main actions of the app upon initialization
function main() {
	let search = document.querySelector('#search');
	let input = document.querySelector('input');
	let close = document.querySelector('#close');
	let p = document.querySelector('p');
	//on search button click, the search button is removed, the search input and "x" button are rendered, and user instructions are updated
	search.addEventListener('click', function () {
		this.style.display = 'none';
		input.style.display = 'inline-block';
		close.style.display = 'inline-block';
		p.innerText = 'Click "Random" to open a new browser tab with a random Wikipedia page, or enter your search text below and press return to search Wikipedia titles and articles for key words';
	});
	//on "x" button click, the "x" button and input are removed, the search button is rendered, the user instructions are updated, the input line is cleared to default placeholder, and if present, the previous search results are removed (ul)
	close.addEventListener('click', function () {
		removeUl(); //calls removeUl() to check for and remove previous search results
		this.style.display = 'none';
		input.style.display = 'none';
		search.style.display = 'block'
		p.innerText = 'Click "Random" to open a new browser tab with a random Wikipedia page, or click "Search" to search Wikipedia titles and articles for key words'
		input.value = '';
	});
	//on search text entry and return key press, sends query parameter to receive() to forward to API, and updates user instructions
	input.addEventListener('keypress', function (event) {
		//checks if return key has been pressed based on event data
		if (event.which === 13 && this.value !== '') {
			removeUl(); //calls removeUI() to check for and remove previous search results
			receive(this.value);
			this.value = ''; //clears input text to default placeholder
			p.innerText = 'Click a returned link below to open a new browser tab with the corresponding Wikipedia page, or enter new search text and press return'
		}
	});
}