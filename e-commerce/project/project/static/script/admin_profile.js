"use strict";


// document.getElementById("formid").addEventListener("submit", editValidation)

document.getElementsByClassName("receipt__page")[0].style.display = "none"
document.getElementsByClassName("category_page")[0].style.display = "none"
document.getElementsByClassName("content")[0].style.display = "block"       

document.getElementsByClassName("info__receipts")[0].addEventListener('click', () => {
    document.getElementsByClassName("content")[0].style.display = "none"
    document.getElementsByClassName("category_page")[0].style.display = "none"
    document.getElementsByClassName("receipt__page")[0].style.display = "block"
    get_receipts()
})

document.getElementsByClassName("info__receipts")[2].addEventListener('click', () => {
    document.getElementsByClassName("content")[0].style.display = "none"
    document.getElementsByClassName("category_page")[0].style.display = "none"
    document.getElementsByClassName("receipt__page")[0].style.display = "block"
    get_receipts()
})

document.getElementsByClassName("info__profile")[1].addEventListener('click', () => {

    document.getElementsByClassName("receipt__page")[0].style.display = "none"
    document.getElementsByClassName("category_page")[0].style.display = "none"
    document.getElementsByClassName("content")[0].style.display = "block"
})

document.getElementsByClassName("info__profile")[2].addEventListener('click', () => {

    document.getElementsByClassName("receipt__page")[0].style.display = "none"
    document.getElementsByClassName("category_page")[0].style.display = "none"
    document.getElementsByClassName("content")[0].style.display = "block"
})

document.getElementsByClassName("info__category")[0].addEventListener('click', () => {
    console.log("hello")
    document.getElementsByClassName("content")[0].style.display = "none"
    document.getElementsByClassName("receipt__page")[0].style.display = "none"
    document.getElementsByClassName("category_page")[0].style.display = "block"
    get_receipts()
})

document.getElementsByClassName("info__category")[1].addEventListener('click', () => {
    console.log("hello")
    document.getElementsByClassName("content")[0].style.display = "none"
    document.getElementsByClassName("receipt__page")[0].style.display = "none"
    document.getElementsByClassName("category_page")[0].style.display = "block"
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
        this.first_name = this.first_name
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
                        json_response[i].price, json_response[i].address, json_response[i].first_name)
                    receipts.push(new_receipt)
                }
            }
            draw_receipts()
        }
    }

    xhttp.open("GET", "http://127.0.0.1:8000/receipts", true)
    xhttp.setRequestHeader("Authorization", "Token " + localStorage.getItem('token'))
    xhttp.send()
}

function draw_receipts(){
    let receipt_container = document.getElementById("receipts")
    receipt_container.innerHTML = ""
    receipt_container.appendChild(create_reciept('کد پیگیری', 'نام کالا', 'قیمت', 'آدرس', 'نام خریدار'))

    for(let i = 0; i < receipts.length; i ++){
        receipt_container.appendChild(create_reciept(receipts[i].tracing_code, receipts[i].stuff_name,
            receipts[i].price, receipts[i].address, receipts[i].first_name))
    }
}


function create_reciept(tracing_code, stuff_name, price, address, first_name){
    let receipt = document.createElement('div')
    receipt.className = "receipts__item receipts__grid--display-grid grid"

    let space = document.createElement('div')
    space.className = 'grid__item'
    receipt.appendChild(space)

    let r_address = document.createElement('div')
    r_address.className = 'receipts__item__field grid__item'
    r_address.innerHTML = address
    receipt.appendChild(r_address)

    let r_first_name = document.createElement('div')
    r_first_name.className = 'receipts__item__field grid__item'
    r_first_name.innerHTML = first_name
    receipt.appendChild(r_first_name)

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





function create_product(img_src, product_name, product_class, product_price) {
    let product = document.createElement("div")
    product.className = "container__box product"

    let p_img = document.createElement("img")
    p_img.className = "product__pic"
    p_img.src = img_src
    product.appendChild(p_img)

    let name_container = document.createElement("div")
    name_container.className = "product__name"
    product.appendChild(name_container)

    let p_name = document.createElement("h2")
    p_name.innerHTML = product_name
    name_container.appendChild(p_name)

    let p_class = document.createElement("h3")
    p_class.innerHTML = product_class
    name_container.appendChild(p_class)

    let price_container = document.createElement("div")
    price_container.className = "product__price"
    product.appendChild(price_container)

    let p_price = document.createElement("p")
    p_price.innerHTML = product_price + " تومان"
    price_container.appendChild(p_price)

    let p_button = document.createElement("button")
    p_button.className = "button--size-small"
    p_button.innerHTML = "خرید محصول"
    price_container.appendChild(p_button)
    
    return product
}

let img_src = "http://127.0.0.1:8000/static/img/product.png"
let product_container = document.getElementsByClassName("container__content")[0]
product_container.appendChild(create_product(img_src, "kala", "category", 30))
product_container.appendChild(create_product(img_src, "kala", "category", 30))
product_container.appendChild(create_product(img_src, "kala", "category", 30))
product_container.appendChild(create_product(img_src, "kala", "category", 30))
product_container.appendChild(create_product(img_src, "kala", "category", 30))

console.log("dfsdjk")


