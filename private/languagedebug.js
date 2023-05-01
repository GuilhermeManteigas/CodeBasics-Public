// Code
const code = `
firstName = 'Guilherme';
lastName = 'Manteigas';
age = 50;
age = age + 5;
test = [1,2];
print(test);

#This is a comment
# 
#for testing works


joka (number, ola) {
    val = 1;
    print(' is SO COOL!'); 
    print(val);
}

joka2 (number) {
    val = 69;
    age = age + 1;
    print(' is SO COOL!!!!'); 
    if (1 > 10){
        print('FIRST'); 
        return 1;
    }
    if (10 > 1){
        print('FIRST'); 
        return number;
    }
    print('Second'); 
    
}

joka(1, 2);
teste = joka2(1);
print('PLEASE WORK ' + teste);
print(teste);

print('Entered name: ' + firstName + ', ' + lastName);

if (age > 40) {
    if (age > 45) {
        print('Age is above 45');
    }
    print('Welcome, ' + firstName + ' you are ' + age + ' old.');
}


if (50 > 40) {
    print('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
}



for (i = 0; i < 5; i = i + 1) {
    print('Age:' + age);
    age = age + 1;
    for (a = 0; a < 3; a = a + 1) {
        print('YOLO');
    }
}

vario = 5;

fun1 () {
    val = 1;
    vario = vario + val;
    if (val > 0){
        print(1);
        return vario;
    }
    vario = 0;
    return vario;
}

fun2 () {
    val = 3;
    vario = vario + val;
    return vario;
}
print(6);
print(fun1());
print(6);
print(fun2());


fibold(n) {
    if (n <= 1){
        return n;
    } 
    temp = fib(n - 2) + fib(n - 1);
    return temp;
}

fib(num){
    #print('Number: ' + num);
    if (num < 2){
        return num;
    }
    t1 = num - 1;
    #print('t1: ' + num);
    t2 = num - 2;
    #print('t2: ' + num);
    temp = fib(num - 1) + fib(num - 2);
    #print('TEMP: '+temp);
    return temp;
    
}
print('ola');

print('#########');

for (i = 0; i < 5; i = i + 1) {
    #print('hihi');
    #print('i:' + i);
    h = 1;
    #a = fib(2); # problem here!!!!!!
    #print(a);
    print('answer: ' + fib(i));
    #print('i:' + i);

}

print('END');

gui(h){
    return 10 + h + 5 * 2 -1;
}

print(gui(10));

#print(10);

st = 'gui\\\\gui';
print(st);

st = 'gui\\'gui\\'';
print(st);

#st = 'gui\\'gui'';
#print(st);


b = (10 + 10) / 2;

print(b);


for (i = 0; i < 5; i = i + 1) {
    if(i == 3){
        continue;
    }
    print('hihi'+i);

}

a = 1 + 3+4+5+66+77+88+9999999+1+1+1+1+1*2;
print(a);



for (i = 0; i < 5; i = i + 1) {
    if(i == 3){
        continue;
    }
    print('Hello World'+i);

}


for (i = 10; i > 5; i--) {
    #print('hihi');
    #print('i:' + i);
    h = 1;
    #a = fib(2); # problem here!!!!!!
    #print(a);
    print('answer: ' + fib(i));
    #print('i:' + i);

}

#Updates from here

if(5 > 10){
    print('if');
}else{
    print('else');
}


if (50 > 40) {
    print('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
}

if (50 > 40) {
    print('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
}
if (50 > 40) {
    print('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
}
if (50 > 40) {
    print('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
}
if (50 > 40) {
    print('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
}
if (50 > 40) {
    print('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
}

if(5 > 10){
    print('if');
}else{
    print('else2');
    if(5 > 10){
        print('if');
    }else{
        print('else3');
    }
}

lol = 5;
print('s');
if(lol > 0){
    print('dd');
}


if(true){
    print('trueeee');
}


if(false){
    print('trueeee');
}

s = 5 + 5.5 * 0.005;
print(s);

counter = 0;
counter--;
counter--;
print(counter);

total = 10;
while(total > 0){
    print(total);
    total--;
}

arr = [1,2,3,4,5];
print(arr);
arr[1] = arr[3];
print(arr[1]);

print(reverse(arr));
#print(shuffle(arr));
print('now');
print(arr);
print(max(arr));
print(min(arr));

print('Size:');
print(size(arr));

print('Index:');
print(index(arr, 5));

print('Append:');
print(append(arr, 10));
print(append(arr, 11));
print(append(arr, 10));
print(append(arr, 10));
print(append(arr, 10));
print(arr);

print('Remove:');
remove(arr,10);
print(arr);

print('Remove All:');
removeAll(arr,10);
print(arr);

var_a = 10;
print(var_a);
wait(3);
print(var_a);


temp = run_js('50*500*1000/2;');
print(temp);

foreach (temp in arr){
    print(temp);
}

eif(){
    print('Hello');
}

eif();

print(arr);
print(count(arr,4));

print(average(arr));

print(sum(arr));

print('problem');

a = 5 + -1;
print(a);




`;


function runcode(code){
    // Import the lexer
    const lexer = require('./lexer');
    // Import the parser
    const parser = require('./parser');
    // Import the interpreter
    const interpreter = require('./interpreter');
    // Create language memory
    const memory = {
        parent: null,
        variables: {},
        functions: {},
        jsfunctions: {
            print(str) {
                if (Array.isArray(str)){
                    str = `[${str.toString()}]`;
                }
                console.log('Print:', str); 
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

    // Run the lexer
    var tokens;
    try {
        tokens = lexer(code);
    }
    catch(err) {
        console.log('Error Lexer:', err.message);
        return
    }

    // Run the parser
    var statements;
    try {
        statements = parser(tokens);
    }
    catch(err) {
        console.log('Error Parser:', err.message);
        return
    }

    // Interpret the statements and return last result with memory.
    try {
        const result = interpreter(statements, memory);
    }
    catch(err) {
        console.log('Error Interpreter:', err.message);
    }
    
}


runcode(code);