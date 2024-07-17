chrome.runtime.onInstalled.addListener(() => {
    console.log('Image Replacer extension installed.');
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'checkImage') {
        const imageUrl = message.src;

        // Make an API request to the AI service to check if the image is kid-friendly
        fetch('http://127.0.0.1:5000/api/src_url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageUrl: imageUrl })
        })
            .then(response => response.json())
            .then(data => {
                const isKidFriendly = data[imageUrl];
                sendResponse({ kidFriendly: isKidFriendly });
            })
            .catch(error => {
                console.error('Error checking image:', error);
                sendResponse({ kidFriendly: false });
            });

        return true; // Keep the message channel open for sendResponse
    }
});





chrome.runtime.onInstalled.addListener(() => {
    console.log('Image Replacer extension installed.');
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'checkLink') {
        const linkUrl = message.href;

        // Make an API request to the AI service to check if the image is kid-friendly
        fetch('http://127.0.0.1:5000/api/links', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ linkUrl: linkUrl })
        })
            .then(response => response.json())
            .then(data => {
                const isKidFriendly = data[linkUrl];
                sendResponse({ kidFriendly: isKidFriendly });
            })
            .catch(error => {
                console.error('Error checking url:', error);
                sendResponse({ kidFriendly: false });
            });

        return true; // Keep the message channel open for sendResponse
    }
});





