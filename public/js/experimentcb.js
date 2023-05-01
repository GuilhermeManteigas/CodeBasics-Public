// Loading screen to page transiction
$(window).on('load', function () {
    $('#loading').delay(350).fadeOut('slow');
	$('#loaded').delay(350).fadeIn('fast');
});

// Cookie Handlers
function saveData(cname, cvalue, exdays) {
	localStorage.setItem(cname, cvalue);
}
  
function getData(cname) {
	return localStorage.getItem(cname);
}


// Set cookies default values if not set
if (getData("currentQuestion") == null){
	saveData("currentQuestion", 1, 300);
}

// Array to save as cookie to keep all information safe
experimentArray = [
	[' ', ' ', ' ', ' ', ' ', ' '], // Question Answers 0 - 5
	[0, 0, 0, 0, 0, 0], // Question time
	[0, 0, 0, 0, 0, 0], // Question typed chars
	[0, 0, 0, 0, 0, 0] // Question number of times help was openned
]

function saveInfoExperiment() {
	// We have to encodeURI to escape all the "" ' so the infor is saved correctly
	saveData("experimentInfo", encodeURIComponent(JSON.stringify(experimentArray)), 300);
}

function retrieveInfoExperiment() {
	if(getData("experimentInfo")){
		experimentArray = JSON.parse(decodeURIComponent(getData("experimentInfo")));
	}
}

retrieveInfoExperiment(); // Gets cookie info on load

// Check if Finish button should be enabled
function checkFinishBtn(){
	uncompletedAnswers = 0;
	for(i = 0; i < 6; i++){
		if(experimentArray[0][i].length < 5){
			uncompletedAnswers++;
		}
	}
	if(uncompletedAnswers == 0){
		finishBtn.disabled = false;
	}else{
		finishBtn.disabled = true;
	}
}




// Key Press Counter
$(document).on("keydown",function(e){
	saveCode();
	experimentArray[2][getData("currentQuestion")-1] = experimentArray[2][getData("currentQuestion")-1] + 1;
	// Check if Finish button should be enabled
	checkFinishBtn();
 });



// Timer
var startTime = new Date(); 

function saveTime(){
	var currentTime = new Date(); 
	experimentArray[1][getData("currentQuestion")-1] = experimentArray[1][getData("currentQuestion")-1] + ((currentTime - startTime)/1000);
	
	startTime = new Date(); // reset time
	saveInfoExperiment();
}

// Initiate confetti object and creates canvas
const jsConfetti = new JSConfetti();

//Questions
questionList = [
	`<div class="card">
		<div class="card-body">
			<h2>Exercise 1 - Hello World</h2>
			<br>
			<p>Welcome to the first programming exercise. In this exercise, your task is to write a simple program that prints out the text <b>Hello World!</b> to the screen.</p>
			<p>Once you've written your code, run it to make sure it works correctly. If everything is working as expected, you should see the text <b>Hello World!</b> printed out to the screen.</p>
			<p>That's all there is to it! This exercise is a simple introduction to programming and is often used as a first exercise when learning a new language. Happy coding!</p>
			<p>If you're struggling to complete this exercise or need some help getting started, don't hesitate to use the "Help" button in the top left corner of the page. 
			It will provide you with useful information and examples to help you write your code. Remember, it's okay to ask for help when you're learning something new!</p>
			<div class="card" style="width: 450px">
				<div class="card-header">
					<b>Example:</b>
				</div>
				<div class="card-body" style="user-select: none;">
					<h6><code>print('Hello my friend');</code></h6>
				</div>
			</div>
		</div>
	</div>`,
	`<div class="card">
		<div class="card-body">
			<h2>Exercise 2 - Calculations</h2>
			<p>Welcome to the basic calculations programming exercise! In this exercise, you will get to experiment with performing some basic arithmetic calculations using a programming language.</p>
			<p>To complete this exercise, you will need to write some lines of code that perform some simple calculations, such as addition, subtraction, multiplication, and division. </p>
			<p>Once you've written your code, run it to make sure it works correctly. If everything is working as expected, you should see the results of the calculations printed out to the screen.</p>
			<p>If you're struggling to complete this exercise or need some help getting started, don't hesitate to use the "Help" button in the top left corner of the page. 
			It will provide you with useful information and examples to help you write your code.</p>
			<p>You should perform the following calculations:</p>
			<p><b>5 + 5 * 10 / 2</b></p>
			<div class="card" style="width: 450px">
				<div class="card-header">
					<b>Example:</b>
				</div>
				<div class="card-body" style="user-select: none;">
					<h6><code>print(10+9*2/6);</code></h6>
				</div>
			</div>
		</div>
	</div>`,
	`<div class="card">
		<div class="card-body">
			<h2>Exercise 3 - If & Else Statements</h2>
			<p>Welcome to the If and Else Statements programming exercise! In this exercise, you will get to experiment with conditional statements.</p>
			<p>To complete this exercise, you will need to write some lines of code that use if and else statements to make decisions based on certain conditions.</p>
			<p>For this exercise, you will need to <b>assign the value 5 to a variable x</b>. And then use an if statement to check whether <b>x is less than 10</b>. 
			If the condition is true, you should print the message <b>"x is less than 10"</b> to the screen. If the condition is false, 
			you should print the message <b>"x is greater than or equal to 10"</b> to the screen using the else statement.</p>
			<p>Once you've written your code, run it to make sure it works correctly. If everything is working as expected, you should see the appropriate message printed out to the screen depending on the value of x.</p>
			<p>If you're struggling to complete this exercise or need some help getting started, don't hesitate to use the "Help" button in the top left corner of the page. 
			It will provide you with useful information and examples to help you write your code.</p>
			<div class="card" style="width: 450px">
				<div class="card-header">
					<b>Example:</b>
				</div>
				<div class="card-body" style="user-select: none;">
					<h6><code>y = 10;</code></h6>
					<h6><code>if(y < 20){</code></h6>
					<h6><code>&nbsp print('y is less than 20');</code></h6>
					<h6><code>}else{</code></h6>
					<h6><code>&nbsp print('y is greater than or equal to 20');</code></h6>
					<h6><code>}</code></h6>
				</div>
			</div>
		</div>
	</div>`,
	`<div class="card">
		<div class="card-body">
			<h2>Exercise 4 - Functions</h2>
			<p>Welcome to the Functions programming exercise! In this exercise, you will get to experiment with creating and calling functions.</p>
			<p>To complete this exercise, you will need to write some lines of code that define a function and call it with some arguments.</p>
			<p>In this exercise, you are defining a <b>function called greet</b> that takes one argument <b>name</b>. The function has to print a message to the screen 
			in the format of <b>'Hello' + name</b>. You will then call the greet function twice with different arguments <b>'Bob'</b> and <b>'Alice'</b> to see the function in action.</p>
			<p>Once you've written your code, run it to make sure it works correctly. If everything is working as expected, you should see the appropriate greeting 
			message printed out to the screen for each argument passed in.</p>
			<p>If you're struggling to complete this exercise or need some help getting started, don't hesitate to use the "Help" button in the top left corner of the page. 
			It will provide you with useful information and examples to help you write your code.</p>
			<div class="card" style="width: 450px">
				<div class="card-header">
					<b>Example:</b>
				</div>
				<div class="card-body" style="user-select: none;">
					<h6><code>like(name){</code></h6>
					<h6><code>&nbsp print('I like ' + name);</code></h6>
					<h6><code>}</code></h6>
					<h6><code>&nbsp</code></h6>
					<h6><code>like('Noah');</code></h6>
					<h6><code>like('Alex');</code></h6>
				</div>
			</div>
		</div>
	</div>`,
	`<div class="card">
		<div class="card-body">
			<h2>Exercise 5 - Looping</h2>
			<p>Welcome to the Loops programming exercise! In this exercise, you will get to experiment with using for loops.</p>
			<p>To complete this exercise, you will need to write some lines of code that use a for loop to count from <b>1 to 10</b>. </p>
			<p>Once you've written your code, run it to make sure it works correctly. If everything is working as expected, you should see the numbers 
			<b>1 through 10</b> printed out to the screen.</p>
			<p>If you're struggling to complete this exercise or need some help getting started, don't hesitate to use the "Help" button in the top left corner of the page. 
			It will provide you with useful information and examples to help you write your code.</p>
			<div class="card" style="width: 450px">
				<div class="card-header">
					<b>Example:</b>
				</div>
				<div class="card-body" style="user-select: none;">
					<h6><code>for(i = 1; i < 21; i++){</code></h6>
					<h6><code>&nbsp print(i);</code></h6>
					<h6><code>}</code></h6>
				</div>
			</div>
		</div>
	</div>`,
	`<div class="card">
		<div class="card-body">
			<h2>Exercise 6 - Array Manipulation</h2>
			<p>Welcome to the Array Manipulation programming exercise! In this exercise, you will get to experiment with manipulating arrays using different methods.</p>
			<p>To complete this exercise, you will need to write some lines of code that create an array containing the numbers <b>[9,8,7,6,5]</b>, <b>append the number 1</b> to the end of the array and <b>remove the number 7</b> from the array, and <b>sort the array</b> in ascending order.</p>
			<p>Once you've written your code, run it to make sure it works correctly. If everything is working as expected, you should see the final sorted array printed out to the screen.</p>
			<p>If you're struggling to complete this exercise or need some help getting started, don't hesitate to use the "Help" button in the top left corner of the page. 
			It will provide you with useful information and examples to help you write your code.</p>
			<div class="card" style="width: 650px">
				<div class="card-header">
					<b>Example:</b>
				</div>
				<div class="card-body" style="user-select: none;">
					<h6><code>array = [20,19,18,17,16];</code></h6>
					<h6><code>append(array, 30);</code><code style="color:grey">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<--- Adds the number 30 to the array</code></h6>
					<h6><code>remove(array, 18);</code><code style="color:grey">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<--- Removes the number 18 from the array</code></h6>
					<h6><code>sort(array);</code></h6>
					<h6><code>print(array);</code></h6>
				</div>
			</div>

		</div>
	</div>`
]


answerList = [
	'Hello World!', 
	'30',
	'x is less than 10', 
	'Hello Bob\nHello Alice', 
	'1\n2\n3\n4\n5\n6\n7\n8\n9\n10',
	'[1,5,6,8,9]'
	]


// Retrieve Elements
const cssroot = document.querySelector(':root');
const executeCodeBtn = document.querySelector('.editor_run');
const clearConsoleBtn = document.querySelector('.console_clear');
const editorThemeBtn = document.querySelector('.editor_theme');
const questionSection = document.querySelector('#Question');
const helpBtn = document.querySelector('#helpBtn');
const finishBtn = document.querySelector('#Finish');

// Retrieve Question Buttons
const prevBtn = document.querySelector('#Prev');
const q1Btn = document.querySelector('#Q1');
const q2Btn = document.querySelector('#Q2');
const q3Btn = document.querySelector('#Q3');
const q4Btn = document.querySelector('#Q4');
const q5Btn = document.querySelector('#Q5');
const q6Btn = document.querySelector('#Q6');
const nextBtn = document.querySelector('#Next');

// Establish connection to server.
var socket = io();

// Setup code editor.
let codeEditor = ace.edit("editorCode");

let editorLib = {
    init() {
        // Set editor theme.
        codeEditor.setTheme("ace/theme/dreamweaver");
		
		// Remove editor length line
		codeEditor.setShowPrintMargin(false);

        // Set editor language.
        codeEditor.session.setMode("ace/mode/codebasics");

        // Set Editor Options.
        codeEditor.setOptions({
            fontFamily: 'Inconsolata',
            fontSize: '12pt',
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
        });
		
		// By default the text starts selected so we deselect it.
		codeEditor.clearSelection();
		
    }
}



// Setup Console
let consoleeditor = ace.edit("editorConsole");
var consoletext = "";

let consoleLib = {
    clearConsole() {
        consoleeditor.setValue("");
    },
    printToConsole(line) {
		consoleeditor.setValue(consoleeditor.getSession().getValue().concat(line));
		
		consoleeditor.execCommand("gotolineend")
		
		// Move scroll to bottom of the text.
		consoleeditor.renderer.scrollCursorIntoView({row: consoletext.length, column: 1}, 1)

		// Check if answer is correct
		if(consoleeditor.getSession().getValue().replace(/\s/g, '').toLowerCase() == answerList[getData("currentQuestion")-1].replace(/\s/g, '').toLowerCase()){
			jsConfetti.addConfetti();
			const temp = document.querySelector('#Q'+getData("currentQuestion"));
			temp.classList.add("btn-success");
		}else{
			const temp = document.querySelector('#Q'+getData("currentQuestion"));
			temp.classList.remove("btn-success");
		}

		
    },
    init() {
        // Set editor theme.
        consoleeditor.setTheme("ace/theme/terminal");
		
		// Hide editor gutter.
		consoleeditor.renderer.setShowGutter(false);
		
		// Hide editor cursor.
		consoleeditor.renderer.$cursorLayer.element.style.display = "none"

        // Set Editor Options.
        consoleeditor.setOptions({
            fontFamily: 'Inconsolata',
            fontSize: '12pt',
			readOnly: true,
            printMargin: false,
			selectionStyle: 'line',
			behavioursEnabled: true,
			wrapBehavioursEnabled: true,
			autoScrollEditorIntoView: true,
			wrap: true,
			highlightActiveLine: false,
			highlightGutterLine: false
        });

    }
}


// Setup Console Input
let consoleinput = ace.edit("consoleInput");
let consoleinputtext = "";

let InputLib = {
    clearInput() {
        consoleinput.setValue("");
    },
    sendInput() {
		consoleinput.renderer.scrollCursorIntoView({row: consoleinput.getValue().length, column: 1}, 1)
		
    },
    init() {
        // Theme
        consoleinput.setTheme("ace/theme/terminal");
		
		// Hide gutter
		consoleinput.renderer.setShowGutter(false);

        // Set Options
        consoleinput.setOptions({
            fontFamily: 'Inconsolata',
            fontSize: '12pt',
            printMargin: false,
			selectionStyle: 'line',
			behavioursEnabled: true,
			autoScrollEditorIntoView: true,
			highlightActiveLine: false,
			highlightGutterLine: false
        });
		
		consoleinput.commands.on('afterExec', eventData => {
			if (eventData.command.name === 'insertstring') {
				if (eventData.args === '\n') {
					try{
						socket.emit('input', consoleinput.getSession().getValue());
						consoleinput.setValue("");
					}catch(e){}
				}
			}
		});
		
        // Set Default Code
        consoleinput.setValue("");

    }
}


// Save editor text and update cookie
function saveCode(){
	experimentArray[0][getData("currentQuestion")-1] = codeEditor.getValue();
	saveInfoExperiment();
}

// Buttons Helper Functions
function selectBtns(){
	q1Btn.classList.remove("btn-warning");
	q2Btn.classList.remove("btn-warning");
	q3Btn.classList.remove("btn-warning");
	q4Btn.classList.remove("btn-warning");
	q5Btn.classList.remove("btn-warning");
	q6Btn.classList.remove("btn-warning");
	const temp = document.querySelector('#Q'+getData("currentQuestion"));
	temp.classList.add("btn-warning");
	questionSection.innerHTML = questionList[getData("currentQuestion")-1];
	codeEditor.setValue(experimentArray[0][getData("currentQuestion")-1], 1);
}

// Update Buttons on load
selectBtns();

// Buttons Click Events
prevBtn.addEventListener('click', () => {
	saveTime();
	saveCode();
	consoleLib.clearConsole();
	for(i = 6; i > 1; i--){
		const temp = document.querySelector('#Q'+i);
		if(temp.classList.contains("btn-warning")){
			document.querySelector('#Q'+(i-1)).click();
			break;
		}
	}

});

q1Btn.addEventListener('click', () => {
	saveTime();
	saveCode();
	consoleLib.clearConsole();
	saveData("currentQuestion", 1, 300);
	selectBtns();
	

});

q2Btn.addEventListener('click', () => {
	saveTime();
	saveCode();
	consoleLib.clearConsole();
	saveData("currentQuestion", 2, 300);
	selectBtns();

});

q3Btn.addEventListener('click', () => {
	saveTime();
	saveCode();
	consoleLib.clearConsole();
	saveData("currentQuestion", 3, 300);
	selectBtns();
	

});

q4Btn.addEventListener('click', () => {
	saveTime();
	saveCode();
	consoleLib.clearConsole();
	saveData("currentQuestion", 4, 300);
	selectBtns();

});

q5Btn.addEventListener('click', () => {
	saveTime();
	saveCode();
	consoleLib.clearConsole();
	saveData("currentQuestion", 5, 300);
	selectBtns();

});

q6Btn.addEventListener('click', () => {
	saveTime();
	saveCode();
	consoleLib.clearConsole();
	saveData("currentQuestion", 6, 300);
	selectBtns();

});

nextBtn.addEventListener('click', () => {
	saveTime();
	saveCode();
	consoleLib.clearConsole();
	for(i = 1; i < 6; i++){
		const temp = document.querySelector('#Q'+i);
		if(temp.classList.contains("btn-warning")){
			document.querySelector('#Q'+(i+1)).click();
			break;
		}
	}

});


helpBtn.addEventListener('click', () => {
	experimentArray[3][getData("currentQuestion")-1] = experimentArray[3][getData("currentQuestion")-1] + 1;

});

finishBtn.addEventListener('click', () => {
	saveTime();
	if(getData("experimentInfojs")){
		location.href = '/finishexperiment';
	}else{
		location.href = '/learningjs';
	}

});

// Events
executeCodeBtn.addEventListener('click', () => {
	saveTime();
	// Clear console
	consoleLib.clearConsole();

	//Send code to server
	socket.emit('runcode', codeEditor.getValue());

	experimentArray[0][getData("currentQuestion")-1] = codeEditor.getValue();
	
});

clearConsoleBtn.addEventListener('click', () => {
    // Clear console messages
    consoleLib.clearConsole();
})

editorThemeBtn.addEventListener('click', () => {

	document.body.classList.toggle("dark-mode");
	
	if (editorThemeBtn.value == 0) {
		editorThemeBtn.value = 1;
		codeEditor.setTheme("ace/theme/clouds_midnight");
		editorThemeBtn.innerHTML = "<i class='fa-regular fa-sun'></i>";
		cssroot.style.setProperty('--editor-border', '#282828');
		cssroot.style.setProperty('--console-bg', '#282828');
		saveData("mode","dark", 300);
	}else{
		editorThemeBtn.value = 0;
		codeEditor.setTheme("ace/theme/dreamweaver");
		editorThemeBtn.innerHTML = "<i class='fa-solid fa-moon'></i>";
		cssroot.style.setProperty('--editor-border', '#282828');
		cssroot.style.setProperty('--console-bg', '#fff');
		saveData("mode","ligth", 300);
	}
	

})

editorLib.init();

consoleLib.init();

InputLib.init();


socket.on('consoleoutput', function(output) {
	consoleLib.printToConsole(output + '\n');
});

socket.on('addtoconsole', function(output) {
	consoleLib.printToConsole(output);
});

