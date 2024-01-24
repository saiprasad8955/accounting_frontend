import CryptoJS from 'crypto-js';

const secretKey = process.env.REACT_APP_ENCRYPT_TOKEN_SECRET_KEY;
const iv = CryptoJS.enc.Hex.parse('0123456789abcdef');

export function getDeviceMake() {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.indexOf('windows') !== -1) {
        return 'Windows';
    }

    if (userAgent.indexOf('mac') !== -1) {
        return 'Apple';
    }

    if (userAgent.indexOf('linux') !== -1) {
        return 'Linux';
    }

    if (userAgent.indexOf('android') !== -1) {
        return 'Android';
    }

    if (userAgent.indexOf('iphone') !== -1 || userAgent.indexOf('ipad') !== -1 || userAgent.indexOf('ipod') !== -1) {
        return 'Apple';
    }

    return 'Unknown';
}

export function getDevicePlatform() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('win') !== -1) {
        return 'Windows';
    }
    if (userAgent.indexOf('mac') !== -1) {
        return 'Mac';
    }
    if (userAgent.indexOf('linux') !== -1) {
        return 'Linux';
    }
    if (userAgent.indexOf('android') !== -1) {
        return 'Android';
    }
    if (userAgent.indexOf('iphone') !== -1 || userAgent.indexOf('ipad') !== -1 || userAgent.indexOf('ipod') !== -1) {
        return 'iOS';
    }
    return 'Unknown';

}

export const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Format the date part
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

    // Format the day of the week
    const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);

    // Format the time
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    return `${formattedDate}, ${dayOfWeek}, ${time}`;
};

// Encrypt function
export const encryptToken = (data) => {
    const encrypted = CryptoJS.AES.encrypt(data, secretKey, { iv });
    return encrypted.toString();
};

// Decrypt function
export const decryptToken = (encryptedData) => {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, secretKey, { iv });
    return decrypted.toString(CryptoJS.enc.Utf8);
};

export const states = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
];


export function generateOfferCode() {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let offerCode = '';

    for (let i = 0; i < 5; i += 1) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        offerCode += characters.charAt(randomIndex);
    }

    return offerCode;
}