"use strict";


document.getElementById("formid").addEventListener("submit", enterValidation)
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

function enterValidation(event){
    event.preventDefault()
    
    if(formValidation()){
        let password = document.form.password.value;
        let email = document.form.email.value;

        let data = {
            "user_name": email,
            "password": password
        }

        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == XMLHttpRequest.DONE){
                let json_response = JSON.parse(xhttp.responseText)
                if(json_response != "operation failed"){
                    localStorage.removeItem("token")
                    localStorage.setItem("token", json_response.token)
                    
                    console.log(localStorage.token)
                    renderModal(true, "خوش آمدید")

                    setTimeout(() => {
                        let url = "http://127.0.0.1:8000/main"
                        window.location.href = url
                    }, 1000);
                }
                else {
                    renderModal(false, "نام کاربری یا رمز عبور معتبر نیست")
                }
            }
        }

        xhttp.open("POST", "http://127.0.0.1:8000/login", true)
        xhttp.setRequestHeader('Content-Type', 'application/json')
        xhttp.send(JSON.stringify(data))
    }
    else{
        renderModal(false, "همه فیلد‌های فرم الزامی هستند. نام کاربری و رمزعبور باید محدودیت‌ها را ارضا کنند.")
    }
}

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
        document.getElementById("email").style.border = "1px solid green";
        document.getElementById("email").style.outline = "none"; 
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

function focusout(event){
    event.target.style.border = "none";
}

document.getElementById("pass").addEventListener("input", passValidation)
document.getElementById("pass").addEventListener("focusout", focusout)

function passValidation(){
    let password = document.form.password.value;
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
        document.querySelector(".enterform__password").classList.remove("enterform__email--errorexist")
        document.getElementById("pass").style.border = "1px solid green";
        document.getElementById("pass").style.outline = "none"; 
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

document.getElementsByClassName("menu__item--type-products")[0].addEventListener('click', () => {
    // changin url to home page and navigate to product
    let url = "http://127.0.0.1:8000/main#container__contents"
    window.location.href = url
    document.getElementsByClassName("container__contents")[0].scrollIntoView()
})

document.getElementsByClassName("menu__item--type-main")[0].addEventListener('click', () => {
    let url = "http://127.0.0.1:8000/main"
    window.location.href = url
})

document.getElementsByClassName("login__button--loggedin-no")[0].addEventListener('click', () => {
    let url = "http://127.0.0.1:8000/enter"
    window.location.href = url
})

document.getElementById("exit").addEventListener('click', () => {
    localStorage.removeItem('token')
    
    let url = "http://127.0.0.1:8000/main"
    window.location.href = url
})

document.getElementById("profile").addEventListener('click', () => {
    let url = "http://127.0.0.1:8000/profile"
    window.location.href = url
})

document.getElementById("register__button").addEventListener('click', () => {
    let url = "http://127.0.0.1:8000/register-form"
    window.location.href = url
})

function athenticate(){
    let xhttp = new XMLHttpRequest()

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == XMLHttpRequest.DONE){
            let json_response = JSON.parse(xhttp.responseText)
            if (json_response.detail){
                if (json_response.detail == 'Invalid token.'){
                    console.log('Invalid token')
                }
            }
            else {
                show_name(json_response.first_name)
            }
        }
    }

    xhttp.open("GET", "http://127.0.0.1:8000/user-info", true)
    xhttp.setRequestHeader("Authorization", "Token "+ localStorage.getItem('token'))
    xhttp.send()
}

function show_name(name){
    let button = document.getElementsByClassName('login__button')[1]
    button.innerHTML = name
    let arrow = document.createElement('i')
    arrow.className = 'arrow down'
    button.appendChild(arrow)

    document.getElementsByClassName("login__button--loggedin-no")[0].style.display = "none"
    document.getElementsByClassName("login__button--loggedin-yes")[0].style.display = "block"
}

athenticate()