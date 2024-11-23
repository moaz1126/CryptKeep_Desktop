async function getKeyMaterial(passkey) {
    const enc = new TextEncoder();
    return crypto.subtle.importKey(
        'raw',
        enc.encode(passkey),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );
}

async function getCryptoKey(keyMaterial) {
    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: new Uint8Array(16),
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 }, // AES key length
        false,
        ['encrypt', 'decrypt']
    );
}

function base64Encode(input) {
    return btoa(input);
}

function base64Decode(input) {
    return atob(input);
}


async function encryptText(text, passkey) {
    const keyMaterial = await getKeyMaterial(passkey);
    const key = await getCryptoKey(keyMaterial);

    const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
    const encrypted = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        key,
        new TextEncoder().encode(text)
    );

    return {
        iv: base64Encode(String.fromCharCode(...iv)),
        encryptedData: base64Encode(String.fromCharCode(...new Uint8Array(encrypted)))
    };
}

async function encryptText(text, passkey, fixedIV) {
    const keyMaterial = await getKeyMaterial(passkey);
    const key = await getCryptoKey(keyMaterial);

    const iv = fixedIV || crypto.getRandomValues(new Uint8Array(12)); // Use the provided fixed IV or generate a new one
    const encrypted = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        key,
        new TextEncoder().encode(text)
    );

    return {
        iv: base64Encode(String.fromCharCode(...iv)),
        encryptedData: base64Encode(String.fromCharCode(...new Uint8Array(encrypted)))
    };
}

async function decryptText(encryptedData, passkey, iv) {
    const keyMaterial = await getKeyMaterial(passkey);
    const key = await getCryptoKey(keyMaterial);

    const decrypted = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: new Uint8Array(base64Decode(iv).split('').map(char => char.charCodeAt(0)))
        },
        key,
        new Uint8Array(base64Decode(encryptedData).split('').map(char => char.charCodeAt(0)))
    );

    return new TextDecoder().decode(decrypted);
}


async function decrypt(encryptedData, passkey, iv) {
    try {
        const decrypted = await decryptText(encryptedData, passkey, iv);
        return decrypted
    } catch (error) {
        console.error('Decryption failed:', error);
        alert('Wrong passkey')
        window.location.reload();
    }
};

function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function encrypt(text, passkey, iv) {

    if(iv) {
        try {
            const encrypted = await encryptText(text, passkey, base64ToArrayBuffer(iv));
            return encrypted.encryptedData
        } catch (error) {
            console.error('Encryption failed:', error);
        }
    } else { 
        try {
            const encrypted = await encryptText(text, passkey);
            return encrypted.encryptedData
        } catch (error) {
            console.error('Encryption failed:', error);
        }
    }
};


