"use strict";


(function main() {
    let hearoheader = document.getElementsByClassName("container__hearoheader")[0];
    let slider_left = document.getElementById("slider_left");
    let slider_right = document.getElementById("slider_right");
    let product_container = document.getElementsByClassName("container__contents--position-left")[0]

    let hearoheader_background_index = 0;
    let backgrounds_src = ["url('assets/img/bg1.jpg')", "url('assets/img/bg2.jpg')", "url('assets/img/bg3.jpg')"];
    let slider_interval;

    let product_json = {
        "img_src": "assets/img/product.png",
        "product_name": "کالا",
        "product_class": "بدون دسته‌بندی",
        "product_price": "۱۰۰۰۰ تومان"
    }

    class Product {
        constructor(img_src, product_name, product_class, product_price){
            this.img_src = img_src
            this.product_name = product_name
            this.product_class = product_class
            this.product_price = product_price
        }
    }

    let page_number = 2;

    window.onload = async() => {
        reset_slider_interval();
        draw_products(get_products());
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
        p_price.innerHTML = product_price
        price_container.appendChild(p_price)

        let p_button = document.createElement("button")
        p_button.className = "button--size-small"
        p_button.innerHTML = "خرید محصول"
        price_container.appendChild(p_button)
        
        return product
    }

    function get_products(){
        let products = []
        for(let i = 0; i < 20; i ++){
            let new_product = new Product(product_json.img_src, product_json.product_name, product_json.product_class, product_json.product_price)
            products.push(new_product)
        }
        return products
    }

    function draw_products(products){
        product_container.innerHTML = ""
        for(let i = (page_number - 1) * 15; i < Math.min(page_number * 15, products.length); i ++){
            product_container.appendChild(create_product(products[i].img_src, products[i].product_name, products[i].product_class, products[i].product_price))
        }
    }

})()