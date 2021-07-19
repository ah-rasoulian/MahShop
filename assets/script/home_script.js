"use strict";


(function main() {
    let hearoheader = document.getElementsByClassName("container__hearoheader")[0];
    let slider_left = document.getElementById("slider_left");
    let slider_right = document.getElementById("slider_right");
    let product_container = document.getElementsByClassName("container__contents--position-left")[0]

    let hearoheader_background_index = 0;
    let backgrounds_src = ["url('../assets/img/bg1.jpg')", "url('../assets/img/bg2.jpg')", "url('../assets/img/bg3.jpg')"];
    let slider_interval;

    let products_info = {
        "category": "بدون دسته‌بندی",
        "price": "desc",
        "date": "none",
        "lbp": "none",
        "ubp": "none"
    }

    let product_json = {
        "img_src": "../assets/img/product.png",
        "product_name": "کالا",
        "product_class": "بدون دسته‌بندی",
        "product_price": "10000"
    }

    class Product {
        constructor(img_src, product_name, product_class, product_price){
            this.img_src = img_src
            this.product_name = product_name
            this.product_class = product_class
            this.product_price = product_price
        }
    }

    let products = []

    let page_number = 1;

    window.onload = async() => {
        initializer();
        reset_slider_interval();
        draw_products(get_products());
    }

    function initializer(){
        let sorting_buttons = document.getElementsByClassName("button__sorting")
        for (let i = 0; i < sorting_buttons.length; i++){
            sorting_buttons.item(i).addEventListener('click', change_sorting_button)
        }
    }

    function change_sorting_button(event){
        if (event.target.classList.contains("button__sorting--status-clicked")){
            event.target.classList.remove("button__sorting--status-clicked")
        }
        else {
            event.target.classList.add("button__sorting--status-clicked")
        }
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
        price_container.appendChild(p_button)
        
        return product
    }

    function get_products(){
        for(let i = 0; i < 40; i ++){
            let new_product = new Product(product_json.img_src, product_json.product_name, product_json.product_class, product_json.product_price)
            products.push(new_product)
        }
        return products
    }

    function draw_products(){
        product_container.innerHTML = ""
        for(let i = (page_number - 1) * 15; i < Math.min(page_number * 15, products.length); i ++){
            product_container.appendChild(create_product(products[i].img_src, products[i].product_name, products[i].product_class, products[i].product_price))
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
        document.getElementsByClassName("container__contents")[0].scrollIntoView()
    })
    
    document.getElementsByClassName("login__button--loggedin-no")[0].addEventListener('click', () => {
        let url = ""
        window.location.href = url
    })
})()