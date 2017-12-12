//
let errorList = [];

class ValidationResult{
    constructor(success, validResultArray, invalidResultArray){
        this.success = success;
        this.invalidResultArray = invalidResultArray;
        this.validResultArray = validResultArray;
    }
}
class InvalidResult{
    constructor(field, errorDescriptions){
        this.field = field;
        this.errorDescriptions = errorDescriptions;
    }
}

function isEmpty(data){
    return !data.length;
}

function isWhiteSpace(str) {
    let ws = "\t\n\r ";
    for (let i = 0; i < str.length; i++) {
        let c = str.charAt(i);
        if (ws.indexOf(c) === -1) {
            return false;
        }
    }
    return true;
}

function checkString(data){
    let isNotEmpty = !(isEmpty(data.value));
    let isNotWhitespace = !(isWhiteSpace(data.value));
    let success = isNotEmpty && isNotWhitespace;
    let errorDescription = !success ? "Pole jest puste" : undefined;
    let valid = success ? [data] : [];
    let invalid = !success ? [new InvalidResult(data, errorDescription)] : [];
    return new ValidationResult(success, valid, invalid);
}

function markError(data, hasError){
    if(hasError){
        data.classList.add('err');
        data.parentNode.parentNode.classList.add('err');
        data.classList.remove('success');
        data.parentNode.parentNode.classList.remove('success');
    }
    if(!hasError){
        data.classList.remove('err');
        data.parentNode.parentNode.classList.remove('err');
        data.classList.add('success');
        data.parentNode.parentNode.classList.add('success');
    }
}

function storeResult(data, func){
    let result = func(data);
    for(let i = 0; i < result.validResultArray.length; i++){
        let item = result.validResultArray[i];
        markError(item, false)
        //remove error from list
        for(let j = 0; j < errorList.length; j++){
            if(errorList[j].field.name ===  item.name){
                errorList.splice(j,1);
            }
        }
    }
    for(let i = 0; i < result.invalidResultArray.length; i++){
        let item = result.invalidResultArray[i];
        markError(item.field, true);
        let found;
        for(let j = 0; j < errorList.length; j++) {
            //update error
            if(errorList[j].field.name === item.field.name){
                found = true;
                errorList[j] = item;
                break;
            }
        }
        //add error
        if(!found) errorList.push(item);
    }
    return result.success;
}

function checkRange(data, min, max){
    let success = data.value >= min && data.value <= max;
    let valid = success ? [data] : [];
    let invalid = !success ? [new InvalidResult(data, "Prawidłowy zakres: " + min + "-" + max)]: [];
    return new ValidationResult(success, valid, invalid);
}

function checkDay(data){
    return checkRange(data,1,31);
}
function checkMonth(data){
    return checkRange(data,1,12);
}
function checkYear(data){
    return checkRange(data,1900,2017);
}
function checkSamePassword(data){
    let element;
    switch(data.name){
        case 'f_password':
            element = document.querySelector('[name=' + 'f_password_repeat' + ']');
            break;
        case 'f_password_repeat':
            element = document.querySelector('[name=' + 'f_password' + ']');
            break;
    }

    let success = data.value === element.value;
    let valid = success ? [data, element] : [];
    let invalid = !success ? [
            new InvalidResult(data, "Hasło nie jest takie samo"),
            new InvalidResult(element, "Hasło nie jest takie samo")
        ] : [];
    return new ValidationResult(success, valid, invalid);
}

function hasNumber(myString) {
    return /\d/.test(myString);
}

function checkPassword(data) {
    let result = checkSamePassword(data);
    let valid;
    let invalid;
    //are password same?
    let success = result.success;
    if(success){
        let hasLengthBiggerThan8 = data.value.length >= 8;
        let fieldHasNumber = hasNumber(data.value);
        success = hasLengthBiggerThan8 && fieldHasNumber;
        if(success){
            valid = result.validResultArray;
            invalid = [];
        } else{
            let errorDescription = !hasLengthBiggerThan8
                ? "Hasło musi mieć przynajmniej 8 znaków!"
                :  !fieldHasNumber
                    ? "Hasło musi zawierać cyfrę!"
                    : undefined;
            valid = [];
            invalid = result.validResultArray.map((x) => {
                return new InvalidResult(x, errorDescription);
            });
        }
    } else{
        //passwords are not the same
        valid = [];
        invalid = result.invalidResultArray;
    }

    return new ValidationResult(success, valid, invalid);
}

function checkMaxLength(data){
    let success = data.value.length <= 100;
    let valid = success ? [data] : [];
    let invalid = !success ? [new InvalidResult(data, "Opis musi mieć najwyżej 100 znaków!")] : [];
    return new ValidationResult(success, valid, invalid);
}

function drawErrorList() {
    //find errorList <ul> element
    let element = document.getElementById('errorList');
    if(element) element.remove();
    //recreate <ul> element
    let errors = document.getElementById('errors');
    element = document.createElement('ul');
    element.setAttribute('id', 'errorList');
    errors.appendChild(element);

    for(let i = 0; i < errorList.length; i++){
        //create li with error description
        let li = document.createElement('li');
        let fieldText = errorList[i].field.parentNode.parentNode.firstChild.innerHTML;
        li.innerHTML = fieldText + " - " + errorList[i].errorDescriptions;
        //add to <ul>
        element.appendChild(li);
    }
}

function isFormIsValid(){
    //find all inputs
    let valid = true;
    let matches = document.querySelectorAll("input");
    for(let i = 0; i < matches.length; i++){

        let type = matches[i].getAttribute('type');
        if(type && type === 'submit') continue; // skip submit button
        validateField(matches[i]); //revalidate on submit
        let isSuccess = matches[i].classList.contains('success');
        if(!isSuccess) {
            valid = false; //form not valid if input not contain success class
        }
    }
    return valid;
}

function validateField(data){
    switch(data.name){
        case 'f_imie':
            storeResult(data, checkString);
            break;
        case 'f_nazwisko':
            storeResult(data, checkString);
            break;
        case 'f_birth_year':
            storeResult(data, checkYear);
            break;
        case 'f_birth_month':
            storeResult(data, checkMonth);
            break;
        case 'f_birth_day':
            storeResult(data, checkDay);
            break;
        case 'f_password':
            storeResult(data, checkPassword);
            break;
        case 'f_password_repeat':
            storeResult(data, checkPassword);
            break;
        case 'f_uwagi':
            storeResult(data, checkMaxLength);
            break;
    }

}

window.onload = () => {
    document.getElementById('form').onsubmit = () => {
        let result = isFormIsValid();
        drawErrorList();
        return result;
    };
};