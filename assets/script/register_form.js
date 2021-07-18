"use strict";


document.getElementById("formid").addEventListener("submit", registerValidation)
let users = [
    {
        "email": "ahr96@aut.ac.ir",
        "pass": "a1234567"
    },
    {
        "email": "ah.rasoulian@gmail.com",
        "pass": "r1234567"
    }
]

function removeModal(){
    // find the modal and remove if it exists
    let modal = document.querySelector('.modal')
    if (modal) {
      modal.remove()
    }
}

function renderModal(status, message){
    let status_message = ""
    if (status == 1){
        status_message = "موفق"
    }
    else {
        status_message = "ناموفق"
    }

    // create the background modal div
    let modal = document.createElement('div')
    modal.classList.add('modal')

    // create the inner modal div with appended argument
    let modal_content = document.createElement('div')
    modal_content.classList.add('modal__content')

    let exit_button = document.createElement('button')
    exit_button.classList.add("modal_content--type-exit")
    exit_button.addEventListener('click', removeModal)
    exit_button.innerHTML = "X"
    modal_content.appendChild(exit_button)

    let header = document.createElement('h1')
    header.classList.add('modal__content--type-header')
    header.innerHTML = status_message
    modal_content.appendChild(header)

    let content = document.createElement('p')
    content.classList.add('modal__content--type-content')
    content.innerHTML = message
    modal_content.appendChild(content)

    // render the modal with child on DOM
    modal.appendChild(modal_content)
    document.body.appendChild(modal)

    modal.addEventListener('click', event => {
        if (event.target.className === 'modal') {
          removeModal()
        }
    })
}

function registerValidation(event){
    event.preventDefault()

    let message = ""
    let is_available = 0
    
    if(formValidation()){
        is_available = 1
        let email = document.getElementById("email").value

        for(let i = 0; i < users.length; i++){
            if(users[i].email == email){
                is_available = 2
                break
            }
        }

        if (is_available == 1){
            message = "خوش آمدید"
        }
        else {
            message = "نام کاربری تکراری است."
        }
    }
    else{
        message = "همه فیلد‌های فرم الزامی هستند. نام کاربری و رمزعبور باید محدودیت‌ها را ارضا کنند."
    }

    renderModal(is_available, message)
}

function formValidation(){
    let password = document.getElementById("pass").value
    let email = document.getElementById("email").value.trim()
    let first_name = document.getElementById("fname").value.trim()
    let last_name = document.getElementById("lname").value.trim()
    let address = document.getElementById("addr").value

    //all fields are required
    if((!requiredInput(password)) || (!requiredInput(email)) || (!requiredInput(first_name)) || (!requiredInput(last_name)) || (!requiredInput(address))){
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
    if((!maxLength(email, 255)), (!maxLength(password, 255)), (!maxLength(address, 1000))){
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
    const pattern = /\S+@\S+\.\S+/
    return pattern.test(email)
}

function passwordFormat(password){
    let length = password.length
    if(length<8 || (!containLetter(password)) || (!containNumber(password)) ){
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


document.getElementById("email").addEventListener("input", emailValidation)
document.getElementById("email").addEventListener("focusout", focusout)

function emailValidation(){
    let email = document.getElementById("email").value.trim()
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
        document.getElementById("error__display").style.display = "none"
        document.querySelector(".registerform__element__email").classList.remove("enterform__email--errorexist")
        document.querySelector("#email:focus").style.border = "1px solid green";
        document.querySelector("#email").style.outline = "none"; 
        let div = document.querySelector(".enterform__emailerror")
        div.innerHTML = ""       
        return true
    }

    document.getElementById("error__display").style.display = "flex"
    document.querySelector(".registerform__element__email").classList.add("enterform__email--errorexist")
    document.querySelector("#email").style.border = "1px solid red";
    document.querySelector("#email").style.outline = "none";

    let div = document.querySelector(".enterform__emailerror")
    div.innerHTML = ""
    for(let i=0 ; i<error_messaegs.length ; i++){
        div.innerHTML += "<p>" + error_messaegs[i] + "</p>"
    }

    return false;
}

function focusout(event){
    event.target.style.border = "none";
    document.getElementsByClassName("enterform__emailerror")[0].innerHTML = ""
    document.getElementsByClassName("enterform__passerror")[0].innerHTML = ""
    document.getElementById("error__display").style.display = "none"
}

document.getElementById("pass").addEventListener("input", passValidation)
document.getElementById("pass").addEventListener("focusout", focusout)

function passValidation(){
    let password = document.getElementById("pass").value
    let error_messaegs = []
    let there_is_error = false

    if(!passwordFormat(password)){
        there_is_error = true
        if(password.length < 8){
            error_messaegs.push("- رمز باید حداقل ۸ کاراکتر باشد")
        }
        if(!containLetter(password)){
            error_messaegs.push("- رمز باید شامل حرف باشد")
        }
        if(!containNumber(password)){
            error_messaegs.push("- رمز باید شامل عدد باشد")
        }
    }
    if(!maxLength(email, 255)){
        there_is_error = true
        error_messaegs.push("- طول ایمیل بزرگتر از حد مجاز است.")
    }

    if(!there_is_error){
        document.getElementById("error__display").style.display = "none"
        document.querySelector(".registerform__element__password").classList.remove("enterform__email--errorexist")
        document.querySelector("#pass:focus").style.border = "1px solid green";
        document.querySelector("#pass").style.outline = "none"; 
        let div = document.querySelector(".enterform__passerror")
        div.innerHTML = ""       
        return true
    }

    document.getElementById("error__display").style.display = "flex"
    document.querySelector(".registerform__element__password").classList.add("enterform__email--errorexist")
    document.querySelector("#pass").style.border = "1px solid red";
    document.querySelector("#pass").style.outline = "none";
    
    let div = document.querySelector(".enterform__passerror")
    div.innerHTML = ""
    for(let i=0 ; i<error_messaegs.length ; i++){
        div.innerHTML += "<p>" + error_messaegs[i] + "</p>"
    }
    return false;
}
