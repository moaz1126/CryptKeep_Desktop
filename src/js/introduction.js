const regularDots = document.querySelectorAll('.regular')
const solidDots = document.querySelectorAll('.solid')
const text = ["Welcome to CryptKeep the easiest and most secure way to store your passwords, it's free and open-source.", "Step 1: Create the master key, enter all your passwords, download the file from the site", "Step 2: Recover passwords: Upload the file you downloaded, enter the master key and go with your passwords."]
const textP = document.querySelector("#textP")
const button = document.querySelector('#button')
let textnum = 0;

async function next() {
    let img = document.querySelector("#img")
    let video = document.querySelector("#video")
    if(textnum == 3) {
        await window.localStorage.setItem('FristTime', false);
        newHref();
    } else {
        if(true) {
            regularDots[textnum].style.display = 'none'
            solidDots[textnum].style.display = 'inline'
            for (let i = textnum - 1; i >= 0; i--) {
                solidDots[i].style.display = 'none';
                regularDots[textnum].style.display = 'inline'
            }        
            textP.innerText = text[textnum];
            textnum++
        }
        if(textnum == 3) {
            button.textContent = 'Lets go'
        }
        if(textnum == 2) {
            img.style.display = 'none';
            video.style.display = 'block'
            video.play()
            // textnum++
        }
    }
}
next()
function newHref() {
    window.location.href = '../'
}