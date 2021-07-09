"use strict";


function formValidation(){
    let password = document.form.password.value;
    let email = document.form.email.value;

    //all fields are required
    if((!requiredInput(password)) || (!requiredInput(email))){
        console.log("required input are missing")
        return false
    }

    //checking email format
    if(!emailFormat(email)){
        console.log("email is not well-formatted")
        return false
    }

    //checking password format
    if(!passwordFormat(password)){
        console.log("password is wrong")
        return false
    }

    //checking max length
    if((!maxLength(email, 255)), (!maxLength(password, 255))){
        console.log("maxlength is wrong")
        return false
    }

    return true;
}

function requiredInput(input){
    if(input==""){
        return false;
    }
    return true;
}

function emailFormat(email){
    var atposition= email.indexOf("@");  
    var dotposition=email.lastIndexOf(".");  
    if (atposition<1 || dotposition<atposition+2 || dotposition+2>=email.length){ 
        return false;
    }
    return true;
}

function passwordFormat(password){

    console.log(password)
    console.log(typeof(password))
    let length = password.length
    const pattern1 = /[a-zA-Z]/
    const pattern2 = /[0-9]/
    if(length<8 || (!pattern1.test(password)) || (!pattern2.test(password)) ){
        return false
    }
    return true;
}


function containLetter(password){
    const pattern1 = /[a-zA-Z]/
    return pattern1.test(password)
}

function containNumber(password){
    const pattern2 = /[0-9]/
    return pattern2.test(password)
}


function maxLength(input, max){

    if(input.length > max){
        return false
    }
    return true
}


document.querySelector("input#email").addEventListener("input", emailValidation)
document.querySelector("input#email").addEventListener("focusout", emailfocusout)

function emailValidation(){
    console.log('hello')
    let email = document.form.email.value;
    let error_messaegs = []
    let there_is_error = false

    if(!emailFormat(email)){
        there_is_error = true
        error_messaegs.push("- فرمت ایمیل نادرست است.")
    }
    if(!maxLength(email, 255)){
        there_is_error = true
        error_messaegs.push("- طول ایمیل بزرگتر از حد مجاز است.")
    }

    if(!there_is_error){
        document.querySelector(".enterform__email").classList.remove("enterform__email--errorexist")
        document.querySelector("#email:focus").style.border = "1px solid green";
        document.querySelector("#email").style.outline = "none"; 
        let div = document.querySelector(".enterform__emailerror")
        div.innerHTML = ""       
        return true
    }

    document.querySelector(".enterform__email").classList.add("enterform__email--errorexist")
    document.querySelector("#email").style.border = "1px solid red";
    document.querySelector("#email").style.outline = "none";

    
    let div = document.querySelector(".enterform__emailerror")
    div.innerHTML = ""
    for(let i=0 ; i<error_messaegs.length ; i++){
        div.innerHTML += "<p>" + error_messaegs[i] + "</p>"
    }


    return false;
}

function emailfocusout(){
    document.querySelector("#email").style.border = "none";
}

document.querySelector("input#pass").addEventListener("input", emailValidation)
document.querySelector("input#pass").addEventListener("focusout", passfocusout)

function emailValidation(){
    console.log('hello')
    let password = document.form.password.value;
    let error_messaegs = []
    let there_is_error = false

    if(!passwordFormat(password)){
        there_is_error = true
        if(password.length < 8){
            error_messaegs.push("- رمز باید حداقل ۸ کاراکتر باشد")
        }
        if(containLetter(password)){
            error_messaegs.push("- رمز باید شامل حرف باشد")
        }
        if(containNumber(password)){
            error_messaegs.push("- رمز باید شامل عدد باشد")
        }
    }
    if(!maxLength(email, 255)){
        there_is_error = true
        error_messaegs.push("- طول ایمیل بزرگتر از حد مجاز است.")
    }

    if(!there_is_error){
        document.querySelector(".enterform__password").classList.remove("enterform__email--errorexist")
        document.querySelector("#pass:focus").style.border = "1px solid green";
        document.querySelector("#pass").style.outline = "none"; 
        let div = document.querySelector(".enterform__passerror")
        div.innerHTML = ""       
        return true
    }

    document.querySelector(".enterform__password").classList.add("enterform__email--errorexist")
    document.querySelector("#pass").style.border = "1px solid red";
    document.querySelector("#pass").style.outline = "none";
    
    let div = document.querySelector(".enterform__passerror")
    div.innerHTML = ""
    for(let i=0 ; i<error_messaegs.length ; i++){
        div.innerHTML += "<p>" + error_messaegs[i] + "</p>"
    }
    return false;
}

function passfocusout(){
    document.querySelector("#pass").style.border = "none";
}