// Image URLs for replacing non-kid-friendly content
const SAFE_IMAGE_URL = "https://scontent.ftbs4-2.fna.fbcdn.net/v/t1.15752-9/448246218_985912189453707_1757945167008187774_n.png?stp=dst-png_p403x403&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=fswzvaYbtecQ7kNvgHglDBE&_nc_ht=scontent.ftbs4-2.fna&oh=03_Q7cD1QG0bHTWeG9mohH8aaoeNyN9CCN3ltGDvsmlcSQsiME0Ow&oe=669E67A7";
const BLUR_IMAGE_URL = "https://scontent.ftbs5-2.fna.fbcdn.net/v/t1.15752-9/448555961_950446383546582_2624276174024852565_n.png?_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeEfpNCdQixYhbhdIDg41gWdla3FhJWJrLuVrcWElYmsu3Il_fqoLVoVS6kwUcuIlqOOp_V2BN4ELAHthuom4DFh&_nc_ohc=yTkQWc_eOv0Q7kNvgGwkmwY&_nc_ht=scontent.ftbs5-2.fna&oh=03_Q7cD1QF7xTl_K2YjOhLtAkV3Ta6pPBhPUNeLy_Qz7lfo9gt3mQ&oe=669FCA92";
const SAFE_PAGE_URL = chrome.runtime.getURL('mascot_html.html');

// Helper function to check response status
function validateResponse(response) {
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
}

// Check if image is kid friendly
function checkImage(data, originalSrc) {
    if (data[originalSrc] && data[originalSrc] === 1) {
        return SAFE_IMAGE_URL;
    }

    chrome.runtime.sendMessage({ action: 'checkImage', src: originalSrc }, (response) => {
        return response.kidFriendly ? SAFE_IMAGE_URL : originalSrc;
    });
}

// Replace images with safe alternatives if needed
function replaceImages() {
    const images = document.querySelectorAll('img');

    images.forEach((img) => {
        const originalSrc = img.src;

        fetch(chrome.runtime.getURL('images.json'))
            .then(response => {
                validateResponse(response);
                return response.json();
            })
            .then(data => {
                img.style.display = BLUR_IMAGE_URL;
                img.src = checkImage(data, originalSrc);
            })
            .catch(error => {
                console.error('Error processing image:', error);
            });
    });
}

// Check if link is kid friendly
function checkLink(originalLink) {
    if (originalLink.startsWith('http://') || originalLink.startsWith('https://')) {
        chrome.runtime.sendMessage({ action: 'checkLink', href: originalLink }, (response) => {
            return response.kidFriendly ? SAFE_PAGE_URL : originalLink;
        });
    }
}

// Replace links with safe alternatives if needed
function replaceLinks() {
    const links = document.querySelectorAll('a');

    links.forEach((link) => {
        const originalLink = link.href;

        fetch(chrome.runtime.getURL('links.json'))
            .then(response => {
                validateResponse(response);
                return response.json();
            })
            .then(data => {
                if (data[originalLink] && data[originalLink] === 1) {
                    link.href = SAFE_PAGE_URL;
                } else {
                    link.href = checkLink(originalLink);
                }
            })
            .catch(error => {
                console.error('Error processing link:', error);
            });
    });
}

// Debounce helper to limit function calls
function debounce(func, wait) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(func, wait);
    };
}

const debouncedReplaceImages = debounce(replaceImages, 500);
const debouncedReplaceLinks = debounce(replaceLinks, 1500);

// Initialize content filtering
(function() {
    const observer = new MutationObserver(() => {
        debouncedReplaceImages();
        debouncedReplaceLinks();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    replaceImages();
    window.addEventListener('load', replaceLinks);
})();