// This class allows for the parsing of a string character by character, keeping track of the current position, line number, and character number in line.
class CharReader {
    // The Constructor receives a string as input and saves it as well as sets the values for the variables globalPosition, line and characterInLine.
    constructor(str) {
      this.globalPosition = 0;
      this.line = 1;
      this.characterInLine = 1;
      this.str = str;
    }
  
    // Receives as input a quantity(default = 1) and moves the reader position by that quantity.
    next(quantity = 1) {
        // Increment characterInLine by the quantity and check if line is changed.
        for (let i = 0; i < quantity; i++) {
            if (this.str[this.globalPosition + i] == '\n') {
                this.line++;
                this.characterInLine = 1;
            } else {
                this.characterInLine++;
            }
        }
      this.globalPosition += quantity;
    }

    // Returns the values that are quantity spaces ahead without moving the reader position.
    lookAhead(quantity = 1) {
        return this.str.slice(this.globalPosition, this.globalPosition + quantity);
    }

    // Returns the values that are quantity spaces backwards without moving the reader position.
    lookBack(quantity = 1) {
      return this.str.slice(this.globalPosition - quantity, this.globalPosition);
    }

    // Returns the current character position in the line.
    getCharacterNumberInLine() {
      return this.characterInLine;
    }
    
    // Returns the current line position in the text.
    getLineNumber() {
      return this.line;
    }
  
    // Returns true if there is at least one more chat in the text.
    hasNext() {
      return this.globalPosition < this.str.length;
    }
}

// This function receives a caracter reader, if that reader matches a number it returns a token of type number, if it does not match a number it returns null.
function checkIfNumberToken(charReader) {
    // Regular expression value for digit.
    const digitRegExp = /\d/; 
    // Regular expression value for digit separator.
    const dotRegExp = /\./;
    let value = '';
    // To keep track if number already has a decimal point.
    let decimalPoint = false; 

    // Check for negative numbers (needs to evaluate the previous chars to figure out if it iss an operation or a negative number).
    if(value == ''){
        if(charReader.hasNext() && charReader.lookAhead().match("-") && charReader.lookAhead(2).match(digitRegExp) && !charReader.lookBack(2).match(digitRegExp)){
            value += charReader.lookAhead();
            charReader.next();
        }
    }

    // Keep reading if there are more chars and it matches a digit.
    while ((charReader.hasNext() && charReader.lookAhead().match(digitRegExp)) || (charReader.hasNext() && charReader.lookAhead().match(dotRegExp) && !decimalPoint)) {
        // Checks if char is decimal point and registers that the number had a decimal point.
        if(charReader.lookAhead().match(dotRegExp)){
            decimalPoint = true;
        }
        // Add char to value string and move to next char.
        value += charReader.lookAhead();
        charReader.next();
        
    }

    // If number found return token, else return null.
    if (value != '' && value !='-') {

        // Parse the number string into a number value.
        const numberValue = parseFloat(value);

        // Return the token object with type number and the value.
        return { type: 'number', value: numberValue };
    }else{
        return null;
    }
    
}

// This function receives a caracter reader, and returns a token string or null if a string is not found.
function checkIfStringToken(charReader) {
    // Regular expression value for backslash.
    const backslashRegExp = /\\/;
    let value = '';
    // Flag to keep track if a quotation mark has been opened.
    let openQMark = false;
    
    // Keep reading while there is a char next.
    while (charReader.hasNext()) {
        const isQmark = (charReader.lookAhead() == "'");
        // If its the first char and its a quotation mark set openQMark to true and move to the next character.
        if (!openQMark && isQmark) {
            openQMark = true;
            charReader.next();
        }else{
            // Check if quotation mark is open, if not break the cycle.
            if(openQMark){
                // If escape character '\' found so skip the character, as therer is no other condions after this if the value is saved as a normal char avoiding it counting as a closing quotation mark.
                if (charReader.lookAhead().match(backslashRegExp)) {
                    charReader.next();
                }else{
                    // If quotation mark is open and we found another quotation mark then its end of string, so move the reader and break the cycle.
                    if (openQMark && isQmark) {
                        charReader.next();
                        break;
                    }
                }
            }else{
                break;
            }
        }

        // Add the character to value, move to next character.
        value += charReader.lookAhead();
        charReader.next();
    }

    // If string found return token, else return null.
    if (value != '') {
        return { type: 'string', value: value };
    }else{
        return null;
    }
}

// This function receives a caracter reader, and returns a token operator or null if a operator is not found.
function checkIfOperatorToken(charReader){
    if (charReader.lookAhead(3) == 'and'){
        charReader.next(3);
        return { type: 'operator', value: '&&'  };
    }
    // Checks if next 2 characters are one of these operators: (&&)(||)(==)(!=)(<=)(>=).
    switch(charReader.lookAhead(2)) {
        case 'or':
            charReader.next(2);
            return { type: 'operator', value: '||' };
        case '&&':
            charReader.next(2);
            return { type: 'operator', value: '&&'  };
        case '||':
            charReader.next(2);
            return { type: 'operator', value: '||' };
        case '==':
            charReader.next(2);
            return { type: 'operator', value: '==' };
        case '!=':
            charReader.next(2);
            return { type: 'operator', value: '!=' };
        case '<=':
            charReader.next(2);
            return { type: 'operator', value: '<=' };
        case '>=':
            charReader.next(2);
            return { type: 'operator', value: '>='  };
        default:
            break
        }
    // Check if next char is one of these operators: (+)(-)(*)(/)(=)(!)(<)(>).
    switch(charReader.lookAhead()) {
        case '+':
            charReader.next();
            return { type: 'operator', value: '+' };
        case '-':
            charReader.next();
            return { type: 'operator', value: '-' };
        case '*':
            charReader.next();
            return { type: 'operator', value: '*' };
        case '/':
            charReader.next();
            return { type: 'operator', value: '/'  };
        case '=':
            charReader.next();
            return { type: 'operator', value: '='  };
        case '!':
            charReader.next();
            return { type: 'operator', value: '!' };
        case '<':
            charReader.next();
            return { type: 'operator', value: '<' };
        case '>':
            charReader.next();
            return { type: 'operator', value: '>' };
        default:
            return null;
        }
}

// This function receives a caracter reader, and returns a token name or null if a name is not found.
function checkIfNameToken(charReader){
    // Regular expressions for head and body of a name (starts with letters and after can have letters and numbers).
    const headNameRegExp = /[a-zA-Z]/;
    const bodyNameRegExp = /[a-zA-Z0-9_]/;
    const plusPlusRegExp = /\+\+/;
    const minusMinusRegExp = /\-\-/;
    const SBOpenRegExp = /\[/;
    const number = /[0-9]/;
    const SBCloseRegExp = /\]/;
    let value = '';

    // Check if char matches name begining,if it does return name token, if it doesnt return null.
    if (charReader.lookAhead().match(headNameRegExp)) {
        value = charReader.lookAhead();
        charReader.next();

        // While there is a next character and that character matches the body of a name keep adding the character to value and moving to the next character.
        while (charReader.hasNext() && charReader.lookAhead().match(bodyNameRegExp)) {
            value += charReader.lookAhead();
            charReader.next();
        }

        if (charReader.lookAhead(2).match(plusPlusRegExp)) {
            charReader.next(2);
            return { type: 'incrementer', value: value };
        }else if (charReader.lookAhead(2).match(minusMinusRegExp)) {
            charReader.next(2);
            return { type: 'decrementer', value: value };
        }


        if (charReader.lookAhead().match(SBOpenRegExp)) {
            charReader.next();

            index = ''
            while (charReader.hasNext() && charReader.lookAhead().match(number)) {
                index += charReader.lookAhead();
                charReader.next();
            }
            
            if (charReader.lookAhead().match(SBCloseRegExp) && index.length > 0) {
                charReader.next();
                return { type: 'array', name: value, index: index };
            }
        }
        
        // Return the token object with type name and the value.
        return { type: 'name', value: value };
    }else{
        return null;
    }
}

// This function receives a caracter reader, and returns a token keyword or null if a keyword is not found. Fun fact: Keywords are case insensitive meaning for, For, FOR will all work.
function checkIfKeywordToken(charReader){
    // Checks 3 chars ahead but only moves 2 to preserve the other chars like ()[]{} to be read on the next round.
    if (charReader.lookAhead(3).match(/^if[\s\(]$/i)) {
        charReader.next(2);
        return { type: 'keyword', value: 'if' };
    }
    if (charReader.lookAhead(5).match(/^else[\s\{]$/i)) {
        charReader.next(4);
        return { type: 'keyword', value: 'else' };
    }
    if (charReader.lookAhead(8).match(/^foreach[\s\(]$/i)) {
        charReader.next(7);
        return { type: 'keyword', value: 'foreach' };
    }
    if (charReader.lookAhead(4).match(/^for[\s\(]$/i)) {
        charReader.next(3);
        return { type: 'keyword', value: 'for' };
    }
    
    if (charReader.lookAhead(4).match(/^ in $/i)) {
        charReader.next(3);
        return { type: 'keyword', value: 'in' };
    }
    if (charReader.lookAhead(6).match(/^while[\s\(]$/i)) {
        charReader.next(5);
        return { type: 'keyword', value: 'while' };
    }
    if (charReader.lookAhead(7).match(/^return $/i)) {
        charReader.next(6);
        return { type: 'keyword', value: 'return' };
    }
    if (charReader.lookAhead(6).match(/^break;$/i)) {
        charReader.next(5);
        return { type: 'keyword', value: 'break' };
    }
    if (charReader.lookAhead(9).match(/^continue;$/i)) {
        charReader.next(8);
        return { type: 'keyword', value: 'continue' };
    }
    if (charReader.lookAhead(5).match(/^true[\s\;\)]$/i)) {
        charReader.next(4);
        return { type: 'keyword', value: 'true' };
    }
    if (charReader.lookAhead(6).match(/^false[\s\;\)]$/i)) {
        charReader.next(5);
        return { type: 'keyword', value: 'false' };
    }
    
    return null;
}

// This function receives a caracter reader, and returns a token symbol or null if a symbol is not found.
function checkIfSymbolsToken(charReader){
    // Checks if next char is one of these symbols: ()[]{};,
    switch(charReader.lookAhead()) {
        case '(':
            charReader.next();
            return { type: 'parenOpen', value: '(' };
        case ')':
            charReader.next();
            return { type: 'parenClose', value: ')' };
        case '[':
            charReader.next();
            return { type: 'squareBracketOpen', value: '[' };
        case ']':
            charReader.next();
            return { type: 'squareBracketClose', value: ']' };
        case '{':
            charReader.next();
            return { type: 'curlyBracketOpen', value: '{'  };
        case '}':
            charReader.next();
            return { type: 'curlyBracketClose', value: '}'  };
        case ';':
            charReader.next();
            return { type: 'endOfLine', value: ';' };
        case ',':
            charReader.next();
            return { type: 'comma', value: ',' };
        default:
            return null;
        }
}

// This function receives a caracter reader, and returns a token empyspace or null if a empyspace is not found.
function checkIfEmptySpaceToken(charReader){
    // Regular expression value for empty space.
    const emptyspaceRegExp = /[\t\r\n ]/;
    let value = '';

    // Keep reading if there are more characters after and they are emptyspace.
    while (charReader.hasNext() && charReader.lookAhead().match(emptyspaceRegExp)) {
        // Add char to value string and move to next char.
        value += charReader.lookAhead();
        charReader.next();
    }

    // If emptyspaces found return token, else return null.
    if (value != '') {
        return { type: 'emptyspace', value: value };
    }else{
        return null;
    }
}

// This function receives a caracter reader, and returns a token comment or null if a comment is not found.
function checkIfCommentToken(charReader){
    const headCommentRegExp = /#/;
    const bodyCommentRegExp = /[\w\[\]`!@#$%\^&\\*()={}:;<> +'-]/;
    const feetCommentRegExp = /\n/;
    let value = '';

    // Check if first char matches #, if not return null.
    if (charReader.lookAhead().match(headCommentRegExp)) {
        value = charReader.lookAhead();
        charReader.next();

        // While there are next characters and they match the comment body or feet keep adding them to value.
        while (charReader.hasNext() && (charReader.lookAhead().match(bodyCommentRegExp) || charReader.lookAhead().match(feetCommentRegExp))) {
            // If char matches end of comment (\n) add it to value and break from the cycle. 
            if(charReader.lookAhead().match(feetCommentRegExp)){
                value += charReader.lookAhead();
                charReader.next();
                break;
            }
            value += charReader.lookAhead();
            charReader.next();
        }

        // Return comment token found.
        return { type: 'comment', value: value };
    }else{
        return null;
    }
}

// This function receives a token, and returns false if the token type is comment or emptyspace.
function cleanTokensHelper(token) {
    return (token.type !== 'comment' && token.type !== 'emptyspace');
}

// This function receives a string of code, and returns a list of tokens.
function lexer(code) {
    // Create character reader for our code.
    const charReader = new CharReader(code);
    var tokenList = [];

    // While there is a next character keep going.
    while (charReader.hasNext()) {
        let lineNumber = charReader.getLineNumber();
        let characterNumberInLine = charReader.getCharacterNumberInLine();
        let token = null;

        // Try every token checker untill one returns a token.
        for (let tokenChecker of [checkIfCommentToken, checkIfNumberToken, checkIfStringToken, checkIfOperatorToken, checkIfKeywordToken, checkIfNameToken, checkIfSymbolsToken, checkIfEmptySpaceToken]) {
            token = tokenChecker(charReader);

            // If token found add it to the tokenList and break from the cycle.
            if (token != null) {
                tokenList.push({...token, lineNumber: lineNumber, characterNumberInLine: characterNumberInLine});
                break;
            }
        }

        // If no token was found there is somethign wrong so throw a error explaining the problem. 
        if (token == null) {
            throw new Error(`Lexixal error at line ${lineNumber}:${characterNumberInLine} character '${charReader.lookAhead()}' is not recognized`);
        }
        
    }
    
    // Remove unnecessary tokens such as comments and empty spaces.  
    tokenList = tokenList.filter(cleanTokensHelper);

    return tokenList;
};

module.exports = lexer;
