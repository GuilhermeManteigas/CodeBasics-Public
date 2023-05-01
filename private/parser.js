////////////////////////////////////////////////////////////////////////////
//                                                                        //
//                      Token Reader Helper Class                         //
//                                                                        //
////////////////////////////////////////////////////////////////////////////

// This class helps iterate the token list allowing for things like keeping track of history and rollbacks, and moving thougth token list.
class TokenReader {
    constructor(tokenList) {
        this.tokenList = tokenList;
        this.tokenHistory = []; // Keep a token history with token positions in case the position needs to be rolled back
        this.currentPosition = 0;
        
    }

    // This function saves the current position in the history so it can be rolled back later
    saveTokenToHistory() {
        this.tokenHistory.push(this.currentPosition);
    }

    // This function rolls back to the last saved history position
    rollbackHistory() {
        this.currentPosition = this.tokenHistory.pop();
    }

    // This function removes the last saved position from the history.
    removeLastSavedTokenHistory() {
        this.tokenHistory.pop();
    }

    // This function returns the size of  the token history.
    getHistorySize(){
        return this.tokenHistory.length;
    }

    // This function returns the value of the current token.
    getTokenValue() {        
        if(typeof(this.getToken()) == 'undefined'){
            throw 'undefined';
        }
        return this.getToken().value;
    }

    // This function returns the current token.
    getToken() {
        return this.tokenList[this.currentPosition];
    }

    // This function returns true if there is a next token in the tokenlist, and false if the end of the list was reached.
    hasNext() {
        return this.currentPosition < this.tokenList.length;
    }

    // This function moves to the next token.
    next() {
        if(this.currentPosition < this.tokenList.length){
            this.currentPosition++;
        }
    }

}


////////////////////////////////////////////////////////////////////////////
//                                                                        //
//                      Language Grammatical Rules                        //
//                                                                        //
////////////////////////////////////////////////////////////////////////////

// Has to be declared here to avoid errors for being called before its defined, its definition doesnt matter as grammar rules always return functions so even if build before the token_reader exists they will still work as token_reader will have a value once the functions are executed.
var token_reader = null;

// This function returns a function that uses the current token reader position and checks if the rule applies to it.
function grammarRule(checkFunction, answer) {
    return function(){
        //Run checkFunction to get a function to check the rule for the token.
        let checks = checkFunction();

        // Run the function to check the rule for the token.
        let check = checks(token_reader);
        
        // Check if check, if its not null then a match was found so we use the answer function on the check to get an object for the interpreter, if it is null then return null.
        if (check) {
            return answer(check);
        } else {
            return null;
        }
    }
}


// The Sequence function returns a function that checks if the token reader matches the received sequence and returns a function to use on the token reader, if the token doesnt match the sequence it returns null.
function sequence(...sequence) {
    return function(){
    const pattern = [];
    // Save state so it can be restored later if a token does not match the sequence.
    token_reader.saveTokenToHistory();
    for (const item of sequence) {
        const check = item(token_reader);
        // If token doesnt match item of sequence, restore the token state and return null, if token matches then add it to the pattern.
        if (check) {
            pattern.push(check);
        }else{
            token_reader.rollbackHistory();
            return null;
        }
    }
    // If tokens are the same as sequence then, remove the saved state and return pattern.
    token_reader.removeLastSavedTokenHistory();
    return pattern;
    }
}


// The OneOf function returns a function that checks if the token reader matches one of the inputs and returns a function to use on the token reader, if the token doesnt match any of the inputs it returns null.
function oneOf(...inputs) {
    return function(){
        for (const item of inputs) {
            // Save state so it can be restored later if the token does not match any input.
            token_reader.saveTokenToHistory();
            check = item(token_reader);
            // If token matches one of the inputs, if token matches remove token reader saved state and return the match, if the token doesnt match restore the token state.
            if (check) {
                token_reader.removeLastSavedTokenHistory();
                return check;
            }else{
                token_reader.rollbackHistory();
            }
        }
        // If no match is found return null.
        return null;
    }
}


// This function returns a function that uses the current token reader position and checks if the rule applies if it doesnt it returns a default optional object, by not returning null it makes it possible to have optional values.
// Usage example: in a function the paramenter can be optional => function() | function(param1, param2)
function optional(check, returnValue = { type: 'optional' }) {
    return function() {
        // Save state so it can be restored later if the token does not match any input.
        token_reader.saveTokenToHistory();
        let valid = check(token_reader);
        // If check passes returns the result if not returns optional value
        if (valid) {
            token_reader.removeLastSavedTokenHistory();
            return valid;
        }else{
            token_reader.rollbackHistory();
            return returnValue;
        }
    }
}


// This function returns a function that uses the current token reader position and checks if the rule applies a minimum ammount of times to any maximum.
// Usage example: in an operation we know the minimum will be 1 group of (operator number) but there is no maximum => number (operator number) (operator number) ... ... (operator number)
function minOf(minAmount, check) {
    return function() {
        // Save state so it can be restored later if the token does not match any input.
        token_reader.saveTokenToHistory();
        const results = [];
        // Check for minimum ammount first and if fail rollback history
        for(let i = 0; i < minAmount; i++){
            const result = check(token_reader);
            if (result) {
                results.push(result);
            }else{
                token_reader.rollbackHistory();
                return null;
            }
        }
        // Check for anything after the minimum
        for(;;){
            const result = check(token_reader);
            if (result) {
                results.push(result);   
            }else{
                break;
            }
        }
        // Sucess so remove last history entry and return results
        token_reader.removeLastSavedTokenHistory();
        return results;
    }
}


// This function defines the general rule that applies to any statement.
// The rule is: IfStatementRule | ForStatementRule | ForEachStatementRule | WhileStatementRule | AssignmentStatementRule | AssignmentStatementArrayRule | FunctionCreationStatementRule | FunctionStatementRule | ReturnStatementRule | BreakStatementRule | ContinueStatementRule | IncrementorStatementRule | DecrementorStatementRule | AssignmentStatementArrayObjectRule
let Statement = grammarRule(
    function pattern() { return oneOf(IfStatementRule(), ForStatementRule(), ForEachStatementRule(), WhileStatementRule(), AssignmentStatementRule(), AssignmentStatementArrayRule(), FunctionCreationStatementRule(), FunctionStatementRule(), ReturnStatementRule(), BreakStatementRule(), ContinueStatementRule(), IncrementorStatementRule(), DecrementorStatementRule(), AssignmentStatementArrayObjectRule());},
    function action(expression) { return expression;}
);


// This function defines the rule for the if statement.
// The rule is: IfKeyword POpen ExpressionRule PClose CodeBlock => if(condition){}
function IfStatementRule(){
    function pattern(){ return sequence(IfKeyword, POpen, ExpressionRule(), PClose, CodeBlock(),optional(ElseKeyword), optional(CodeBlock()));}
    function action([,, condition,, codeblock,, elsecodeblock]){ return { type: 'if', condition: condition, codeblock: codeblock , withelse: elsecodeblock.type != 'optional' , elsecodeblock: elsecodeblock};}
    return grammarRule(pattern, action);
} 


// This function defines the rule for the for statement.
// The rule is: ForKeyword POpen AssignmentStatementRule ExpressionRule Eol AssignmentStatementRule PClose CodeBlock => for(assignment;condition;incrementer){}
function ForStatementRule(){
    function pattern(){ return sequence(ForKeyword, POpen, AssignmentStatementRule(), ExpressionRule(), Eol, oneOf(AssignmentStatementForRule(), IncrementorStatementRule(), DecrementorStatementRule()), PClose, CodeBlock());}
    function action([,, assignment,condition,,incrementer ,, codeblock]){ return { type: 'for', assignment: assignment, condition: condition, incrementer: incrementer, codeblock: codeblock };}
    return grammarRule(pattern, action);
} 


// This function defines the rule for the foreach statement.
// The rule is: ForEachKeyword POpen Name InKeyword Name PClose CodeBlock => foreach(name in names){}
function ForEachStatementRule(){
    function pattern(){ return sequence(ForEachKeyword, POpen, Name, InKeyword, Name, PClose, CodeBlock());}
    function action([,, variable,,list,,codeblock]){ return { type: 'foreach', variable: variable, list: list, codeblock: codeblock };}
    return grammarRule(pattern, action);
} 


// This function defines the rule for the while statement.
// The rule is: WhileKeyword POpen ExpressionRule PClose CodeBlock => while(condition){}
function WhileStatementRule(){
    function pattern(){ return sequence(WhileKeyword, POpen, ExpressionRule(), PClose, CodeBlock());}
    function action([,, condition,, codeblock]){ return { type: 'while', condition: condition, codeblock: codeblock };}
    return grammarRule(pattern, action);
} 


// This function defines the rule for the code block.
// The rule is: CBOpen Statements(0 to infinite) CBClosed => {statements}
function CodeBlock(){
    function pattern(){ return sequence(CBOpen, minOf(0, Statement), CBClosed);}
    function action([, statements,]){ return statements;}
    return grammarRule(pattern, action);
}


// This function defines the rule for function creation statements.
// The rule is: Name POpen optional(FunctionParametersRule) PClose CodeBlock => function(args){}
function FunctionCreationStatementRule(){
    function pattern(){ return sequence(Name, POpen, optional(FunctionParametersRule(), []), PClose, CodeBlock());}
    function action([name, , parameters, , codeblock]){ return {type: 'functioncreation', name: name.value, parameters: parameters, codeblock:codeblock};}
    return grammarRule(pattern, action);
} 


// This function defines the rule for function statements.
// The rule is: FunctionExpressionRule Eol => function();
function FunctionStatementRule(){
    function pattern(){ return sequence(FunctionExpressionRule(), Eol);}
    function action([expression]){ return expression;}
    return grammarRule(pattern, action);
}


// This function defines the rule for function expressions.
// The rule is: Name POpen optional(FunctionParametersRule) PClose => function()
function FunctionExpressionRule(){
    function pattern(){ return sequence(Name, POpen, optional(FunctionParametersRule(), []), PClose);}
    function action([name, , parameters]){ return {type: 'function', name: name.value, parameters: parameters};}
    return grammarRule(pattern, action);
} 


// This function defines the rule for function parameters.
// The rule is: ExpressionRule minOf(0, sequence(Comma, ExpressionRule())) => () or (value) or (value1, value2) or (value1, value2, value3) ...
function FunctionParametersRule(){
    function pattern(){ return sequence(ExpressionRule(), minOf(0, sequence(Comma, ExpressionRule())));}
    function action([first, rest]){ return [first, ...rest.map(function _([, parameter]){return parameter})];}
    return grammarRule(pattern, action);
}

// ReturnStatementRule -> Return ExpressionRule Eol
// This function defines the rule for return statements.
// The rule is: ReturnKeyword ExpressionRule Eol => return expression;
function ReturnStatementRule(){
    function pattern(){ return sequence(ReturnKeyword, ExpressionRule(), Eol);}
    function action([,expression,]){ return { type: 'return', expression: expression };}
    return grammarRule(pattern, action);
}


// This function defines the rule for incrementor statements.
// The rule is: IncrementorKeyword optional(Eol) => val++;
function IncrementorStatementRule(){
    function pattern(){ return sequence(IncrementorKeyword, optional(Eol));}
    function action([incrementer,]){ return { type: incrementer.type, value: incrementer.value };}
    return grammarRule(pattern, action);
}


// This function defines the rule for decrementor statements.
// The rule is: DecrementorKeyword optional(Eol) => val--;
function DecrementorStatementRule(){
    function pattern(){ return sequence(DecrementorKeyword, optional(Eol));}
    function action([decrementer,]){ return { type: decrementer.type, value: decrementer.value };}
    return grammarRule(pattern, action);
}


// This function defines the rule for break statements.
// The rule is: BreakKeyword Eol => break;
function BreakStatementRule(){
    function pattern(){ return sequence(BreakKeyword, Eol);}
    function action([,]){ return { type: 'break' };}
    return grammarRule(pattern, action);
}


// This function defines the rule for continue statements.
// The rule is: ContinueKeyword Eol => break;
function ContinueStatementRule(){
    function pattern(){ return sequence(ContinueKeyword, Eol);}
    function action([,]){ return { type: 'continue' };}
    return grammarRule(pattern, action);
}


// This function defines the rule for assignment statements.
// The rule is: Name Equals ExpressionRule Eol => name=expression;
function AssignmentStatementRule(){
    function pattern(){ return sequence(Name, Equals, ExpressionRule(), Eol);}
    function action([name,, expression]){ return { type: 'assignment', name: name.value, expression: expression };}
    return grammarRule(pattern, action);
}


// AssignmentStatementForRule -> Name Equals ExpressionRule
// This function defines the rule for assignment statements inside for statements. This exception allows for value = value + 1 instead of value++ inside the for incrementor slot.
// The rule is: Name Equals ExpressionRule => name=expression
function AssignmentStatementForRule(){
    function pattern(){ return sequence(Name, Equals, ExpressionRule());}
    function action([name,, expression]){ return { type: 'assignment', name: name.value, expression: expression };}
    return grammarRule(pattern, action);
}


// This function defines the rule for array assignment statements.
// The rule is: Name Equals SBOpen optional(ArrayValuesRule) SBClose Eol => name=[1,2,3];
function AssignmentStatementArrayRule(){
    function pattern(){ return sequence(Name, Equals, SBOpen, optional(ArrayValuesRule(), []), SBClose, Eol);}
    function action([name,,, values]){ return { type: 'assignmentarray', name: name.value, values: values };}
    return grammarRule(pattern, action);
} 


// This function defines the rule for an array assignment statements exception.
function AssignmentStatementArrayObjectRule(){
    function pattern(){ return sequence(Array, Equals, ExpressionRule(), Eol);}
    function action([array,, expression]){ return { type: 'assignmentarrayobject', name: array.name, index: array.index, expression: expression };}
    return grammarRule(pattern, action);
}


// This function defines the rule for array values.
// The rule is: NumberExpressionRule minOf(0, (Comma, NumberExpressionRule)) => 1,2,3
function ArrayValuesRule(){
    function pattern(){ return sequence(oneOf(StringExpressionRule(),NumberExpressionRule()), minOf(0, sequence(Comma, oneOf(StringExpressionRule(),NumberExpressionRule()))));}
    function action([first, rest]){ return [first, ...rest.map(function _([, values]){return values})];}
    return grammarRule(pattern, action);
}


// This function nestes multiple operations together in binary operations.
function binaryOperation([left, right]) {
    // We iterate through everything thats on the rigth side, each time we encoutner and expression we save the previous one on the left side. 
    // The final object returned by this reduce function represents the entire binary calculation, with each operation object nested within another operation object.
    return right.reduce((expression, [operator, rightSide]) => { return {type: "operation", operation: operator.value, left: expression, right: rightSide}}, left);
};


// This function defines the rule for esxpressions.
// The rule is: EqualityRule minOf(0, ((And | Or) EqualityRule))
function ExpressionRule(){
    function pattern(){ return sequence(EqualityRule(), minOf(0, sequence(oneOf(And, Or), EqualityRule())));}
    return grammarRule(pattern, binaryOperation);
}


// This function defines the rule for equality.
// The rule is: ComparisonRule minOf(0, ((DoubleEquals | NotEquals) ComparisonRule))
function EqualityRule(){
    function pattern(){ return sequence(ComparisonRule(), minOf(0, sequence(oneOf(DoubleEquals, NotEquals), ComparisonRule())));}
    return grammarRule(pattern, binaryOperation);
} 


// This function defines the rule for comparison.
// The rule is: AdditionSubtractionRule minOf(0, ((Less | Greater | LessEquals | GreaterEquals) AdditionSubtractionRule))
function ComparisonRule(){
    function pattern(){ return sequence(AdditionSubtractionRule(), minOf(0, sequence(oneOf(Less, Greater, LessEquals, GreaterEquals), AdditionSubtractionRule())));}
    return grammarRule(pattern, binaryOperation);
} 


// This function defines the rule for addition and subtraction.
// The rule is: MultiplicationDivisionRule, minOf(0, ((Add | Subtract) MultiplicationDivisionRule))
function AdditionSubtractionRule(){
    function pattern(){ return sequence(MultiplicationDivisionRule(), minOf(0, sequence(oneOf(Add, Subtract), MultiplicationDivisionRule())));}
    return grammarRule(pattern, binaryOperation);
} 


// This function defines the rule for Multiplication and division.
// The rule is: UnaryOperationRule, minOf(0, ((Multiply | Divide) UnaryOperationRule))
function MultiplicationDivisionRule(){
    function pattern(){ return sequence(UnaryOperationRule(), minOf(0, sequence(oneOf(Multiply, Divide), UnaryOperationRule())));}
    return grammarRule(pattern, binaryOperation);
}


// This function defines the rule for unary operations.
// The rule is: optional(Not) AlternativeExpressionRule
function UnaryOperationRule(){
    function pattern(){ return sequence(optional(Not), AlternativeExpressionRule());}
    function action([not, value]){ return {type: 'unary', withNot: not.type != 'optional', value: value};}
    return grammarRule(pattern, action);
} 


// This function defines the rule for alternative expressions.
// The rule is: GroupingExpressionRule | FunctionExpressionRule | NumberExpressionRule | VariableExpressionRule | StringExpressionRule | ArrayExpressionRule | TrueExpessionRule | FalseExpessionRule
function AlternativeExpressionRule(){
    function pattern(){ return oneOf(GroupingExpressionRule(), FunctionExpressionRule(), NumberExpressionRule(), VariableExpressionRule(), StringExpressionRule(), ArrayExpressionRule(),TrueExpessionRule(),FalseExpessionRule());}
    function action(factor){ return factor;}
    return grammarRule(pattern, action);
} 


// This function defines the rule for true expressions.
// The rule is: TrueKeyword => true
function TrueExpessionRule(){
    function pattern(){ return sequence(TrueKeyword);}
    function action([]){ return { type: 'true' };}
    return grammarRule(pattern, action);
}


// This function defines the rule for false expressions.
// The rule is: FalseKeyword => false
function FalseExpessionRule(){
    function pattern(){ return sequence(FalseKeyword);}
    function action([]){ return { type: 'false' };}
    return grammarRule(pattern, action);
}


// This function defines the rule for grouping expressions.
// The rule is: POpen ExpressionRule PClose => (expression) | (1+1)
function GroupingExpressionRule(){
    function pattern(){ return sequence(POpen, ExpressionRule(), PClose);}
    function action([, expression]){ return expression;}
    return grammarRule(pattern, action);
} 


// This function defines the rule for variable expressions.
// The rule is: Name 
function VariableExpressionRule(){
    function pattern(){ return Name;}
    function action(name){ return {type: 'variable', name: name.value };}
    return grammarRule(pattern, action);
}


// This function defines the rule for strings expressions.
// The rule is: String 
function StringExpressionRule(){
    function pattern(){ return String;}
    function action(string){ return {type: 'string', value: string.value };}
    return grammarRule(pattern, action);
}


// This function defines the rule for numbers expressions.
// The rule is: Number 
function NumberExpressionRule(){
    function pattern(){ return Number;}
    function action(number){ return {type: 'number', value: number.value };}
    return grammarRule(pattern, action);
}


// This function defines the rule for array expressions.
// The rule is: Array 
function ArrayExpressionRule(){
    function pattern(){ return Array;}
    function action(array){ return {type: 'array', name: array.name, index: array.index };}
    return grammarRule(pattern, action);
}


// This function checks if token is a number.
function Number(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'number') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a string.
function String(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'string') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a array.
function Array(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'array') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a name.
function Name(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'name') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a open parenthesis.
function POpen(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'parenOpen') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a close parenthesis.
function PClose(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'parenClose') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a open square bracket.
function SBOpen(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'squareBracketOpen') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a close square bracket.
function SBClose(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'squareBracketClose') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a open curly bracket.
function CBOpen(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'curlyBracketOpen') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a close curly bracket.
function CBClosed(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'curlyBracketClose') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a comma.
function Comma(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'comma') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a end of line(';').
function Eol(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'endOfLine') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a equal sign.
function Equals(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'operator' && currentToken.value == '=') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a plus sign.
function Add(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'operator' && currentToken.value == '+') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a minus sign.
function Subtract(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'operator' && currentToken.value == '-') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a asterisk sign.
function Multiply(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'operator' && currentToken.value == '*') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a divisor('/').
function Divide(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'operator' && currentToken.value == '/') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a less sign ('<').
function Less(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'operator' && currentToken.value == '<') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a greater sign('>').
function Greater(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'operator' && currentToken.value == '>') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a not sign('!').
function Not(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'operator' && currentToken.value == '!') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is two equal signs('==').
function DoubleEquals(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'operator' && currentToken.value == '==') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a ('<=').
function LessEquals(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'operator' && currentToken.value == '<=') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a ('>=').
function GreaterEquals(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'operator' && currentToken.value == '>=') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a ('!=').
function NotEquals(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'operator' && currentToken.value == '!=') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a and operator.
function And(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'operator' && currentToken.value == '&&') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a or operator.
function Or(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'operator' && currentToken.value == '||') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a if keyword.
function IfKeyword(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'keyword' && currentToken.value == 'if') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a else keyword.
function ElseKeyword(){ 
    const currentToken = token_reader.getToken();
    //console.log(JSON.stringify(currentToken));
    if (currentToken != undefined && currentToken.type == 'keyword' && currentToken.value == 'else') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a for keyword.
function ForKeyword(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'keyword' && currentToken.value == 'for') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a foreach keyword.
function ForEachKeyword(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'keyword' && currentToken.value == 'foreach') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a in keyword.
function InKeyword(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'keyword' && currentToken.value == 'in') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a while keyword.
function WhileKeyword(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'keyword' && currentToken.value == 'while') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a return keyword.
function ReturnKeyword(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'keyword' && currentToken.value == 'return') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a break keyword.
function BreakKeyword(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'keyword' && currentToken.value == 'break') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a continue keyword.
function ContinueKeyword(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'keyword' && currentToken.value == 'continue') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a true keyword.
function TrueKeyword(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'keyword' && currentToken.value == 'true') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a false keyword.
function FalseKeyword(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'keyword' && currentToken.value == 'false') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a incrementor keyword ('variable++').
function IncrementorKeyword(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'incrementer') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


// This function checks if token is a decrementor keyword ('variable--').
function DecrementorKeyword(){ 
    const currentToken = token_reader.getToken();
    if (currentToken != undefined && currentToken.type == 'decrementer') {
        // Tokens match so return the token and move the token reader to the next token.
        token_reader.next();
        return currentToken;
    }else{
        // Tokens dont match return null.
        return null;
    }
} 


////////////////////////////////////////////////////////////////////////////
//                                                                        //
//                            Parser Function                             //
//                                                                        //
////////////////////////////////////////////////////////////////////////////
function parser(tokens) {
    let AbstractSyntaxTree = [];
    // Create a token reader
    const reader = new TokenReader(tokens);
    token_reader = reader;

    // Go over every token and form the AST branches.
    while (reader.hasNext()) {
        let branch = null;
        try{
            branch = Statement(reader);
        }catch(err){
            if(err == 'undefined'){
                // Rollback to the beggining of the branch.
                while(reader.getHistorySize() > 0){
                    reader.rollbackHistory();
                }
                
                let faultyToken = reader.getToken();
                throw new Error(`Syntax error found at line ${faultyToken.lineNumber}:${faultyToken.characterNumberInLine} for "${faultyToken.value}". The statement is incomplete! Check if you closed all parentheses.`);
            }else{
                console.log(err);
                throw new Error(`Error found! This is an unknown error type please send a copy of your code to u04gd19@abdn.ac.uk so a language fix can be implement. Thank you :)`);
            }
        }

        // If branch is not null add it to the AST.
        if (branch != null) {
            AbstractSyntaxTree.push(branch);
        }else{
            // Brach was null so throw error.
            let faultyToken = reader.getToken();
            throw new Error(`Syntax error found at line ${faultyToken.lineNumber}:${faultyToken.characterNumberInLine} for "${faultyToken.value}". Most times this is due to unclosed parentheses or missing ";" at the end of the line.`);
        }

    }

    // Return the Abstract Syntax Tree.
    return AbstractSyntaxTree;
};

module.exports = parser;
