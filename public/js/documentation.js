// Loading screen to page transiction
$(window).on('load', function () {
    $('#loading').delay(350).fadeOut('slow');
	$('#loaded').delay(350).fadeIn('fast');
});

// Retrieve Elements
const cssroot = document.querySelector(':root');
const docAccordion = document.querySelector('.accordion');

database = [];
translations = {};
var translation = null;

// Establish connection to server.
var socket = io();

if (document.cookie == "dark"){
	document.body.classList.toggle("dark-mode");
}

searchbar = document.getElementById("searchbar");

searchbar.addEventListener('input', function () {
	
	query = searchbar.value;

	if(query.length <= 0){
		landingPange(database);
		return;
	}

	// Convert the query to lowercase
	query = query.toLowerCase();
  
	// Copy db so we dont damage the original
	db = JSON.parse(JSON.stringify(database))

	// Check language and translate keywords
	if(selectedLanguage.value != "en"){
		switch (selectedLanguage.value) {
			case 'pt':
				translation = translations.pt;
				break;
			case 'fr':
				translation = translations.fr;
				break;
			case 'es':
				translation = translations.es;
				break;
			case 'it':
				translation = translations.it;
				break;
			case 'de':
				translation = translations.de;
				break;
			case 'ro':
				translation = translations.ro;
				break;
			default:
				break;
		}

		// Create regular expression
		rx = "";
		translationReversed = {}
		for (i in translation) {
			rx += "(^|\\W)(" + translation[i] + ")(\\W|$)" + "|";
			translationReversed[String(translation[i])] = i;
		}
		rx = rx.slice(0, -1); // Remove last "|" as its not needed
		re = RegExp(rx, "mg");

		for (const result of db) {
			result.name = result.name.replace(re, function (matched) {
				matchedcopy = matched;
				matchedclean = matched.trim();
				matchedclean = matchedclean.replace('(', '');
				matchedclean = matchedclean.replace(')', '');
				matchedclean = matchedclean.replace('[', '');
				matchedclean = matchedclean.replace(']', '');
				matchedclean = matchedclean.replace('{', '');
				matchedclean = matchedclean.replace('}', '');
				matchedclean = matchedclean.replace(';', '');
	
				matched = matched.replace(matchedclean, translationReversed[matchedclean]);
				return matched;
			});

			result.description = result.description.replace(re, function (matched) {
				matchedcopy = matched;
				matchedclean = matchedclean.replace('(', '');
				matchedclean = matchedclean.replace(')', '');
				matchedclean = matchedclean.replace('[', '');
				matchedclean = matchedclean.replace(']', '');
				matchedclean = matchedclean.replace('{', '');
				matchedclean = matchedclean.replace('}', '');
				matchedclean = matchedclean.replace(';', '');

				matched = matched.replace(matchedclean, translationReversed[matchedclean]);
				return matched;
			});
			
			result.example = result.example.replace(re, function (matched) {

				matchedcopy = matched;
				matchedclean = matched.trim();
				matchedclean = matchedclean.replace('(', '');
				matchedclean = matchedclean.replace(')', '');
				matchedclean = matchedclean.replace('[', '');
				matchedclean = matchedclean.replace(']', '');
				matchedclean = matchedclean.replace('{', '');
				matchedclean = matchedclean.replace('}', '');
				matchedclean = matchedclean.replace(';', '');
	
				matched = matched.replace(matchedclean, translationReversed[matchedclean]);
				return matched;
			});
		}


		// Filter the data based on the query
		results = db.filter((item) => {
		// Convert the item name to lowercase
		const name = item.name.toLowerCase();
		// Check if the name contains the query
		return name.includes(query);
		});




	}else{
		// Filter the data based on the query
		results = db.filter((item) => {
		// Convert the item name to lowercase
		const name = item.name.toLowerCase();
		// Check if the name contains the query
		return name.includes(query);
		});
	}


	docAccordion.innerHTML = "";
	for (const result of results) {
		docAccordion.innerHTML += `
		<div class="accordion-item">
			<h2 class="accordion-header" id="panelsStayOpen-heading${result.id}">
				<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${result.id}" aria-expanded="true" aria-controls="panelsStayOpen-collapse${result.id}">
				  	${result.name}
				</button>
			</h2>
			<div id="panelsStayOpen-collapse${result.id}" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-heading${result.id}">
				<div class="accordion-body">
					${result.description}
					<div class="card">
						<div class="card-body">
							<code style="white-space: pre-line">${result.example}</code>
						</div>
					</div>
				</div>
			</div>
		</div>
		`;
	}

	if(docAccordion.innerHTML == ""){
		docAccordion.innerHTML += "<br><center><h2>Sorry no Results found!</h2></center>"
	}

});


function toggleExpand(){
	button = document.getElementById("expandcolapse");
	if (button.innerHTML == "Expand All"){
		button.innerHTML = "Collapse All";
		$('.collapse').collapse('show');
	}else{
		button.innerHTML = "Expand All";
		$('.collapse').collapse('hide');
	}
	
}

var selectedLanguage = document.getElementById("language");

function selectorupdate(){
	landingPange(database);
}

socket.emit('getlanguages');

function landingPange(content){
	results = JSON.parse(JSON.stringify(content))

	// Check language and translate
	if(selectedLanguage.value != "en"){
		switch (selectedLanguage.value) {
			case 'pt':
				translation = translations.pt;
				break;
			case 'fr':
				translation = translations.fr;
				break;
			case 'es':
				translation = translations.es;
				break;
			case 'it':
				translation = translations.it;
				break;
			case 'de':
				translation = translations.de;
				break;
			case 'ro':
				translation = translations.ro;
				break;
			default:
				break;
		}

		// Create regular expression
		rx = "";
		translationReversed = {}
		for (i in translation) {
			rx += "(^|\\W)(" + translation[i] + ")(\\W|$)" + "|";
			translationReversed[String(translation[i])] = i;
		}
		rx = rx.slice(0, -1); // Remove last "|" as its not needed
		re = RegExp(rx, "mg");

		for (const result of results) {
			result.name = result.name.replace(re, function (matched) {

				matchedcopy = matched;
				matchedclean = matched.trim();
				matchedclean = matchedclean.replace('(', '');
				matchedclean = matchedclean.replace(')', '');
				matchedclean = matchedclean.replace('[', '');
				matchedclean = matchedclean.replace(']', '');
				matchedclean = matchedclean.replace('{', '');
				matchedclean = matchedclean.replace('}', '');
				matchedclean = matchedclean.replace(';', '');
	
				matched = matched.replace(matchedclean, translationReversed[matchedclean]);
				return matched;
			});

			result.description = result.description.replace(re, function (matched) {

				matchedcopy = matched;
				matchedclean = matchedclean.replace('(', '');
				matchedclean = matchedclean.replace(')', '');
				matchedclean = matchedclean.replace('[', '');
				matchedclean = matchedclean.replace(']', '');
				matchedclean = matchedclean.replace('{', '');
				matchedclean = matchedclean.replace('}', '');
				matchedclean = matchedclean.replace(';', '');
				
	
				matched = matched.replace(matchedclean, translationReversed[matchedclean]);
				return matched;
			});
			
			result.example = result.example.replace(re, function (matched) {

				matchedcopy = matched;
				matchedclean = matched.trim();
				matchedclean = matchedclean.replace('(', '');
				matchedclean = matchedclean.replace(')', '');
				matchedclean = matchedclean.replace('[', '');
				matchedclean = matchedclean.replace(']', '');
				matchedclean = matchedclean.replace('{', '');
				matchedclean = matchedclean.replace('}', '');
				matchedclean = matchedclean.replace(';', '');
	
				matched = matched.replace(matchedclean, translationReversed[matchedclean]);
				return matched;
			});
		}

	}



	docAccordion.innerHTML = "";

	docAccordion.innerHTML += `
		<div class="accordion-item" style="padding:10px">
			<center><h2 class="accordion-header">Control Flows and Loops</h2></center>
		</div>
		`;
	for (const result of results) {
		if(result.section == "control_flows"){
			docAccordion.innerHTML += `
			<div class="accordion-item">
				<h2 class="accordion-header" id="panelsStayOpen-heading${result.id}">
					<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${result.id}" aria-expanded="true" aria-controls="panelsStayOpen-collapse${result.id}">
						${result.name}
					</button>
				</h2>
				<div id="panelsStayOpen-collapse${result.id}" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-heading${result.id}">
					<div class="accordion-body">
						<div style="white-space: pre-line">${result.description}</div>
						<div class="card">
							<div class="card-header">
								<b>Example:</b>
							</div>
							<div class="card-body" >
								<code style="white-space: pre-line">${result.example}</code>
							</div>
						</div>
					</div>
				</div>
			</div>
			`;
		}
	}


	docAccordion.innerHTML += `
		<div class="accordion-item" style="padding:10px">
			<center><h2 class="accordion-header">Keywords</h2></center>
		</div>
		`;
	for (const result of results) {
		if(result.section == "keywords"){
			docAccordion.innerHTML += `
			<div class="accordion-item">
				<h2 class="accordion-header" id="panelsStayOpen-heading${result.id}">
					<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${result.id}" aria-expanded="true" aria-controls="panelsStayOpen-collapse${result.id}">
						${result.name}
					</button>
				</h2>
				<div id="panelsStayOpen-collapse${result.id}" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-heading${result.id}">
					<div class="accordion-body">
						<div style="white-space: pre-line">${result.description}</div>
						<div class="card">
							<div class="card-header">
								<b>Example:</b>
							</div>
							<div class="card-body" >
								<code style="white-space: pre-line">${result.example}</code>
							</div>
						</div>
					</div>
				</div>
			</div>
			`;
		}
	}


	docAccordion.innerHTML += `
		<div class="accordion-item" style="padding:10px">
			<center><h2 class="accordion-header">Logical Operators</h2></center>
		</div>
		`;
	for (const result of results) {
		if(result.section == "logic_operators"){
			docAccordion.innerHTML += `
			<div class="accordion-item">
				<h2 class="accordion-header" id="panelsStayOpen-heading${result.id}">
					<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${result.id}" aria-expanded="true" aria-controls="panelsStayOpen-collapse${result.id}">
						${result.name}
					</button>
				</h2>
				<div id="panelsStayOpen-collapse${result.id}" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-heading${result.id}">
					<div class="accordion-body">
						<div style="white-space: pre-line">${result.description}</div>
						<div class="card">
							<div class="card-header">
								<b>Example:</b>
							</div>
							<div class="card-body" >
								<code style="white-space: pre-line">${result.example}</code>
							</div>
						</div>
					</div>
				</div>
			</div>
			`;
		}
	}


	docAccordion.innerHTML += `
		<div class="accordion-item" style="padding:10px">
			<center><h2 class="accordion-header">Comparison Operators</h2></center>
		</div>
		`;
	for (const result of results) {
		if(result.section == "comparison_operators"){
			docAccordion.innerHTML += `
			<div class="accordion-item">
				<h2 class="accordion-header" id="panelsStayOpen-heading${result.id}">
					<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${result.id}" aria-expanded="true" aria-controls="panelsStayOpen-collapse${result.id}">
						${result.name}
					</button>
				</h2>
				<div id="panelsStayOpen-collapse${result.id}" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-heading${result.id}">
					<div class="accordion-body">
						<div style="white-space: pre-line">${result.description}</div>
						<div class="card">
							<div class="card-header">
								<b>Example:</b>
							</div>
							<div class="card-body" >
								<code style="white-space: pre-line">${result.example}</code>
							</div>
						</div>
					</div>
				</div>
			</div>
			`;
		}
	}


	docAccordion.innerHTML += `
		<div class="accordion-item" style="padding:10px">
			<center><h2 class="accordion-header">Math Operators</h2></center>
		</div>
		`;
	for (const result of results) {
		if(result.section == "operators"){
			docAccordion.innerHTML += `
			<div class="accordion-item">
				<h2 class="accordion-header" id="panelsStayOpen-heading${result.id}">
					<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${result.id}" aria-expanded="true" aria-controls="panelsStayOpen-collapse${result.id}">
						${result.name}
					</button>
				</h2>
				<div id="panelsStayOpen-collapse${result.id}" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-heading${result.id}">
					<div class="accordion-body">
						<div style="white-space: pre-line">${result.description}</div>
						<div class="card">
							<div class="card-header">
								<b>Example:</b>
							</div>
							<div class="card-body" >
								<code style="white-space: pre-line">${result.example}</code>
							</div>
						</div>
					</div>
				</div>
			</div>
			`;
		}
	}


	docAccordion.innerHTML += `
		<div class="accordion-item" style="padding:10px">
			<center><h2 class="accordion-header">Concepts Objects and Functions</h2></center>
		</div>
		`;
	for (const result of results) {
		if(result.section == "concepts_objects_functions"){
			docAccordion.innerHTML += `
			<div class="accordion-item">
				<h2 class="accordion-header" id="panelsStayOpen-heading${result.id}">
					<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${result.id}" aria-expanded="true" aria-controls="panelsStayOpen-collapse${result.id}">
						${result.name}
					</button>
				</h2>
				<div id="panelsStayOpen-collapse${result.id}" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-heading${result.id}">
					<div class="accordion-body">
						<div style="white-space: pre-line">${result.description}</div>
						<div class="card">
							<div class="card-header">
								<b>Example:</b>
							</div>
							<div class="card-body" >
								<code style="white-space: pre-line">${result.example}</code>
							</div>
						</div>
					</div>
				</div>
			</div>
			`;
		}
	}


	docAccordion.innerHTML += `
		<div class="accordion-item" style="padding:10px">
			<center><h2 class="accordion-header">Standard Built-in Functions</h2></center>
		</div>
		`;

	for (const result of results) {
		if(result.section == "functions"){
			docAccordion.innerHTML += `
			<div class="accordion-item">
				<h2 class="accordion-header" id="panelsStayOpen-heading${result.id}">
					<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${result.id}" aria-expanded="true" aria-controls="panelsStayOpen-collapse${result.id}">
						${result.name}
					</button>
				</h2>
				<div id="panelsStayOpen-collapse${result.id}" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-heading${result.id}">
					<div class="accordion-body">
						${result.description}
						<div class="card">
							<div class="card-body">
								<code>${result.example}</code>
							</div>
						</div>
					</div>
				</div>
			</div>
			`;
		}
	}
}


socket.emit('getDocumentation',"blabla");

socket.on('sendDocumentation', function(results) {
	database = results;
	landingPange(database);
});

socket.on('sendlanguages', function(translation) {
	translations = translation;
	landingPange(database);
});