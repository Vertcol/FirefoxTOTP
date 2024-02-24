'use strict';

async function base32Decode(encoded) {
    const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let paddingCount = 0;
    encoded = encoded.toUpperCase();

    if (encoded.endsWith('=')) {
        paddingCount = [...encoded].reduceRight((acc, char) => (char === '=' ? acc + 1 : acc), 0);
        encoded = encoded.substring(0, encoded.length - paddingCount); // Remove padding
    }

    let bits = '';
    let bytes = [];

    for (let i = 0; i < encoded.length; i++) {
        const val = base32Chars.indexOf(encoded[i]);
        bits += val.toString(2).padStart(5, '0');
    }

    for (let i = 0; i < bits.length; i += 8) {
        const byte = bits.substring(i, i + 8);
        if (byte.length === 8) {
            bytes.push(parseInt(byte, 2));
        }
    }

    return new Uint8Array(bytes);
}

async function generateTOTP(secret) {
    
    const key = secret; // Placeholder, replace with actual byte array conversion
    const epoch = Math.round(new Date().getTime() / 1000.0);
    const timeStep = 30; // Standard TOTP time step
    const counter = Math.floor(epoch / timeStep);
    
    const counterBuffer = new ArrayBuffer(8);
    const counterView = new DataView(counterBuffer);
    counterView.setUint32(4, counter); // TOTP uses a 64-bit integer, but JavaScript's bitwise operations are 32-bit
    
    const cryptoKey = await window.crypto.subtle.importKey(
        "raw",
        key,
        { name: "HMAC", hash: { name: "SHA-1" } },
        false,
        ["sign"]
    );
    
    const signature = await window.crypto.subtle.sign(
        "HMAC",
        cryptoKey,
        counterBuffer
    );
    
    const offset = new Uint8Array(signature).slice(-1)[0] & 0xf;
    const token = new DataView(signature.slice(offset, offset + 4)).getUint32(0) & 0x7fffffff;
    const otp = token % 1000000; // Adjust the modulus depending on the desired length of the OTP
    
    return otp.toString().padStart(6, '0'); // Ensure the OTP is 6 characters long
}

const otp_secret = base32Decode('SECRET');

document.addEventListener('DOMContentLoaded', async function() {
    generateTOTP(await otp_secret).then(otp => {
        document.getElementById('totpButton').textContent = otp;
    });
});

document.getElementById('totpButton').addEventListener('click', async function() {
    generateTOTP(await otp_secret).then(otp => {
        navigator.clipboard.writeText(otp);
    });
});




  