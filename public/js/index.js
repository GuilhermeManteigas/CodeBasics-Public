// Loading screen to page transiction
$(window).on('load', function () {
    $('#loading').delay(350).fadeOut('slow');
	$('#loaded').delay(350).fadeIn('fast');
});

// Retrieve Elements
const cssroot = document.querySelector(':root');
const executeCodeBtn = document.querySelector('.editor_run');
const clearConsoleBtn = document.querySelector('.console_clear');
const editorThemeBtn = document.querySelector('.editor_theme');

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

        // Set default code.
        codeEditor.setValue(`# Test Strings and concatenation
firstName = 'Guilherme';
lastName = 'Manteigas';
print(firstName + lastName);

# Test numbers and operations
number = 50;
number = number + 10 /2;
print(number);

# Test arrays
arr = [1,2,3,4,5];
print(arr);
	
# Teste coments
#
# This will be ignored

# Test functions
fun (number) {
	print('Your number is: ' + number); 
}
fun(30);
	
		
		
# Test Recursion
recursionfun(number){
	print('Recursion: ' + number); 
	if(number <= 0){
		return 'something';
	}
	return recursionfun(number - 1);
}
recursionfun(10);

# Test conditions
if(10>5){
	print('If Works');
}
		
		
# Test For Loop
for (i = 0; i < 5; i = i + 1) {
	print('For:' + i);
	for (a = 0; a < 3; a = a + 1) {
		print('For inside a For' + a);
	}
}
		
		
# Test escaping characters
st = 'gui\\\\gui';
print(st);
		
st = 'gui\\'gui\\'';
print(st);
		
		
# Testing Continue
for (i = 0; i < 5; i = i + 1) {
	if(i == 3){
		continue;
	}
	print('Hello World'+i);
}
		
`);
		
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

// Events
executeCodeBtn.addEventListener('click', () => {

	// Check language and translate
	var selectedLanguage = document.getElementById("language");
	if(selectedLanguage.value != "en"){
		socket.emit('translationrequest', codeEditor.getValue(), selectedLanguage.value);
	}else{
		//Send code to server
		consoleLib.clearConsole();
		socket.emit('runcode', codeEditor.getValue());
	}


	
	
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
		localStorage.setItem("mode", "dark");
		selector = document.getElementById("language");
		selector.classList.add("bg-dark");
		selector.classList.add("text-white");
	}else{
		editorThemeBtn.value = 0;
		codeEditor.setTheme("ace/theme/dreamweaver");
		editorThemeBtn.innerHTML = "<i class='fa-solid fa-moon'></i>";
		cssroot.style.setProperty('--editor-border', '#282828');
		cssroot.style.setProperty('--console-bg', '#fff');
		localStorage.setItem("mode", "ligth");
		selector = document.getElementById("language");
		selector.classList.remove("bg-dark");
		selector.classList.remove("text-white");
	}
	
})

editorLib.init();

consoleLib.init();

InputLib.init();

if (localStorage.getItem("mode") == "dark"){
	document.body.classList.toggle("dark-mode");
	editorThemeBtn.value = 1;
	codeEditor.setTheme("ace/theme/clouds_midnight");
	editorThemeBtn.innerHTML = "<i class='fa-regular fa-sun'></i>";
	cssroot.style.setProperty('--editor-border', '#282828');
	selector = document.getElementById("language");
	selector.classList.add("bg-dark");
	selector.classList.add("text-white");
}


socket.on('translationanswer', function(code) {
	consoleLib.clearConsole();
	socket.emit('runcode', code);
});


socket.on('consoleoutput', function(output) {
	consoleLib.printToConsole(output + '\n');
	
	// Move console view to the bottom of the text
	consoleeditor.resize(true);
	consoleeditor.scrollToLine(consoleeditor.session.getLength(), true, true, function () {});
	consoleeditor.gotoLine(consoleeditor.session.getLength(), 10, true);
});

socket.on('addtoconsole', function(output) {
	consoleLib.printToConsole(output);
});
