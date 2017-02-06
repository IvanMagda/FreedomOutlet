function doBeat() {
    var heart1 = document.getElementsByClassName('heart1')[0];
    var heart2 = document.getElementsByClassName('heart2')[0];

    heart1.style.display = "none";
    heart2.style.display = "inline-block";

    setTimeout(() => {
        heart1.style.display = "inline-block";
        heart2.style.display = "none";

        setTimeout(() => {
            heart1.style.display = "none";
            heart2.style.display = "inline-block";

            setTimeout(() => {
                heart1.style.display = "inline-block";
                heart2.style.display = "none";

                setTimeout(() => {
                    heart1.style.display = "none";
                    heart2.style.display = "inline-block";
                }, 200);
            }, 1000);
        }, 200);
    }, 200);
}

//setInterval(doBeat, 2000);
