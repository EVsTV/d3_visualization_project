function addListeners(){
    var rad = document.getElementById("toggle_radio_container").getElementsByTagName("toggle_option");
    var prev = null;
    for(var i = 0; i < rad.length; i++) {
        rad[i].onclick = function () {
            (prev)? console.log(prev.id):null;
            if(this !== prev) {
                prev = this;
            }
            console.log(this.id)
        };
    }
    console.log("Listeners Added")
}