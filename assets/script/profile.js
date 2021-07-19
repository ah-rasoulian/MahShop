"use strict";


document.getElementById("formid").addEventListener("submit", editValidation)
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
    if (status){
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

function editValidation(event){
    event.preventDefault()

    let message = ""
    let succeed = false
    
    if(formValidation()){
        let data = {
            "user_name": document.getElementById("email").value,
            "password": document.getElementById("pass").value.trim(),
            "first_name": document.getElementById("fname").value.trim(),
            "last_name": document.getElementById("lname").value.trim(),
            "address": document.getElementById("addr").value
        }

        let xhttp = new XMLHttpRequest();
        xhttp.onload = function(){
            if(this.responseText != "you don't have permission"){
                json_response = JSON.parse(this.responseText)
                succeed = true
                message = "تغییرات با موفقیت انجام شدند."
            }
        }

        xhttp.open("POST", "http://127.0.0.1/register", true)
        xhttp.setRequestHeader('Content-Type', 'application/json')
        xhttp.send(JSON.stringify(data))
    }
    else{
        message = "همه فیلد‌های فرم الزامی هستند. رمزعبور باید محدودیت‌ها را ارضا کند."
    }

    renderModal(succeed, message)
}

function formValidation(){
    let password = document.getElementById("pass").value
    let first_name = document.getElementById("fname").value.trim()
    let last_name = document.getElementById("lname").value.trim()
    let address = document.getElementById("addr").value

    //all fields are required
    if((!requiredInput(password)) || (!requiredInput(first_name)) || (!requiredInput(last_name)) || (!requiredInput(address))){
        console.log("required input are missing")
        return false
    }

    //checking password format
    if(!passwordFormat(password)){
        console.log("password is wrong")
        return false
    }

    //checking max length
    if((!maxLength(password, 255)), (!maxLength(address, 1000)), (!maxLength(first_name, 255)), (!maxLength(last_name, 255))){
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

function focusout(event){
    event.target.style.border = "none";
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
    if(!maxLength(password, 255)){
        there_is_error = true
        error_messaegs.push("- طول رمز بزرگتر از حد مجاز است.")
    }

    if(!there_is_error){
        document.getElementById("error__display").style.display = "none"
        document.querySelector(".form__password").classList.remove("enterform__email--errorexist")
        document.querySelector("#pass:focus").style.border = "1px solid green";
        document.querySelector("#pass").style.outline = "none"; 
        let div = document.querySelector(".enterform__passerror")
        div.innerHTML = ""       
        return true
    }

    document.getElementById("error__display").style.display = "block"
    document.querySelector(".form__password").classList.add("enterform__email--errorexist")
    document.querySelector("#pass").style.border = "1px solid red";
    document.querySelector("#pass").style.outline = "none";
    
    let div = document.querySelector(".enterform__passerror")
    div.innerHTML = ""
    for(let i=0 ; i<error_messaegs.length ; i++){
        div.innerHTML += "<p>" + error_messaegs[i] + "</p>"
    }
    return false;
}

document.getElementsByClassName("info__profile")[0].addEventListener('click', () => {
    document.getElementsByClassName("content")[0].style.display = "none"
    document.getElementsByClassName("receipt__page")[0].style.display = "block"
})

document.getElementsByClassName("info__receipts")[1].addEventListener('click', () => {
    document.getElementsByClassName("receipt__page")[0].style.display = "none"
    document.getElementsByClassName("content")[0].style.display = "block"
})

document.getElementsByClassName("menu__item--type-products")[0].addEventListener('click', () => {
    // changin url to home page and navigate to product
    let url = ""
    window.location.href = url

    document.getElementsByClassName("container__contents")[0].scrollIntoView()
})

document.getElementsByClassName("menu__item--type-main")[0].addEventListener('click', () => {
    let url = ""
    window.location.href = url
})