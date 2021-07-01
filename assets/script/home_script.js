"use strict";


(function main() {
    let hearoheader = document.getElementsByClassName("container__hearoheader")[0];
    let slider_left = document.getElementById("slider_left");
    let slider_right = document.getElementById("slider_right");

    let hearoheader_background_index = 0;
    let backgrounds_src = ["url('assets/img/bg1.jpg')", "url('assets/img/bg2.jpg')", "url('assets/img/bg3.jpg')"];
    let slider_interval;

    window.onload = async() => {
        reset_slider_interval();
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

})()