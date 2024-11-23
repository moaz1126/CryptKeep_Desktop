let dots = document.querySelector('#Dots');
let menus = document.querySelector('#Menus');
function menu() {
    dots = document.querySelector('#Dots');
    menus = document.querySelector('#Menus');
    if(menus.style.display == 'flex') {
        menus.style.display = ''
        dots.style.backgroundColor = ''
        dots.style.color = '#2C3E50'
    } else {
        menus.style.display = 'flex'
        dots.style.backgroundColor = '#2C3E50'
        dots.style.color = 'white'
    }
}

let dots2 = document.querySelectorAll('.editDots');
let menus2 = document.querySelectorAll('.editMenu');
function menu2(e) {
    dots2 = document.querySelectorAll('.editDots');
    menus2 = document.querySelectorAll('.editMenu');
    if(menus2[e].style.display == 'flex') {
        menus2[e].style.display = ''
        dots2[e].style.backgroundColor = ''
        dots2[e].style.color = '#2C3E50'
    } else {
        menus2[e].style.display = 'flex'
        dots2[e].style.backgroundColor = '#2C3E50'
        dots2[e].style.color = 'white'
    }
}

let eye = document.querySelectorAll('.fa-eye')
let eye2 = document.querySelectorAll('.fa-eye-slash')
let password = document.querySelectorAll('.password2')
function eyeFun(e) {
    eye = document.querySelectorAll('.fa-eye')
    eye2 = document.querySelectorAll('.fa-eye-slash')
    password = document.querySelectorAll('.password2')
    if(eye2[e].style.display == '' || eye2[e].style.display == 'none') {
        eye[e].style.display = 'none'
        eye2[e].style.display = 'inline'
        password[e].type = 'text';
    } else {
        eye[e].style.display = 'inline'
        eye2[e].style.display = 'none'
        password[e].type = 'password';
    }
}

let uplode = document.querySelector('#uplode');
function uplodeSH() {
    uplode = document.querySelector('#uplode');
    if(uplode.style.display == 'flex') {
        uplode.style.display = ''
    } else {
        uplode.style.display = 'flex'
    }
}


let settings = document.querySelector('#settings');
function settingsSH() {
    settings = document.querySelector('#settings');
    if(settings.style.display == 'flex') {
        settings.style.display = ''
    } else {
        settings.style.display = 'flex'
    }
}

let PasswordInput = document.querySelector("#PasswordInput");
let usernameInput = document.querySelector("#UsernameInput");
let lengthInput = document.querySelector('#PasswordLength')
let RandomButton = document.querySelector('#Random')
function add(e) {
    if(!e) {
        if(PasswordInput.style.display == 'flex') {
            AddAPP()
            // PasswordInput.style.display = 'none'
        } else {
            PasswordInput.style.display = 'flex';
            lengthInput.style.display = 'flex';
            RandomButton.style.display = 'block';
            usernameInput.style.display = 'flex'
            appsDiv.style.marginTop = '110px'
        }
    }
    if(e == true) {
        PasswordInput.style.display = 'none';
        lengthInput.style.display = 'none';
        RandomButton.style.display = 'none';
        usernameInput.style.display = 'none'
        appsDiv.style.marginTop = '60px'
    }
}

let xmarkspan = document.querySelectorAll(".fa-xmarkspan");
let app = document.querySelectorAll('.editpassword')
function xmarkspanFun(e) {
     xmarkspan = document.querySelectorAll(".fa-xmarkspan");
    app = document.querySelectorAll('.editpassword')
    if(app[e].style.display == 'flex') {
        app[e].style.display = ''
    } else {
        app[e].style.display = 'flex'
        menus2[e].style.display = ''
        dots2[e].style.backgroundColor = ''
        dots2[e].style.color = '#2C3E50'
    }
}

let createMenu = document.querySelector('#create');
async function createSH() {
    createMenu = document.querySelector('#create');
    // createMenu = await document.querySelector('#create');
    if(createMenu.style.display == '' || createMenu.style.display == 'none') {
        createMenu.style.display = 'flex'
    } else {
        console.log('none')
        createMenu.style.display = 'none'
    }
}

let ivMenu = document.querySelector('#iv');
let ivH2 = document.querySelector('#iv h2');

function ivSH(value) {
    ivH2 = document.querySelector('#iv h2');
    ivMenu = document.querySelector('#iv');
    if(ivMenu.style.display == 'flex') {
        ivMenu.style.display = ''
    } else {
        ivMenu.style.display = 'flex'
        if(value) {
            ivH2.textContent = value
        }
    }
}

function ivCopy() {
    navigator.clipboard.writeText(ivH2.textContent).then(function() {
        alert('Copied to clipboard!');
    }).catch(function(error) {
        alert('Copy failed', error)
    });
}


function PassCopy(e) {
    password = document.querySelectorAll('.password2')
    let val = password[e].value;
    navigator.clipboard.writeText(val).then(function() {
        alert('Copied to clipboard!');
    }).catch(function(error) {
        alert('Copy failed', error)
    });
}

function xmarkBackupFun(e) {
    app2 = document.querySelectorAll('.backupcodes')
    if(app2[e].style.display == 'flex') {
        app2[e].style.display = ''
    } else {
        app2[e].style.display = 'flex'
        menus2[e].style.display = ''
        dots2[e].style.backgroundColor = ''
        dots2[e].style.color = '#2C3E50'
    }
}

let loader = document.querySelector("#loader");
function Loader(State) {
    if(State == true) {
        loader.style.display = 'block'
    } else {
        loader.style.display = 'none'
    }
} 