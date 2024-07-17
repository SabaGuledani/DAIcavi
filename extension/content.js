

// // Define the image URL that will replace non-kid-friendly images
const our_img = "https://scontent.ftbs4-2.fna.fbcdn.net/v/t1.15752-9/448246218_985912189453707_1757945167008187774_n.png?stp=dst-png_p403x403&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=fswzvaYbtecQ7kNvgHglDBE&_nc_ht=scontent.ftbs4-2.fna&oh=03_Q7cD1QG0bHTWeG9mohH8aaoeNyN9CCN3ltGDvsmlcSQsiME0Ow&oe=669E67A7";
const blur = "https://scontent.ftbs5-2.fna.fbcdn.net/v/t1.15752-9/448555961_950446383546582_2624276174024852565_n.png?_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeEfpNCdQixYhbhdIDg41gWdla3FhJWJrLuVrcWElYmsu3Il_fqoLVoVS6kwUcuIlqOOp_V2BN4ELAHthuom4DFh&_nc_ohc=yTkQWc_eOv0Q7kNvgGwkmwY&_nc_ht=scontent.ftbs5-2.fna&oh=03_Q7cD1QF7xTl_K2YjOhLtAkV3Ta6pPBhPUNeLy_Qz7lfo9gt3mQ&oe=669FCA92";

// Function to replace images on page load
function replaceImages() {
    // Select all <img> elements on the page
    const images = document.querySelectorAll('img');
    
    // Iterate over each image
    images.forEach((img) => {

        // Store the original image source
        const originalSrc = img.src;
        // fetch json containing already evaluated images
        fetch(chrome.runtime.getURL('images.json'))
        .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      }).then(data => {
        // Check if src is in the fetched data
        console.log("aqamde movida");
        if (data[originalSrc]) {
          // If the src is already evaluated and marked as porn, hide the image
          if (data[originalSrc] === 1) {
            img.src = our_img;
          }
        } else {
            // Set image source to a placeholder (or empty string) initially
            img.style.display = blur

            // Send a message to background.js to check if the original image is kid-friendly
            chrome.runtime.sendMessage({ action: 'checkImage', src: originalSrc }, (response) => {
                // If the image is not kid-friendly, restore the original image source
                if (!response.kidFriendly) {
                    img.src = originalSrc;
                } else {
                    // If the image is kid-friendly, replace it with our_img
                    img.src = our_img;
                }
            });
        }
      }).catch(error => {
        console.error('Error fetching or parsing JSON file:', error);
      });
        
        

        
        
    });
}


// // Define the image URL that will replace non-kid-friendly images
// const our_link = "http://www.savewalterwhite.com/";
const our_link = chrome.runtime.getURL('mascot_html.html');

function replaceLinks() {
    const links = document.querySelectorAll('a');

    links.forEach((a) => {
        const originalLink = a.href;
        fetch(chrome.runtime.getURL('links.json'))
        .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      }).then(data => {
        // Check if src is in the fetched data
        console.log("aqamde movida 2 ");
        if (data[originalLink]) {
          // If the src is already evaluated and marked as porn, hide the image
          if (data[originalLink] === 1) {
            a.href = our_link;
          }
        } else {
          if (originalLink.startsWith('http://') || originalLink.startsWith('https://')) {
            chrome.runtime.sendMessage({ action: 'checkLink', href: originalLink }, (response) => {
                if (!response.kidFriendly) {
                    a.href = originalLink;
                }
                else {
                    a.href = our_link;
                }
            });


        }
        }
      }).catch(error => {
        console.error('Error fetching or parsing JSON file:', error);
      });

        

    });
}

window.addEventListener('load', replaceLinks);



function debounce(func, wait) {
    let timeout;
    return function() {
      clearTimeout(timeout);
      timeout = setTimeout(func, wait);
    };
  }

  // Create a debounced version of replaceImages with a 500ms delay
  const debouncedReplaceImages= debounce(replaceImages, 500);
  const debouncedReplaceLinks = debounce(replaceLinks, 1500);

// content.js
(function() {
  
    // Observe changes in the entire body of the document
    const observer = new MutationObserver((mutations) => {
        console.log('Mutation observed:', mutations);
        debouncedReplaceImages();
        debouncedReplaceLinks();
    });
  
    // Configuration of the observer
    const config = { childList: true, subtree: true };
  
    // Start observing the document body
    observer.observe(document.body, config);
  
    // Initial check for existing images on page load
    replaceImages();
  })();
  