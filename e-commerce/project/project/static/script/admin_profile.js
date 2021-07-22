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
    document.getElementsByClassName("content")[0].style.display = "none"
    document.getElementsByClassName("receipt__page")[0].style.display = "none"
    document.getElementsByClassName("category_page")[0].style.display = "block"
    get_receipts()
})

document.getElementsByClassName("info__category")[1].addEventListener('click', () => {
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
    constructor(tracing_code, stuff_name, price, address, first_name){
        this.tracing_code = tracing_code
        this.stuff_name = stuff_name
        this.price = price
        this.address = address
        this.first_name = first_name
    }
}

let receipts = []
let categories = []
let is_authenticated = false;
let user_username;
let page_number = 1;

function get_categories(){
    categories = []
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == XMLHttpRequest.DONE){
            let json_response = JSON.parse(xhttp.responseText)
            if(json_response.detail){
                if(json_response.detail == "Invalid token"){
                    console.log("invalid token")
                }
                else {
                    console.log("Authentication credentials were not provided.")
                }
            }
            else {
                for(let i = 0; i < json_response.length; i++){
                    categories.push(json_response[i].category_name)
                }
            }
        }
        get_products()
        draw_categories()
    }

    xhttp.open("GET", "http://127.0.0.1:8000/get-cat", true)
    xhttp.send()
}

function draw_categories(){
    let container = document.getElementById("categories")
    container.innerHTML = ""

    let header = document.createElement("h2")
    header.className = "category__item categories___grid--display-grid"
    let header_name = document.createElement('span')
    header_name.innerHTML = "نام دسته بندی"

    let header_action = document.createElement('span')
    header_action.innerHTML = "عملیات"
    header_action.className = "postion_left"
    
    header.appendChild(header_name)
    header.appendChild(header_action)
    container.appendChild(header)

    for(let i = 0; i < categories.length; i++){
        let item = document.createElement('div')
        item.className = "category__item categories___grid--display-grid"

        let delete_button = document.createElement('span')
        delete_button.innerHTML = "حذف دسته بندی"
        delete_button.className = "menu__item"
        delete_button.name = categories[i]
        delete_button.addEventListener('click', delete_category)
        item.appendChild(delete_button)

        let edit_button = document.createElement('span')
        edit_button.innerHTML = "ویرایش دسته بندی"
        edit_button.className = "menu__item"
        edit_button.name = categories[i]
        edit_button.addEventListener('click', edit_category_handler)
        item.appendChild(edit_button)

        let class_name = document.createElement('span')
        class_name.className = "position_right"
        class_name.innerHTML = categories[i]

        item.appendChild(class_name)
        container.appendChild(item)
    }
}

function edit_category_handler(event){
    if (is_authenticated){
        renderModal_edit_category(1, event.target.name)
    }
    else {
        renderModal_edit_category(2, event.target.name)
    }
}
let original_category_name;

function renderModal_edit_category(status, p_name){
    let status_message;
    if (status == 1){
        status_message = "تغییر دسته بندی"
    }
    else if (status == 2){
        status_message = "ابتدا وارد شوید"
    }
    else {
        status_message = p_name
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
    
    if (status == 1){
        let content_container = document.createElement('div')
        content_container.classList.add('modal__content--type-content')
        modal_content.appendChild(content_container)

        let new_name_container = document.createElement('div')
        new_name_container.classList.add('number--to-buy')

        let new_name = document.createElement('input')
        new_name.id = "new_category_name"
        new_name.type = "text"

        let new_name_label = document.createElement('p')
        new_name_label.innerHTML = "نام جدید را وارد کنید."

        new_name_container.appendChild(new_name_label)
        new_name_container.appendChild(new_name)
        content_container.appendChild(new_name_container)

        let edit_button = document.createElement('button')
        edit_button.className = "button--size-small"
        edit_button.innerHTML = "تغییر"
        original_category_name = p_name
        edit_button.addEventListener('click', edit_category)

        content_container.appendChild(edit_button)
    }

    // render the modal with child on DOM
    modal.appendChild(modal_content)
    document.body.appendChild(modal)

    modal.addEventListener('click', event => {
        if (event.target.className === 'modal') {
          removeModal()
        }
    })
}

function edit_category(){
    let data = {
        "category_name": document.getElementById('new_category_name').value
    }

    let xhttp = new XMLHttpRequest()

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == XMLHttpRequest.DONE){
            let json_response = JSON.parse(xhttp.responseText)
            if(json_response == "you don't have permission"){
                removeModal()
                renderModal(false, "شما مجاز به اعمال تغییرات نیستید.")
            }
            else if (json_response == "category updated"){
                removeModal()
                renderModal(true, "دسته بندی با موفقیت حذف شد.")

                    setTimeout(() => {
                        location.reload()
                    }, 1000);
            }
        }
    }

    xhttp.open("POST", "http://127.0.0.1:8000/update-category/" + original_category_name, true)
    xhttp.setRequestHeader("Authorization", "Token " + localStorage.getItem('token'))
    xhttp.setRequestHeader("Content-Type", "application/json")
    xhttp.send(JSON.stringify(data))
}

function delete_category(event){
    let data = {
        "category_name": event.target.name
    }

    let xhttp = new XMLHttpRequest()

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == XMLHttpRequest.DONE){
            let json_response = JSON.parse(xhttp.responseText)
            if(json_response == "you don't have permission"){
                renderModal(false, "شما مجاز به اعمال تغییرات نیستید.")
            }
            else if (json_response == "category deleted"){
                renderModal(true, "دسته بندی با موفقیت حذف شد.")

                    setTimeout(() => {
                        location.reload()
                    }, 1000);
            }
        }
    }

    xhttp.open("PUT", "http://127.0.0.1:8000/delete-category", true)
    xhttp.setRequestHeader("Authorization", "Token " + localStorage.getItem('token'))
    xhttp.setRequestHeader("Content-Type", "application/json")
    xhttp.send(JSON.stringify(data))
}

document.getElementById("add_category").addEventListener('click', (event) => {
    if (is_authenticated){
        renderModal_add_category(1, event.target.name)
    }
    else {
        renderModal_add_category(2, event.target.name)
    }
})

function renderModal_add_category(status, p_name){
    let status_message;
    if (status == 1){
        status_message = "اضافه کردن دسته بندی"
    }
    else if (status == 2){
        status_message = "ابتدا وارد شوید"
    }
    else {
        status_message = p_name
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
    
    if (status == 1){
        let content_container = document.createElement('div')
        content_container.classList.add('modal__content--type-content')
        modal_content.appendChild(content_container)

        let new_name_container = document.createElement('div')
        new_name_container.classList.add('number--to-buy')

        let new_name = document.createElement('input')
        new_name.id = "new_adding_category_name"
        new_name.type = "text"

        let new_name_label = document.createElement('p')
        new_name_label.innerHTML = "نام جدید را وارد کنید."

        new_name_container.appendChild(new_name_label)
        new_name_container.appendChild(new_name)
        content_container.appendChild(new_name_container)

        let add_button = document.createElement('button')
        add_button.className = "button--size-small"
        add_button.innerHTML = "اضافه کردن"
        add_button.addEventListener('click', add_category)

        content_container.appendChild(add_button)
    }

    // render the modal with child on DOM
    modal.appendChild(modal_content)
    document.body.appendChild(modal)

    modal.addEventListener('click', event => {
        if (event.target.className === 'modal') {
          removeModal()
        }
    })
}

function add_category(){
    let data = {
        "category_name": document.getElementById('new_adding_category_name').value
    }

    let xhttp = new XMLHttpRequest()

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == XMLHttpRequest.DONE){
            let json_response = JSON.parse(xhttp.responseText)
            if(json_response == "you don't have permission"){
                removeModal()
                renderModal(false, "شما مجاز به اعمال تغییرات نیستید.")
            }
            else if (json_response == "category added"){
                removeModal()
                renderModal(true, "دسته بندی با موفقیت اضافه شد.")

                    setTimeout(() => {
                        location.reload()
                    }, 1000);
            }
        }
    }

    xhttp.open("POST", "http://127.0.0.1:8000/add-category", true)
    xhttp.setRequestHeader("Authorization", "Token " + localStorage.getItem('token'))
    xhttp.setRequestHeader("Content-Type", "application/json")
    xhttp.send(JSON.stringify(data))
}

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

get_categories()

let product_container = document.getElementsByClassName("container__contents")[0]

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
                        json_response[i].price, json_response[i].address, json_response[i].first_name + " " + json_response[i].last_name)
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

document.getElementById("search_trace").addEventListener('input', (event) => {
    if (event.target.value == ""){
        get_receipts()
    }
    else {
        let new_receipts = []
        for(let i = 0; i < receipts.length; i ++){
            if (receipts[i].tracing_code.includes(event.target.value))
            new_receipts.push(receipts[i])
        }
        draw_receipts2(new_receipts)
    }
})

function draw_receipts(){
    let receipt_container = document.getElementById("receipts")
    receipt_container.innerHTML = ""
    receipt_container.appendChild(create_reciept('کد پیگیری', 'نام کالا', 'قیمت', 'آدرس', 'نام خریدار'))

    for(let i = 0; i < receipts.length; i ++){
        receipt_container.appendChild(create_reciept(receipts[i].tracing_code, receipts[i].stuff_name,
            receipts[i].price, receipts[i].address, receipts[i].first_name))
    }
}

function draw_receipts2(new_receipts){
    let receipt_container = document.getElementById("receipts")
    receipt_container.innerHTML = ""
    receipt_container.appendChild(create_reciept('کد پیگیری', 'نام کالا', 'قیمت', 'آدرس', 'نام خریدار'))

    for(let i = 0; i < receipts.length; i ++){
        receipt_container.appendChild(create_reciept(new_receipts[i].tracing_code, new_receipts[i].stuff_name,
            new_receipts[i].price, new_receipts[i].address, new_receipts[i].first_name))
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
    p_button.innerHTML = "ویرایش محصول"
    p_button.name = product_name
    p_button.addEventListener('click', edit_handler)
    price_container.appendChild(p_button)
    
    return product
}

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
                is_authenticated = true
                show_info(json_response.first_name)
            }
        }
    }

    xhttp.open("GET", "http://127.0.0.1:8000/user-info", true)
    xhttp.setRequestHeader("Authorization", "Token "+ localStorage.getItem('token'))
    xhttp.send()
}

function show_info(name){
    let button = document.getElementsByClassName('login__button')[1]
    button.innerHTML = name
    let arrow = document.createElement('i')
    arrow.className = 'arrow down'
    button.appendChild(arrow)

    document.getElementsByClassName("login__button--loggedin-no")[0].style.display = "none"
    document.getElementsByClassName("login__button--loggedin-yes")[0].style.display = "block"
}

athenticate()

class Product {
    constructor(stuff_name, category_name, price, stock, sold_count, creation_date){
        this.img_src = 'http://127.0.0.1:8000/static/img/product.png'
        this.stuff_name = stuff_name
        this.category_name = category_name
        this.price = price
        this.stock = stock
        this.sold_count = sold_count
        this.creation_date = creation_date
    }
}

let products = []

function get_products(){
    page_number = 1

    let data = {}
    data.category_name = []
    for(let i = 0; i < categories.length; i ++){
        data.category_name.push(categories[i])
    }

    data.sold_count = "desc"
    
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == XMLHttpRequest.DONE){
            let json_response = JSON.parse(xhttp.responseText)
            for(let i = 0; i < json_response.length; i++){
                let new_product = new Product(json_response[i].stuff_name, json_response[i].category_name, json_response[i].price,
                    json_response[i].stock, json_response[i].sold_count, json_response[i].creation_date)

                    products.push(new_product)
            }
            draw_products()
        }
    }

    xhttp.open("POST", "http://127.0.0.1:8000/stuff-list", true)
    xhttp.setRequestHeader('Content-Type', "application/json")
    xhttp.send(JSON.stringify(data))
}

function draw_products(){
    product_container.innerHTML = ""
    for(let i = (page_number - 1) * 15; i < Math.min(page_number * 15, products.length); i ++){
        product_container.appendChild(create_product(products[i].img_src, products[i].stuff_name, products[i].category_name, products[i].price))
    }
    draw_page_info(products.length)
}

function draw_page_info(number_of_products){
    let number_of_pages = Math.floor(number_of_products / 15) + 1

    let page_info_container = document.getElementsByClassName("page__number__info")[0]
    if (page_info_container == undefined){
        page_info_container = document.createElement("div")
        page_info_container.className = "page__number__info"
    }
    page_info_container.innerHTML = ""
    document.getElementsByTagName("body")[0].insertBefore(page_info_container, document.getElementById("footer"))
    
    let previous_page_button = document.createElement("button")
    previous_page_button.className = "page__number"
    previous_page_button.innerHTML = "صفحه قبل"
    previous_page_button.addEventListener("click", page_handler)
    page_info_container.appendChild(previous_page_button)

    for(let i = 1; i <= number_of_pages; i ++){
        let page_button = document.createElement("button")
        page_button.className = "page__number"
        if (page_number == i){
            page_button.className += " page__number__current"
        }
        page_button.innerHTML = i
        page_button.addEventListener("click", page_handler)
        page_info_container.appendChild(page_button)
    }

    let next_page_button = document.createElement("button")
    next_page_button.className = "page__number"
    next_page_button.innerHTML = "صفحه بعد"
    next_page_button.addEventListener("click", page_handler)
    page_info_container.appendChild(next_page_button) 

}

async function page_handler(event){
    event.preventDefault()
    let target_text = event.target.innerHTML
    let number_of_pages = Math.floor(products.length / 15) + 1

    if (target_text == "صفحه قبل"){
        if(page_number > 1){
            page_number -= 1
        }
    }
    else if (target_text == "صفحه بعد"){
        if(page_number < number_of_pages){
            page_number += 1
        }
    }
    else {
        page_number = target_text
    }

    draw_products()
}

function edit_handler(event){

}

document.getElementsByClassName("menu__item--type-main")[0].addEventListener('click', () => {
    let url = "http://127.0.0.1:8000/main"
    window.location.href = url
})

document.getElementById("exit").addEventListener('click', () => {
    localStorage.removeItem('token')
    
    let url = "http://127.0.0.1:8000/main"
    window.location.href = url
})