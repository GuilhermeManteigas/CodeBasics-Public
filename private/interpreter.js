// Loads lodash so it can be used later on.
const lodash = require('./lodash');

// This function interprets a statement. 
function interpretStatement(statement, memory){
    // Check statement type and re-route them to the apropriate functions to interpret it.
    switch(statement.type) {
        case 'assignment':
            return interpretAssignmentStatement(statement, memory);
        case 'assignmentarray':
            return interpretAssignmentArrayStatement(statement, memory);
        case 'functioncreation':
            return interpretFunctionCreation(statement, memory);
        case 'function':
            return interpretFunctionCall(statement, memory);
        case 'if':
            return interpretIf(statement, memory);
        case 'ifelse':
            return interpretIfElse(statement, memory);
        case 'for':
            return interpretFor(statement, memory);
        case 'foreach':
            return interpretForEach(statement, memory);
        case 'while':
            return interpretWhile(statement, memory);
        case 'return':
            temp = interpretExpression(statement.expression, memory);
            throw temp;
        case 'break':
            throw 'break';
        case 'continue':
            throw 'continue';
        case 'incrementer':
            return interpretIncrementStatement(statement, memory);
        case 'decrementer':
            return interpretDecrementStatement(statement, memory);
        case 'assignmentarrayobject':
            return interpretAssignmentArrayObjectStatement(statement, memory);
    }

    // If type doesnt match any throw exception.
    throw new Error(`Invalid statement of type ${statement.type}`);
};


// This function interprets a expression. 
function interpretExpression(expression, memory){
    // Check expression type and re-route them to the apropriate functions to interpret it.
    switch(expression.type){
        case 'string':
            return expression.value;
        case 'number':
            return parseFloat(expression.value);
        case 'variable':
            return interpretVariableRetrieval(expression, memory);
        case 'function':
            return interpretFunctionCall(expression, memory);
        case 'unary':
            return interpretUnaryOperation(expression, memory);
        case 'operation':
            return interpretBinaryOperation(expression, memory);
        case 'true':
            return true;
        case 'false':
            return false;
        case 'array':
            return interpretArrayRetrieval(expression, memory);
    }

    // If type doesnt match any throw exception.
    throw new Error(`Invalid expression of type ${expression.type}`);
};


// This function interprets an assignment statement. 
function interpretAssignmentStatement(statement, memory){
    // Interpret expression and save the result in the variable.
    memory.variables[statement.name] = interpretExpression(statement.expression, memory);

    // Return variable (This allows it to be used inside function calls and more).
    return memory.variables[statement.name];
};


// This function interprets a increment statement. 
function interpretIncrementStatement(statement, memory){
    // Check if variable exists, if not found in memory check parents memory.
    if (!(statement.value in memory.variables)) {
        if(memory.parent != null){
            return interpretIncrementStatement(statement,memory.parent);
        }else{
            // Variable is not defined so throw error.
            throw new Error(`Runtime Error! Variable '${expression.name}' does not exist.`);
        }
    }

    // Increment variable by 1.
    memory.variables[statement.value] = memory.variables[statement.value] + 1;

    // Return variable (This allows it to be used inside function calls and more).
    return memory.variables[statement.value];
};


// This function interprets a decrement statement. 
function interpretDecrementStatement(statement, memory) {
    // Check if variable exists, if not found in memory check parents memory.
    if (!(statement.value in memory.variables)) {
        if(memory.parent != null){
            return interpretDecrementStatement(statement,memory.parent);
        }else{
            // Variable is not defined so throw error.
            throw new Error(`Runtime Error! Variable '${expression.name}' does not exist.`);
        }
    }

    // Decrement variable by 1.
    memory.variables[statement.value] = memory.variables[statement.value] - 1;

    // Return variable (This allows it to be used inside function calls and more).
    return memory.variables[statement.value];
};


// This function interprets an array assignment statement. 
function interpretAssignmentArrayStatement(statement, memory){
    // Map every array item and form array.
    const array = statement.values.map(
        item => interpretExpression(item, memory)
    );
    
    // Save array to memory.
    memory.variables[statement.name] = array;

    // Returns array (This allows it to be used inside function calls and more).
    return memory.variables[statement.name];
};


// This function interprets an assignment of a value to an array position statement.
function interpretAssignmentArrayObjectStatement(statement, memory){
    if (!(statement.name in memory.variables)) {
        if(memory.parent != null){
            return interpretAssignmentArrayObjectStatement(statement,memory.parent);
        }else{
            // Array is not defined so throw exception.
            throw new Error(`Runtime Error! Array '${statement.name}' does not exist.`);
        }
    }
    // Save the array to the variable in memory and return it.
    memory.variables[statement.name][statement.index] = interpretExpression(statement.expression,memory)
    return memory.variables[statement.name][statement.index];
};


// This function interprets if statements. 
function interpretIf(statement, memory){
    // Interpret the check expression we are checking for.
    const checkValue = interpretExpression(statement.condition, memory);

    if (checkValue) {
        // Value is true so we interpret the if statements.
        return interpretStatements(statement.codeblock, memory);
    }else{
        if (statement.elsecodeblock.type != 'optional'){
            return interpretStatements(statement.elsecodeblock, memory);
        }

    }

    return null;
};


// This function interprets if-else statements. 
function interpretIfElse(statement, memory){
    // Interpret the check expression we are checking for.
    const checkValue = interpretExpression(statement.condition, memory);

    if (checkValue) {
        // Value is true so we interpret the if's own statements.
        return interpretStatements(statement.codeblock, memory);
    }else{
        return interpretStatements(statement.elsecodeblock, memory);
    }
};

// This is a helper function that parses a string with calculations to a result.
function parseCalc(str){
    return Function(`'use strict'; return (${str})`)();
};


// This function interprets for statements. 
function interpretFor(statement, memory){
    // Create a copy of the memory and use it for scoped operations, push that memory to the scope tracker so that later it can be merged with the same global scope.
    scopedmemory = lodash.cloneDeep(memory);
    scopedmemory.variables = {};
    scopedmemory.parent = memory;

    inter = interpretAssignmentStatement(statement.assignment, scopedmemory);
    let variable = scopedmemory.variables[statement.assignment.name];
    let operation = statement.condition.operation;
    let value = statement.condition.right.value.value;

    while(parseCalc(variable + operation + value)){
        try {
            inter += interpretStatements(statement.codeblock, scopedmemory);
            // Check if incrementer/decrementer or expression.
            if(statement.incrementer.type == 'incrementer'){
                variable++;
            }else if(statement.incrementer.type == 'decrementer'){
                variable--;
            }else{
                variable = parseCalc(variable + statement.incrementer.expression.operation + statement.incrementer.expression.right.value.value);
            }
            scopedmemory.variables[statement.assignment.name] = variable;
        }
        catch(err) {
            if(err == 'break'){
                break;
            }
            if(err == 'continue'){
                // Increment variable and continue.
                variable = parseCalc(variable + statement.incrementer.expression.operation + statement.incrementer.expression.right.value.value);
                scopedmemory.variables[statement.assignment.name] = variable;
                continue;
            }
        }
    }
    
    return inter;
};


// This function interprets foreach statements. 
function interpretForEach(statement, memory){
    // Create a copy of the memory with the cm as its parent and use it for scoped operation.
    scopedmemory = lodash.cloneDeep(memory);
    scopedmemory.variables = {};
    scopedmemory.parent = memory;

    // Iterate over the array and changing the element variable and runnign the code block.
    for (let index = 0; index < memory.variables[statement.list.value].length; ++index) {
        scopedmemory.variables[statement.variable.value] = memory.variables[statement.list.value][index];
        try {
            inter += interpretStatements(statement.codeblock, scopedmemory);
        }
        catch(err) {
            if(err == 'break'){
                break;
            }
            if(err == 'continue'){
                continue;
            }
        }
    }

    return inter;
};


// This function interprets while statements. 
function interpretWhile(statement, memory){
    // Create a copy of the memory its parent and use it for scoped operation.
    scopedmemory = lodash.cloneDeep(memory);
    scopedmemory.variables = {};
    scopedmemory.parent = memory;

    condition = interpretExpression(statement.condition, memory);

    while(condition){
        try {
            inter += interpretStatements(statement.codeblock, scopedmemory);
        }
        catch(err) {
            // Check for break exceptions
            if(err == 'break'){
                break;
            }
            // Check for continue exceptions
            if(err == 'continue'){
                continue;
            }
        }

        // Recheck condition at end of while
        condition = interpretExpression(statement.condition, memory);
    }

    return inter;
};


// This function interprets variable retrieval expressions. 
function interpretVariableRetrieval(expression, memory){
    if (!(expression.name in memory.variables)) {
        if(memory.parent != null){
            return interpretVariableRetrieval(expression,memory.parent);
        }else{
            // Variable is not defined so throw error.
            throw new Error(`Runtime Error! Variable '${expression.name}' does not exist.`);
        }
    }

    return memory.variables[expression.name];
};


// This function interprets array retrieval expressions. 
function interpretArrayRetrieval(expression, memory){
    console.log(expression);
    if (!(expression.name in memory.variables)) {
        if(memory.parent != null){
            return interpretArrayRetrieval(expression,memory.parent);
        }else{
            // Variable is not defined so this is a runtime error which we need to throw.
            throw new Error(`Runtime Error! Variable '${expression.name}' does not exist.`);
        }
    }
    // We return the variable's value from memory.
    return memory.variables[expression.name][expression.index];
};


// This function interprets function creation expressions. 
function interpretFunctionCreation(expression, memory){

    const par = expression.parameters.map(
        parameter => expression.parameters.value
    );

    str = `{${expression.name}  (${expression.parameters}) {${expression.codeblock}}`;
    const na = expression.name
    
    memory.functions[na] = [(expression.parameters),(expression.codeblock)];

    return //memory.jsfunctions[expression.name](...parameters);
};


// This function interprets function calls. 
function interpretFunctionCall(expression, memory){
    // Check if function exists.
    if (!(expression.name in memory.jsfunctions || expression.name in memory.functions)) {
        // Function is not defined so throw exception.
        throw new Error(`Runtime Error! Function '${expression.name}' is not defined.`);
    }

    // Map all the parameters
    const parameters = expression.parameters.map(
        parameter => interpretExpression(parameter, memory)
    );

    // Retrieve function interpret it with the parameters and return the values.
    if (expression.name in memory.jsfunctions){
        return memory.jsfunctions[expression.name](...parameters);
    }else if (expression.name in memory.functions){
        scopedmemory = lodash.cloneDeep(memory);
        scopedmemory.variables = {};
        scopedmemory.parent = memory;
        
        for(i in memory.functions[expression.name][0]){
            scopedmemory.variables[scopedmemory.functions[expression.name][0][i].value.name] = lodash.cloneDeep(parameters[i]);
        }

        try {
            return interpretStatements(memory.functions[expression.name][1], scopedmemory);
        }
        catch(returnValue) {
            return returnValue;
        }
    }
};


// This function interprets unary operations. 
function interpretUnaryOperation(expression, memory) {
    const value = interpretExpression(expression.value, memory);
    if (expression.withNot) {
      return !value;
    } else {
      return value;
    }
  }


// This function interprets binary operations. 
function interpretBinaryOperation(expression, memory) {
    // Create a map of all operations.
    const operations = {
      '+': (leftValue, rightValue) => leftValue + rightValue,
      '-': (leftValue, rightValue) => leftValue - rightValue,
      '*': (leftValue, rightValue) => leftValue * rightValue,
      '/': (leftValue, rightValue) => leftValue / rightValue,
      '&&': (leftValue, rightValue) => leftValue && rightValue,
      '||': (leftValue, rightValue) => leftValue || rightValue,
      '>': (leftValue, rightValue) => leftValue > rightValue,
      '<': (leftValue, rightValue) => leftValue < rightValue,
      '<=': (leftValue, rightValue) => leftValue <= rightValue,
      '>=': (leftValue, rightValue) => leftValue >= rightValue,
      '==': (leftValue, rightValue) => leftValue == rightValue,
      '!=': (leftValue, rightValue) => leftValue != rightValue,
    };
  
    // Get the correct function for the operation.
    const operation = operations[expression.operation];
  
    if (!operation) {
      throw new Error(`Invalid operation requested: ${expression.operation}`);
    }
  
    // Interpret the expression for both sides of the operation.
    const leftValue = interpretExpression(expression.left, memory);
    const rightValue = interpretExpression(expression.right, memory);
  
    // Return operation result.
    return operation(leftValue, rightValue);
  }


// This function interprets a Abstract syntax tree. 
function interpretStatements(ast, memory){

    for (const branch of ast) {
        // Interpret the statement and set the result.
        interpretStatement(branch, memory);
    }

    // Return last set result.
    return
};


module.exports = interpretStatements;