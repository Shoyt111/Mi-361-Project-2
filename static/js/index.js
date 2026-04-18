var figureDiv;
var mainDiv;
var accountButton;
var isLoggedIn;

// TEMPORARY
var imageElements = ["static/resources/temp/bigpoo.jpg", "static/resources/temp/sphereTex.png", "static/resources/temp/HTML.png", "static/resources/temp/OBS.png", "static/resources/temp/VSC.png", "static/resources/temp/Slashimi-2.png", "static/resources/temp/horsehungry-thumb.png"];
var userImageElements = []
// var userImageElements = ["static/resources/temp/HTML.png", "static/resources/temp/Slashimi-2.png", "static/resources/temp/horsehungry-thumb.png"]

document.addEventListener('DOMContentLoaded', async () => {
    figureDiv = document.getElementsByTagName('figure')[0];
    mainDiv = document.getElementsByTagName('main')[0];
    accountButton = document.getElementById("accountButton");

    instantiateLogin();
    userImageElements = await getUserImages();
    console.log("Images from server:", userImageElements);

    instantiateAllImages();
});

document.addEventListener('click', function (event) {
   if(figureDiv.classList.contains('active') && !figureDiv.contains(event.target)){
       closeDetails();
   }
});

function openDetails(str){
    setTimeout(function (){
        figureDiv.getElementsByTagName('img')[0].src=str;
        figureDiv.getElementsByTagName('figcaption')[0].textContent = str;
        figureDiv.classList.add('active');
        figureDiv.classList.remove('inactive');
    }, 2);
}

function closeDetails(){
    figureDiv.classList.add('inactive');
    figureDiv.classList.remove('active');
}

function resetImageCollection() {
    var elements = mainDiv.getElementsByTagName('input');
    while(elements.length > 0){
        elements[0].remove();
    }
}

function instantiateAllImages() {
    resetImageCollection();
    imageElements.forEach((imageStr, index) => {
        var imageElem = document.createElement("input");
        imageElem.classList.add("image");
        imageElem.type = "image";
        imageElem.src = imageStr;
        mainDiv.appendChild(imageElem);

        imageElem.onclick = () => openDetails(imageStr);
    });
}

function instantiateUserImages() {
    resetImageCollection();
    userImageElements.forEach((imageStr, index) => {
        console.log(imageStr, index);
        var imageElem = document.createElement("input");
        imageElem.classList.add("image");
        imageElem.type = "image";
        imageElem.src = imageStr;
        mainDiv.appendChild(imageElem);

        imageElem.onclick = () => openDetails(imageStr);
    });
}

function instantiateLogin(){
    isLoggedIn = true; // Check if the user is logged in

    switch (isLoggedIn){
        case true:
            accountButton.value = "Log Out";
            accountButton.onclick = () => logout();
            break;
        case false:
            accountButton.value = "Log In";
            accountButton.onclick = () => openLogin();
    }
}

function upload(fileInput)
{
    const form = new FormData();
    const picture = fileInput.files[0]

    form.append("picture", picture)
    fetch("/upload", {method : "POST", body: form,   headers: {"Authorization": localStorage.getItem("token")}})
    .then (r => r.text())
    .then(data => {
        {

        }
    });
}

// Logging in stuff
function logout(){
    window.location.href = "/";
}

function openLogin(){
    window.location.href = "login/";
}

async function getUserImages()
{
    const form = new FormData();
    form.append("token", localStorage.getItem("token"));
    const r = await fetch("/get_user_images", {method : "POST", body : form});

    const data = await r.json();
    return data['photos'];
}
