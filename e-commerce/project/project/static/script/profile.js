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

let user_username;

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
    
    if(formValidation()){
        let data = {
            "user_name": user_username,
            "password": document.getElementById("pass").value.trim(),
            "first_name": document.getElementById("fname").value.trim(),
            "last_name": document.getElementById("lname").value.trim(),
            "address": document.getElementById("addr").value
        }

        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == XMLHttpRequest.DONE){
                let json_response = JSON.parse(xhttp.responseText)
                if(json_response == "edited succesfully"){
                    renderModal(true, "تغییرات با موفقیت اعمال شد.")

                    localStorage.removeItem('token')
                    let url = "http://127.0.0.1:8000/enter"
                    window.location.href = url
                }
                else {
                    renderModal(false, "شما مجاز به اعمال تغییرات نیستید.")
                }
            }
        }

        xhttp.open("POST", "http://127.0.0.1:8000/edit-info/".concat(user_username), true)
        xhttp.setRequestHeader('Content-Type', 'application/json')
        xhttp.setRequestHeader("Authorization", "Token "+ localStorage.getItem('token'))
        xhttp.send(JSON.stringify(data))
    }
    else{
        renderModal(false, "همه فیلد‌های فرم الزامی هستند. رمزعبور باید محدودیت‌ها را ارضا کند.")
    }
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
        document.getElementById("pass").classList.remove("enterform__email--errorexist")
        document.getElementById("pass").style.border = "1px solid green";
        document.getElementById("pass").style.outline = "none"; 
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

document.getElementsByClassName("info__profile")[1].addEventListener('click', () => {
    document.getElementsByClassName("receipt__page")[0].style.display = "none"
    document.getElementsByClassName("content")[0].style.display = "block"
})

document.getElementsByClassName("info__receipts")[0].addEventListener('click', () => {
    document.getElementsByClassName("content")[0].style.display = "none"
    document.getElementsByClassName("receipt__page")[0].style.display = "block"
    get_receipts()
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

class Receipt {
    constructor(tracing_code, stuff_name, price, address){
        this.tracing_code = tracing_code
        this.stuff_name = stuff_name
        this.price = price
        this.address = address
    }
}

let receipts = []
function get_receipts(){
    receipts = []
    let xhttp = new XMLHttpRequest()

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == XMLHttpRequest.DONE){
            let json_response = JSON.parse(xhttp.responseText)
            if(json_response.detail){
                if(json_response.detail == "Invalid token"){
                    console.log("Invalid token")
                }
                else {
                    console.log("Authentication credentials were not provided.")
                }
            }
            else {
                for(let i = 0; i < json_response.length; i ++){
                    let new_receipt = new Receipt(json_response[i].tracing_code, json_response[i].stuff_name,
                        json_response[i].price, json_response[i].address)
                    receipts.push(new_receipt)
                }
            }
            draw_receipts()
        }
    }

    xhttp.open("GET", "http://127.0.0.1:8000/receipts", true)
    xhttp.setRequestHeader("Authorization", "Token "+ localStorage.getItem('token'))
    xhttp.send()
}

function draw_receipts(){
    let receipt_container = document.getElementById("receipts")
    receipt_container.innerHTML = ""
    receipt_container.appendChild(create_reciept('کد پیگیری', 'نام کالا', 'قیمت', 'آدرس'))

    for(let i = 0; i < receipts.length; i ++){
        receipt_container.appendChild(create_reciept(receipts[i].tracing_code, receipts[i].stuff_name,
            receipts[i].price, receipts[i].address))
    }
}

function create_reciept(tracing_code, stuff_name, price, address){
    let receipt = document.createElement('div')
    receipt.className = "receipts__item receipts__grid--display-grid grid"

    let space = document.createElement('div')
    space.className = 'grid__item'
    receipt.appendChild(space)

    let r_address = document.createElement('div')
    r_address.className = 'receipts__item__field grid__item'
    r_address.innerHTML = address
    receipt.appendChild(r_address)

    let r_price = document.createElement('div')
    r_price.className = 'receipts__item__field grid__item'
    r_price.innerHTML = price
    receipt.appendChild(r_price)

    let r_name = document.createElement('div')
    r_name.className = 'receipts__item__field grid__item'
    r_name.innerHTML = stuff_name
    receipt.appendChild(r_name)

    let r_code = document.createElement('div')
    r_code.className = 'receipts__item__field grid__item'
    r_code.innerHTML = tracing_code
    receipt.appendChild(r_code)

    let space2 = document.createElement('div')
    space2.className = 'grid__item'
    receipt.appendChild(space2)

    return receipt
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
                user_username = json_response.user_name
                show_info(json_response.first_name, json_response.last_name, json_response.address)
            }
        }
    }

    xhttp.open("GET", "http://127.0.0.1:8000/user-info", true)
    xhttp.setRequestHeader("Authorization", "Token "+ localStorage.getItem('token'))
    xhttp.send()
}

function show_info(name, last_name, address){
    let button = document.getElementsByClassName('login__button')[1]
    button.innerHTML = name
    let arrow = document.createElement('i')
    arrow.className = 'arrow down'
    button.appendChild(arrow)

    document.getElementsByClassName("login__button--loggedin-no")[0].style.display = "none"
    document.getElementsByClassName("login__button--loggedin-yes")[0].style.display = "block"

    document.getElementById('fname').placeholder = name
    document.getElementById('lname').placeholder = last_name
    document.getElementById('addr').placeholder = address
}

athenticate()