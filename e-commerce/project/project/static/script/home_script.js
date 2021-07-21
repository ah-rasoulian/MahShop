"use strict";


(function main() {
    let hearoheader = document.getElementsByClassName("container__hearoheader")[0];
    let slider_left = document.getElementById("slider_left");
    let slider_right = document.getElementById("slider_right");
    let product_container = document.getElementsByClassName("container__contents--position-left")[0]

    let hearoheader_background_index = 0;
    let backgrounds_src = ["url('http://127.0.0.1:8000/static/img/bg1.jpg')", "url('http://127.0.0.1:8000/static/img/bg2.jpg')", "url('http://127.0.0.1:8000/static/img/bg3.jpg')"];
    let slider_interval;

    let is_authenticated = false;

    let sorting_info = {
        category_name: [],
        sold_count: "desc",
        price: "none",
        date: "none",
        search_box: ""
    }

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
    let buy_product;
    let categories = []

    let page_number = 1;

    window.onload = async() => {
        initializer();
        reset_slider_interval();

        get_categories();
        get_products();
    }

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
            draw_categories()
        }

        xhttp.open("GET", "http://127.0.0.1:8000/get-cat", true)
        xhttp.send()
    }

    function draw_categories(){
        let container = document.getElementsByClassName("filter__classification")[0]
        container.innerHTML = ""

        let header = document.createElement("h2")
        header.innerHTML = "دسته‌بندی‌ها"
        container.appendChild(header)

        for(let i = 0; i < categories.length; i++){
            let item = document.createElement('div')
            item.classList.add("classification__item")

            let check_box = document.createElement('input')
            check_box.type = "checkbox"
            check_box.name = categories[i]
            check_box.addEventListener('change', change_categories)

            let class_name = document.createElement('p')
            class_name.innerHTML = categories[i]

            item.appendChild(check_box)
            item.appendChild(class_name)
            container.appendChild(item)
        }
    }

    function change_categories(event){
        if(event.target.checked){
            sorting_info.category_name.push(event.target.name)
        }
        else {
            const index = sorting_info.category_name.indexOf(event.target.name)
            if (index > -1){
                sorting_info.category_name.splice(index, 1)
            }
        }
        get_products()
    }

    function initializer(){
        let sorting_buttons = document.getElementsByClassName("button__sorting")
        for (let i = 0; i < sorting_buttons.length; i++){
            sorting_buttons.item(i).addEventListener('click', change_sorting_button)
        }

        athenticate()
    }

    function athenticate(){
        let xhttp = new XMLHttpRequest()

        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == XMLHttpRequest.DONE){
                let json_response = JSON.parse(xhttp.responseText)
                if (json_response.detail){
                    if (json_response.detail == 'Invalid toke.'){
                        console.log('Invalid token')
                    }
                }
                else {
                    is_authenticated = true
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

    function change_sorting_button(event){
        let button_name = event.target.name
        if (button_name == "price"){
            let arrow = document.getElementById("sorting--order-price")

            if (event.target.classList.contains("button__sorting--status-clicked")){
                if (arrow.classList.contains("down")){
                    arrow.className = "arrow up"
                    sorting_info.price = "asc"
                }
                else {
                    event.target.classList.remove("button__sorting--status-clicked")
                    arrow.style.display = "none"
                    sorting_info.price = "none"
                }
            }
            else {
                arrow.style.display = "inline-block"
                event.target.classList.add("button__sorting--status-clicked")
                arrow.className = "arrow down"
                sorting_info.price = "desc"
            }
        }
        else if (button_name == "date"){
            if (event.target.classList.contains("button__sorting--status-clicked")){
                event.target.classList.remove("button__sorting--status-clicked")
                sorting_info.price = "none"
            }
            else {
                event.target.classList.add("button__sorting--status-clicked")
                sorting_info.price = "desc"
            }
        }
        else if (button_name == "sold_count"){
            if (event.target.classList.contains("button__sorting--status-clicked")){
                event.target.classList.remove("button__sorting--status-clicked")
                sorting_info.sold_count = "none"
            }
            else {
                event.target.classList.add("button__sorting--status-clicked")
                sorting_info.sold_count = "desc"
            }
        }

        get_products()
    }

    function change_hearoheader_background() {
        hearoheader.style.backgroundImage = backgrounds_src[hearoheader_background_index];
        document.getElementById("clock_image").style.visibility = 'hidden';

        hearoheader_background_index = (hearoheader_background_index + 1) % backgrounds_src.length;
    }

    slider_left.onclick = async() => {
        hearoheader_background_index = hearoheader_background_index - 1;
        if (hearoheader_background_index < 0) {
            hearoheader_background_index = backgrounds_src.length - 1
        }

        hearoheader.style.backgroundImage = backgrounds_src[hearoheader_background_index];
        document.getElementById("clock_image").style.visibility = 'hidden';

        reset_slider_interval();
    }

    slider_right.onclick = async() => {
        hearoheader_background_index = (hearoheader_background_index + 1) % backgrounds_src.length;

        hearoheader.style.backgroundImage = backgrounds_src[hearoheader_background_index];
        document.getElementById("clock_image").style.visibility = 'hidden';

        reset_slider_interval();
    }

    function reset_slider_interval() {
        clearInterval(slider_interval);
        slider_interval = setInterval(change_hearoheader_background, 10000);
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
        p_button.name = product_name
        p_button.addEventListener('click', buy_handler)
        price_container.appendChild(p_button)
        
        return product
    }

    function buy_handler(event){
        if (is_authenticated){
            renderModal(1, event.target.name)
        }
        else {
            renderModal(2, event.target.target)
        }
        
    }

    function removeModal(){
        // find the modal and remove if it exists
        let modal = document.querySelector('.modal')
        if (modal) {
          modal.remove()
        }
    }
    
    function renderModal(status, p_name){
        let status_message;
        if (status == 1){
            status_message = "خرید محصول"
        }
        else if (status == 2){
            status_message = "ابتدا وارد شوید"
        }
        else {
            status_message = p_name
        }
        
        let product = products.find(p => {
            return p.stuff_name === p_name
        })

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
    
            let name = document.createElement('p')
            name.innerHTML = "نام محصول : "
            name.innerHTML += product.stuff_name
            content_container.appendChild(name)
    
            let stock = document.createElement('p')
            stock.innerHTML = "تعداد موجود : "
            stock.innerHTML += product.stock
            content_container.appendChild(stock)
    
            let price = document.createElement('p')
            price.innerHTML = "قیمت واحد : "
            price.innerHTML += product.price
            content_container.appendChild(price)
    
            let number_to_buy = document.createElement('div')
            number_to_buy.classList.add('number--to-buy')
    
            let count = document.createElement('input')
            count.id = "product_counts"
            count.type = "number"
            count.step = 1
            count.min = 1
            count.max = product.stock
    
            let count_label = document.createElement('p')
            count_label.innerHTML = "چند تا میخواهید؟"
    
            number_to_buy.appendChild(count_label)
            number_to_buy.appendChild(count)
            content_container.appendChild(number_to_buy)
    
            let total_price = document.createElement('p')
            total_price.id = "total_price"
            content_container.appendChild(total_price)
    
            count.addEventListener('input', (event) => {
                document.getElementById("total_price").innerHTML = "قیمت کل : "
                let counts;
                if (event.target.value == ""){
                    counts = 0
                }
                else{
                    counts = parseInt(event.target.value)
                }

                document.getElementById("total_price").innerHTML += product.price * counts
            })
    
            let purchase_button = document.createElement('button')
            purchase_button.className = "button--size-small"
            purchase_button.innerHTML = "خرید"
            buy_product = product
            purchase_button.addEventListener('click', purchase)
    
            content_container.appendChild(purchase_button)
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

    function purchase(){
        let count = document.getElementById('product_counts').value

        let data = {
            "stuff_name": buy_product.stuff_name,
            "items": count
        }

        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == XMLHttpRequest.DONE){
                let json_response = JSON.parse(xhttp.responseText)
                if (json_response == "succesfful purchase"){
                    removeModal()
                    renderModal(3, "پرداخت با موفیت انجام شد")
                    setTimeout(() => { location.reload() }, 1000);
                }
                else if (json_response == "you don't have enough money"){
                    removeModal()
                    renderModal(3, "شما پول کافی ندارید")
                }
                else if (json_response == "there is not enough stuff"){
                    removeModal()
                    renderModal(3, "تعداد کافی از محصول وجود ندارد")
                }
            }
        }

        xhttp.open("POST", "http://127.0.0.1:8000/purchase", true)
        xhttp.setRequestHeader("Authorization", "Token "+ localStorage.getItem('token'))
        xhttp.setRequestHeader('Content-Type', "application/json")
        xhttp.send(JSON.stringify(data))
    }

    function get_products(){
        products = []
        page_number = 1

        let data = {}
        if(sorting_info.category_name.length > 0){
            data.category_name = sorting_info.category_name
        }
        if (sorting_info.search_box != ""){
            data.search_box = sorting_info.search_box
        }
        data.sold_count = sorting_info.sold_count
        data.price = sorting_info.price
        data.date = sorting_info.date
        
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

        // for(let i = 0; i < 40; i ++){
        //     let new_product = new Product(product_json.img_src, product_json.product_name, product_json.product_class, product_json.product_price)
        //     products.push(new_product)
        // }
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

    document.getElementsByClassName("menu__item--type-products")[0].addEventListener('click', () => {
        // changin url to home page and navigate to product
        document.getElementsByClassName("container__contents")[0].scrollIntoView()
    })
    
    document.getElementsByClassName("login__button--loggedin-no")[0].addEventListener('click', () => {
        let url = "http://127.0.0.1:8000/enter"
        window.location.href = url
    })

    document.getElementsByClassName("search__button")[0].addEventListener('click', () => {
        sorting_info.search_box = document.getElementsByClassName("search__input")[0].value
        get_products()
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
})()