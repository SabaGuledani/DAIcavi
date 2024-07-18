

// // Define the image URL that will replace non-kid-friendly images
const our_img = "https://scontent.ftbs4-2.fna.fbcdn.net/v/t1.15752-9/448246218_985912189453707_1757945167008187774_n.png?stp=dst-png_p403x403&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=fswzvaYbtecQ7kNvgHglDBE&_nc_ht=scontent.ftbs4-2.fna&oh=03_Q7cD1QG0bHTWeG9mohH8aaoeNyN9CCN3ltGDvsmlcSQsiME0Ow&oe=669E67A7";
const blur = "https://scontent.ftbs5-2.fna.fbcdn.net/v/t1.15752-9/448555961_950446383546582_2624276174024852565_n.png?_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeEfpNCdQixYhbhdIDg41gWdla3FhJWJrLuVrcWElYmsu3Il_fqoLVoVS6kwUcuIlqOOp_V2BN4ELAHthuom4DFh&_nc_ohc=yTkQWc_eOv0Q7kNvgGwkmwY&_nc_ht=scontent.ftbs5-2.fna&oh=03_Q7cD1QF7xTl_K2YjOhLtAkV3Ta6pPBhPUNeLy_Qz7lfo9gt3mQ&oe=669FCA92";

// function to check if image is kid friendly
function checkImageContentjs(data, img, originalSrc){

  if (data[originalSrc]) {
          
    if (data[originalSrc] === 1) { 
      return  our_img; // If the src is already evaluated and marked as porn, hide the image
    }
  } else {
         
    

    // Send a message to background.js to check if the original image is kid-friendly
    chrome.runtime.sendMessage({ action: 'checkImage', src: originalSrc }, (response) => {
        
        if (!response.kidFriendly) {
          return originalSrc;  // If the image is kid-friendly, replace it with our_img
        } else {
            
          return our_img; // If the image is not kid-friendly, restore the original image source
        }
    });
  }
        

}
function isResponseNotOk(response){
  if (!response.ok) {
    throw new Error('Network response was not ok ' + response.statusText);
  }
}
// Function to replace images on page load
function replaceImages() {
    
    const images = document.querySelectorAll('img'); // Select all <img> elements on the page
    
   
    images.forEach((img) => { // Iterate over each image

        
        const originalSrc = img.src; // Store the original image source
        
        fetch(chrome.runtime.getURL('images.json')).then(response => { // fetch json containing already evaluated images

          isResponseNotOk(response);

          return response.json();
      }).then(data => {
        
        img.style.display = blur // Set image source to a placeholder (or empty string) initially

        img.src = checkImageContentjs(data, img, originalSrc);
        
        

      }).catch(error => {
        console.error('Error fetching or parsing JSON file:', error);
      });
        
    });
}



// // Define the image URL that will replace non-kid-friendly images
const our_link = chrome.runtime.getURL('mascot_html.html');
function checkLinkContentJs(originalLink){
  
  if (originalLink.startsWith('http://') || originalLink.startsWith('https://')) {
    chrome.runtime.sendMessage({ action: 'checkLink', href: originalLink }, (response) => {
        if (!response.kidFriendly) {
            return originalLink;
        }
        else {
          return our_link;
        }
    });


  }
}

function replaceLinks() {
  // select all link tags
    const links = document.querySelectorAll('a');

    links.forEach((a) => {
        const originalLink = a.href;

        fetch(chrome.runtime.getURL('links.json')).then(response => {
          // check if response was not ok
          isResponseNotOk(response);
          return response.json();
        
      }).then(data => {
        // Check if src is in the fetched data
        if (data[originalLink]) {
          // If the src is already evaluated and marked as porn, hide the image
          if (data[originalLink] === 1) {
            a.href = our_link;
          }

        } else {
          a.href = checkLinkContentJs(originalLink);
          
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
  