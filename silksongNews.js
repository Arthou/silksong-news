// ==UserScript==
// @name        Silksong News Push
// @namespace   Violentmonkey Scripts
// @match       *://www.reddit.com/r/Silksong*
// @grant       none
// @version     1.0
// @author      u/thouts
// @description Get notified when a Silksong News flair pops up on r/silksong
// ==/UserScript==

(function() {
    'use strict';

    // Define the possible values for {DDD} and their associated values for {AAA}, {BBB}, and {CCC}
    const flairOptions = {
        'Silksong News!': {
            AAA: 'https://www.reddit.com/r/Silksong/?f=flair_name%3A%22%3Aclown%3ASilksong%20News!%22',  // Example fixed value for {AAA} when {DDD} is "Silksong News"
            BBB: '#FFD635',  // Example fixed value for {BBB} when {DDD} is "Silksong News"
            CCC: 'https://emoji.redditmedia.com/fc7ip9dqz8kb1_t5_4viev2/clown',  // Example fixed value for {CCC} when {DDD} is "Silksong News"
        },
        'Silksong hype!': {
            AAA: 'https://www.reddit.com/r/Silksong/?f=flair_name%3A%22%3Ascream-hornet%3ASilksong%20hype!%22',  // Example fixed value for {AAA} when {DDD} is "Silksong Hype"
            BBB: '#EA0027',  // Example fixed value for {BBB} when {DDD} is "Silksong Hype"
            CCC: 'https://emoji.redditmedia.com/1a4og3ejz8kb1_t5_4viev2/scream-hornet',  // Example fixed value for {CCC} when {DDD} is "Silksong Hype"
        },
        'Silkpost': {
            AAA: 'https://www.reddit.com/r/Silksong/?f=flair_name%3A%22%3Atroll%3ASilkpost%22',  // Example fixed value for {AAA} when {DDD} is "Silkpost"
            BBB: '#FF4500',  // Example fixed value for {BBB} when {DDD} is "Silkpost"
            CCC: 'https://emoji.redditmedia.com/mngg5jtrxdkb1_t5_4viev2/troll',  // Example fixed value for {CCC} when {DDD} is "Silkpost"
        }
    };

    // Set of elements whose flair has been changed to prevent re-changing
    let changedFlairs = new Set();

    // Function to randomly choose a flair option and update {AAA}, {BBB}, and {CCC}
    function getRandomFlairOption() {
        const options = Object.keys(flairOptions);
        const randomIndex = Math.floor(Math.random() * options.length);
        return options[randomIndex];
    }

    // Function to change flair
    function changeFlair() {
        // Find all posts
        const posts = document.querySelectorAll('shreddit-post[permalink]');  // Select all post articles

        posts.forEach(post => {
            // Find the flair element within the post
            const flairLink = post.querySelector('a.no-decoration');  // Find the link that holds the flair
            const flairSpan = flairLink ? flairLink.querySelector('span') : null; // Find the span that contains the flair text

            if (flairSpan) {
                // Extract the flair text from the span
                const flairText = flairSpan.textContent.trim();

                // Check if the flair matches one of the values we want to change (Silksong News!, Silksong hype!, or Silkpost)
                if (flairText === 'Silksong News!' || flairText === 'Silksong hype!' || flairText === 'Silkpost') {
                    // Ensure this post hasn't been changed already
                    if (!changedFlairs.has(post)) {
                        // Randomly choose a new flair option from the available ones
                        const newFlairText = getRandomFlairOption();

                        // Get the associated values for {AAA}, {BBB}, and {CCC} for the chosen flair
                        const { AAA, BBB, CCC } = flairOptions[newFlairText];

                        // Set new link for the flair
                        if (flairLink) {
                          flairLink.setAttribute('href', AAA);
                        }

                        // Update the flair contents
                        flairSpan.textContent = newFlairText;

                        // Update {BBB} as background color
                        const flairSpanStyle = flairSpan.style;
                        flairSpanStyle.backgroundColor = BBB;

                        // Update the flair image (custom <faceplate-img>)
                        const html_pt1 = '<div class="flair-content [&amp;_.flair-image]:align-bottom max-w-full overflow-hidden whitespace-nowrap text-ellipsis"><div id="-post-rtjson-content" class="max-w-full overflow-hidden whitespace-nowrap text-ellipsis" style="--emote-size: 20px">'
                        const html_pt2 = '<faceplate-img class="flair-image object-contain" loading="lazy" width="16" height="16" src= ' + CCC + ' ></faceplate-img> ' + newFlairText;
                        flairSpan.innerHTML = html_pt1 + html_pt2 + '</div></div>'

                        changedFlairs.add(post);
                    }
                }
            }
        });
    }

    // Function to observe when new content is loaded
    function initMutationObserver() {
        const observer = new MutationObserver(() => {
            changeFlair();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize and run the script
    function init() {
        changeFlair();  // Run immediately to change any flairs already loaded
        initMutationObserver();  // Set up the observer to detect new content
    }

    // Start the script
    init();
})();