const {parentPort, workerData} = require("worker_threads");

function runcode(code, socketid) {
    
    // Function to send messages to the main server thread
    function post(message) {
        parentPort.postMessage({ message: message, socketid: socketid })
    }

    const memory = {
        parent: null,
        variables: {},
        functions: {},
        jsfunctions: {
            print(str) {
                if (Array.isArray(str)) {
                    str = `[${str.toString()}]`;
                }
                post(str);
            },
            printmem() {
                console.log('Vars: ', JSON.stringify(memory.variables));
            },
            int(x) {
                return parseInt(x);
            },
            string(x) {
                return String(x);
            },
            // Array Functions
            sort(array) {
                if(Array.isArray(array)){
                    return array.sort();
                }else{
                    throw new Error(`You can only use sort() on arrays!`);
                }
            },
            reverse(array) {
                if(Array.isArray(array)){
                    return array.reverse();
                }else{
                    throw new Error(`You can only use reverse() on arrays!`);
                }
            },
            shuffle(array) {
                if(Array.isArray(array)){
                    return array.sort(function () { return 0.5 - Math.random() });
                }else{
                    throw new Error(`You can only use shuffle() on arrays!`);
                }
            },
            max(array) {
                if(Array.isArray(array)){
                    return Math.max(...array);
                }else{
                    throw new Error(`You can only use max() on arrays!`);
                }
            },
            min(array) {
                if(Array.isArray(array)){
                    return Math.min(...array);
                }else{
                    throw new Error(`You can only use min() on arrays!`);
                }
            },
            slice(array, start, end) {
                if(Array.isArray(array)){
                    return array.slice(start, end);
                }else{
                    throw new Error(`You can only use slice() on arrays!`);
                }
            },
            clear(array) {
                if(Array.isArray(array)){
                    array = [];
                }else{
                    throw new Error(`You can only use clear() on arrays!`);
                }
            },
            append(array, val) {
                if(Array.isArray(array)){
                    array.push(val);
                }else{
                    throw new Error(`You can only use append() on arrays!`);
                }
            },
            pop(array) {
                if(Array.isArray(array)){
                    return array.pop();
                }else{
                    throw new Error(`You can only use pop() on arrays!`);
                }
            },
            remove(array, val) {
                if(Array.isArray(array)){
                    const index = array.indexOf(val);
                    if (index > -1) {
                        array.splice(index, 1);
                    }
                }else{
                    throw new Error(`You can only use remove() on arrays!`);
                }
            },
            removeAll(array, val) {
                if(Array.isArray(array)){
                    while (array.indexOf(val) > -1) {
                        const index = array.indexOf(val);
                        if (index > -1) {
                            array.splice(index, 1);
                        }
                    }
                }else{
                    throw new Error(`You can only use removeAll() on arrays!`);
                }
            },
            index(array, val) {
                if(Array.isArray(array)){
                    return array.findIndex(a => a === val);
                }else{
                    throw new Error(`You can only use index() on arrays!`);
                }
            },
            size(array) {
                return array.length;
            },
            count(array, val) {
                if(Array.isArray(array)){
                    let counter = 0;
                    for (element of array) {
                        if (element == val) {
                            counter++;
                        }
                    };
                    return counter;
                }else{
                    throw new Error(`You can only use count() on arrays!`);
                }
                
            },
            average(array) {
                if(Array.isArray(array)){
                    let total = 0;
                    let counter = 0;
                    for (element of array) {
                        total += element;
                        counter++;
                    };
                    return total / counter;
                }else{
                    throw new Error(`You can only use average() on arrays!`);
                }
            },
            sum(array) {
                if(Array.isArray(array)){
                    let total = 0;
                    for (element of array) {
                        total += element;
                    };
                    return total;
                }else{
                    throw new Error(`You can only use sum() on arrays!`);
                }
            },
            // Time Functions
            date() {
                return new Date().toString();
            },
            time() {
                return new Date().getTime();
            },
            wait(time) {
                // Time limit is set to 100 seconds for to avoid overloading the server 
                if (time > 100) {
                    time = 100;
                }
                var waitTill = new Date(new Date().getTime() + time * 1000);
                while (waitTill > new Date()) { }
            },
            // Math
            random(max) {
                return Math.floor(Math.random() * max);
            },
            pow(x, y) {
                return Math.pow(x, y);
            },
            sqrt(x) {
                return Math.sqrt(x);
            },
            round(x) {
                return Math.round(x);
            },
            abs(x) {
                return Math.abs(x);
            },
            sin(x) {
                return Math.sin(x);
            },
            cos(x) {
                return Math.cos(x);
            },
            tan(x) {
                return Math.tan(x);
            },
            log(x) {
                return Math.log(x);
            },
            log2(x) {
                return Math.log2(x);
            },
            log10(x) {
                return Math.log10(x);
            },
            floor(x) {
                return Math.floor(x);
            },
            ceil(x) {
                return Math.ceil(x);
            },
            // Run JS code
            run_js(code) {
                return eval(code);
            }
        }
    };

    // Import the lexer
    const analyseCode = require('./lexer');

    // Import the parser
    const parseTokens = require('./parser');

    // Import the interpreter
    const interpret = require('./interpreter');

    // Run the lexer
    var tokens;
    try {
        tokens = analyseCode(code);
    }
    catch (err) {
        post(err.message);
        return
    }

    // Run the parser
    var ast;
    try {
        ast = parseTokens(tokens);
    }
    catch (err) {
        post(err.message);
        return
    }

    // Interpret the ast and return last result with memory.
    try {
        const result = interpret(ast, memory);
    }
    catch (err) {
        post(err.message);
        return
    }

}

const data = workerData;

runcode(data.code, data.socketid);
