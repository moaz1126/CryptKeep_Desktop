const { ipcRenderer } = require('electron');


document.querySelector('nav').innerHTML = document.querySelector('nav').innerHTML + '<div id="dropZone">Drop your JSON file here</div>'
document.querySelectorAll('#settings span')[1].innerHTML = '<input onchange="localstorge()" type="checkbox" name="Save to local storge" id="passwordlocalstorge"> Save your local files'
document.querySelector('#settings').innerHTML = document.querySelector('#settings').innerHTML + '<span><input onchange="passkeySaveFun()" type="checkbox" name="Save passkey" id="passkeySvae"> Save your passkeys to your device <b style="color: red;">(Not Safe)</b></span>'
// document.querySelector('#settings').style.height = '250px'
// document.querySelector('footer').style.display = 'none'
document.querySelector('#uplode h3').innerHTML = document.querySelector('#uplode h3').innerHTML + `<span class="passkeyEye" onclick="showPasskey()"><i class="fa-regular fa-eye"></i></span>`

let faCloud = document.querySelector("#thePassFile");
let uplodeDiv = document.querySelector('#uplode');
let uplodeDivH3 = document.querySelector('#uplode h3');


let EnPasskeyCode = ''
let CPU_HArdwareNum = '';
ipcRenderer.send('get-cpu-serial');
ipcRenderer.on('cpu-num', (event, message) => {
    CPU_HArdwareNum = message;
    WhenCPULoad()
    if(message == '') {
        alert('Failed to get your Hardware id, passkey will not be saved')
    }

});

ipcRenderer.send('---------------');
ipcRenderer.on('---------', (event, message) => {
    EnPasskeyCode = message;
    WhenCPULoad()
    if(message == '') {
        alert('--------------------')
    }

});

document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    let body = document.querySelector("body");
    let dragCounter = 0;  // Counter to track drag events
  
    body.addEventListener('dragover', (event) => {
      event.preventDefault();
      dropZone.style.display = 'flex';
    });
  
    dropZone.addEventListener('dragenter', (event) => {
      event.preventDefault();
      dragCounter++;
      dropZone.style.display = 'flex';
    });
  
    dropZone.addEventListener('dragleave', (event) => {
      event.preventDefault();
      dragCounter--;
      if (dragCounter === 0) {
        dropZone.style.display = 'none';
      }
    });
  
    body.addEventListener('drop', (event) => {
      event.preventDefault();
      dropZone.style.display = 'none';
      dragCounter = 0;
  
      const file = event.dataTransfer.files[0];
      if (file && file.type === 'application/json') {
        const reader = new FileReader();
  
        reader.onload = (event) => {
          const jsonData = JSON.parse(event.target.result);
          loadData1(jsonData)
        };
  
        reader.readAsText(file);
      } else {
        alert('Please drop a JSON file.');
      }
    });
});

let droped;  
function loadData1(data) {
    faCloud.style.display = 'none';
    uplodeDiv.style.width = '330px'
    uplodeDiv.style.height = "340px"
    uplodeDivH3.textContent = 'Enter your passkeys'
    uplodeSH();
    droped = true;
    FileContent = data
}

async function ok() {
    if(done == true) {
        if(passkeyEl.value.length != 0 && passkeyElVI.value.length != 0) {
            uplodeSH()
            passkey = passkeyEl.value;
            passkey2 = passkeyElVI.value
            Loader(true);
            await LoadData()
            Loader(false);
            passkeyEl.value = "";
            passkeyElVI.value = "";
            saveToLocal();
        } else {
            alert("please type your passkey and passkey 2")
        }
    } else if(droped) {
        if(passkeyEl.value.length != 0 && passkeyElVI.value.length != 0) {
            uplodeSH()
            passkey = passkeyEl.value;
            passkey2 = passkeyElVI.value
            Loader(true);
            await LoadData()
            Loader(false);
            passkeyEl.value = "";
            passkeyElVI.value = "";
            faCloud.style.display = 'block';
            uplodeDiv.style.width = '300px'
            uplodeDiv.style.height = "430px"
            uplodeDivH3.textContent = 'Upload your password file' + `<span class="passkeyEye" onclick="showPasskey()"><i class="fa-regular fa-eye"></i></span>`


            if(window.localStorage.getItem('SavePasskey') == 'true' && CPU_HArdwareNum != '' && EnPasskeyCode != '') {
                // Encript passkeys
                let encryptPasskey1 = await encrypt(passkey, EnPasskeyCode, CPU_HArdwareNum);
                let encryptPasskey2 = await encrypt(passkey2, EnPasskeyCode, CPU_HArdwareNum);

                let EnPasskeys = {passkey1: encryptPasskey1, passkey2: encryptPasskey2}
                
                saveJsonObject(EnPasskeys, 'passkey.json')
            }

            saveToLocal();
        } else {
            alert("please type your passkey and passkey 2")
        }
    } else if(FileContent && passkeyEl.value.length != 0 && passkeyElVI.value.length != 0) {
        uplodeSH()
        passkey = passkeyEl.value;
        passkey2 = passkeyElVI.value
        Loader(true);
        await LoadData()
        Loader(false);
        passkeyEl.value = "";
        passkeyElVI.value = "";
        faCloud.style.display = 'block';
        uplodeDiv.style.width = '300px'
        uplodeDiv.style.height = "430px"
        uplodeDivH3.textContent = 'Upload your password file' + `<span class="passkeyEye" onclick="showPasskey()"><i class="fa-regular fa-eye"></i></span>`
    }
}
function uplodeSH() {
    uplode = document.querySelector('#uplode');
    if(uplode.style.display == 'flex') {
        uplode.style.display = ''
        faCloud.style.display = 'block';
        uplodeDiv.style.width = '300px'
        uplodeDiv.style.height = "430px"
        uplodeDivH3.textContent = 'Upload your password file' + `<span class="passkeyEye" onclick="showPasskey()"><i class="fa-regular fa-eye"></i></span>`
    } else {
        uplode.style.display = 'flex'
    }
}



function saveJsonObject(jsonObject, fileName) {
  ipcRenderer.send('save-json', jsonObject, fileName);
}

ipcRenderer.on('save-json-reply', (event, message) => {
  console.log(message);
});

// Function to delete the JSON file
function deleteJsonFile(fileName) {
  ipcRenderer.send('delete-json', fileName);
}

ipcRenderer.on('delete-json-reply', (event, message) => {
  console.log(message);
});

// Function to read the JSON file
function readJsonFile(fileName) {
  ipcRenderer.send('read-json', fileName);
}

ipcRenderer.on('read-json-reply', async (event, data) => {
  if (data.startsWith('Failed')) {
    console.error(data);
  } else {
    const jsonObject = JSON.parse(data);
    if(jsonObject.passkey1 != undefined && jsonObject.passkey1 != 'undefined' && jsonObject.passkey2 != undefined && jsonObject.passkey2 != 'undefined') {
        let DePasskey1 = await decrypt(jsonObject.passkey1, EnPasskeyCode, CPU_HArdwareNum, true);
        let DePasskey2 = await decrypt(jsonObject.passkey2, EnPasskeyCode, CPU_HArdwareNum, true);
        if(DePasskey1 != 'Err' && DePasskey2 != 'Err') {
            passkeyEl.value = DePasskey1
            passkeyElVI.value =  DePasskey2
        }
    } else {
        FileContent = jsonObject;
    }
  }
});


function openLink(e) {
    // need to del links and add fun
    // <div>
    //   <a href="#" onclick="openLink(1)"><i class="fa-brands fa-discord"></i></a>
    //   <a href="#" onclick="openLink(2)"><i class="fa-solid fa-blog"></i></a>
    //    <a href="#" onclick="openLink(3)"><i class="fa-brands fa-github"></i></a>
    // </div>
    const { shell } = require('electron');
    if(e == 1) {
        shell.openExternal('https://discord.com/users/1064210185062719548'); // Replace with your desired URL
    } else if(e == 2) {
        shell.openExternal('https://about-moaz1126.web.app/'); // Replace with your desired URL
    } else {
        shell.openExternal('https://github.com/moaz1126/CryptKeep/'); // Replace with your desired URL
    }
}


ipcRenderer.on('open-new-window', (event, fileName) => {
    ipcRenderer.send('open-new-window', fileName);
});

// Fun Update
// i need to remove it from plugins.js
window.addEventListener('load', async function() {
    createSH();
    let checkbox = document.querySelector('#passwordlocalstorge');
    if(window.localStorage.getItem('SaveToLocalStorge') == 'true') {
        checkbox.checked = true;
        readJsonFile('passwords.json')
    } else {
        checkbox.checked = false
    }

    if(window.localStorage.getItem('FristTime')) {

    } else {
        ipcRenderer.send('open-new-window', 'Other/introduction.html');
    }

});

function WhenCPULoad() {
    if(window.localStorage.getItem('SavePasskey') == 'true' && CPU_HArdwareNum != '' && EnPasskeyCode != '') {
        let checkbox2 = document.querySelector('#passkeySvae');
        if(window.localStorage.getItem('SavePasskey') == 'true') {
            checkbox2.checked = true;
            readJsonFile('passkey.json')
        } else {
            checkbox2.checked = false
        }
        // // Encript passkeys
        // let encryptPasskey1 = await encrypt(passkey, 'EnPasskey', );
        // let encryptPasskey2 = await encrypt(passkey2, 'EnPasskey', );

        // let EnPasskeys = {passkey1: encryptPasskey1, passkey2: encryptPasskey2}
        
        // saveJsonObject(EnPasskeys, 'passkey.json')

    } 
    // else {
    //     console.log(window.localStorage.getItem('SavePasskey') == 'true', CPU_HArdwareNum != '')
    // }
}

function showPasskey() {
    let i = document.querySelector('.passkeyEye i');
    if (passkeyEl.type === 'text') {
        // Change both inputs to password type
        passkeyEl.type = 'password';
        passkeyElVI.type = 'password';
        i.classList.add('fa-eye');
        i.classList.remove('fa-eye-slash');
    } else {
        // Change both inputs to text type
        passkeyEl.type = 'text';
        passkeyElVI.type = 'text';
        i.classList.remove('fa-eye');
        i.classList.add('fa-eye-slash');
    }
    
}

async function decrypt(encryptedData, passkey, iv, isPasskey) {
    try {
        const decrypted = await decryptText(encryptedData, passkey, iv);
        return decrypted
    } catch (error) {
        console.error('Decryption failed:', error);
        if(isPasskey) {
            alert('Failed to load your saved passkey')
            return 'Err'
        } else {
            alert('Wrong passkey')
            window.location.reload();
        }
    }
};

function newHref() {
    ipcRenderer.send('close-new-window');
}


function localstorge() {
    let checkbox = document.querySelector('#passwordlocalstorge');
    if (checkbox.checked) {
        window.localStorage.setItem('SaveToLocalStorge', true)
        saveJsonObject(FileContent, 'passwords.json')
        alert('Now you dont need to upload the file, Just enter your passkey and second passkey')
    } else {
        window.localStorage.setItem('SaveToLocalStorge', false)
        deleteJsonFile('passwords.json')
    }
}

function saveToLocal() {
    if(window.localStorage.getItem('SaveToLocalStorge') == 'true') {
        saveJsonObject(FileContent, 'passwords.json');
    } 
}

// Fun Update

// Auto Update
const feedURLWeb = 'https://cryptkeep-web.web.app/Desktop/releases.json';
let feedURLData;
let appVersion =  '1.1.0'
async function feedURLFun() {
    await fetch(feedURLWeb)
        .then(response => {
            // Check if the response is ok
            if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // Parse the JSON data
        })
        .then(data => {
            // Use the data here
            feedURLData = data;
        })
        .catch(error => {
            // Handle any errors that occur
            // console.error('There has been a problem with your fetch operation:', error);
            console.error('There has been a problem with auto update operation');
        });

    if(feedURLData) {
        const lastRelease = feedURLData.releases[feedURLData.releases.length - 1];
    
        // Extract version, notes, and URL
        const version = lastRelease.version;
        const notes = lastRelease.notes;
        const url = lastRelease.url;
        // console.error(version, notes, url, feedURLData)
        if(appVersion != version) {
            let userResponse = confirm(`Update available: Do you want to download it?\n\n${notes}`);

            // Check the response
            if (userResponse) {
                console.log('yes');
                // Add an element using innerHTML
                document.querySelector('nav').innerHTML += `
                    <div id="downloadState">
                        <span id="span1">
                            <span id="span2"></span>
                            <p>0%</p>
                        </span>
                    </div>
                `
                ipcRenderer.send('download-and-run', url);
            } else {
                console.warn('Update Disabled')
            }
        }
    } else {
        console.error('Threre is a problem with your internet.')
    }
}
  
ipcRenderer.on('download-progress', (event, progress) => {
    // console.log(`Download progress: ${progress}%`);
    let p = document.querySelector('#downloadState p');
    let span = document.querySelector('#span2');
    span.style.width = `${progress}%`
    p.textContent = `${progress}%`
});
ipcRenderer.on('download-complete', (event, filePath) => {
    const userResponse = confirm(`App installer downloaded successfully to ${filePath}. Do you want to run the installer?`);
    if (userResponse) {
      ipcRenderer.send('run-installer', filePath);
    } else {
        // Select the child element to be removed
        const downloadState = document.querySelector('#downloadState');

        downloadState.remove()
    }
});
// Call the function
feedURLFun();


async function passkeySaveFun() {
    let checkbox = document.querySelector('#passkeySvae');
    if (checkbox.checked) {
        window.localStorage.setItem('SavePasskey', true)
        // saveJsonObject(FileContent, 'passwords.json')
        if(passkey != 'undefined' && passkey2 != 'undefined' && passkey != undefined && passkey2 != undefined) {
            let encryptPasskey1 = await encrypt(passkey, EnPasskeyCode, CPU_HArdwareNum);
            let encryptPasskey2 = await encrypt(passkey2, EnPasskeyCode, CPU_HArdwareNum);

            let EnPasskeys = {passkey1: encryptPasskey1, passkey2: encryptPasskey2}
            
            saveJsonObject(EnPasskeys, 'passkey.json')
        }
        alert('Now your passkey will load with the app')
    } else {
        window.localStorage.setItem('SavePasskey', false)
        deleteJsonFile('passkey.json')
    }
}

async function createiv() {
    if(newpasskey.value.length > 4) {
        passkey = newpasskey.value;
        let cryptoiven =  crypto.getRandomValues(new Uint8Array(12));
        let criptoiv = base64Encode(String.fromCharCode(...cryptoiven));
        // console.log(criptoiv, cryptoiven)
        FileContent = {}
        passkey2 = criptoiv;
    
        createMenu.style.display = 'none'
        ivSH(criptoiv);
        if(window.localStorage.getItem('SavePasskey') == 'true' && CPU_HArdwareNum != '' && EnPasskeyCode != '') {
            // Encript passkeys
            let encryptPasskey1 = await encrypt(passkey, EnPasskeyCode, CPU_HArdwareNum);
            let encryptPasskey2 = await encrypt(passkey2, EnPasskeyCode, CPU_HArdwareNum);

            let EnPasskeys = {passkey1: encryptPasskey1, passkey2: encryptPasskey2}
            
            saveJsonObject(EnPasskeys, 'passkey.json')
        }
        onblur();
    } else {
        alert('Enter passkey')
    }
}