// Global initialization flag
let buttonsInitialized = false;

// Your prompt template
const promptTemplate = `I want you to act as a market research expert that speaks and writes fluent [slanguage]. You have the most accurate and detailed information about keywords available. You are able to develop a full SEO content plan in fluent [slanguage]. I will give you the target keyword [keyword]. From this keyword create a markdown table with a keyword list for an SEO content strategy plan on the topic [keyword]. Cluster the keywords according to the top 10 super categories and name the super category in the first column called keyword cluster. For each cluster add in another column and generate [count] specific long-tail keywords for each of the clusters.  List in another column the human searcher intent for the keyword. Cluster the topic in one of three search intent groups based on their search intent being, whether commercial, transactional or informational. Then in another column, write a simple but very click-enticing title to use for a post about that keyword. Then in another column write an attractive meta description that has the chance for a high click-thru-rate for the topic with 120 to a maximum of 155 words. The meta description shall be value based, so mention value of the article and have a simple call to action to cause the searcher to click. Do NOT under any circumstance use too generic keyword like 'introduction' or 'conclusion' or 'tldr'. Focus on the most specific keywords. Do not use single quotes, double quotes or any other enclosing characters in any of the columns you fill in. Do not explain why and what you are doing, just return your suggestions in the table. The markdown table shall be in [slanguage] language and have the following columns: keyword cluster, keyword, search intent, title, meta description. Here is the keyword to start again: [keyword]. Do not add any disclaimers or additional text after the table.`;

// New prompt template for the Outrank feature
const outrankPromptTemplate = `You are an expert SEO content writer. Your task is to create a comprehensive, high-quality article that outranks the content at the following URL: [URL]. Follow these steps:

1. Analyze the content at the given URL, focusing on:
   - Main topic and subtopics covered
   - Article structure and headings
   - Key points and arguments made
   - Word count and depth of coverage
   - Use of keywords and phrases

2. Identify gaps, weaknesses, or areas for improvement in the existing content.

3. Create an outline for a new article that covers the same topic but improves upon the original by:
   - Including additional relevant subtopics
   - Providing more in-depth information
   - Using a more logical and user-friendly structure
   - Incorporating current data and statistics
   - Addressing common user questions not covered in the original

4. Write a comprehensive article based on your outline. Ensure that your content:
   - Is at least 10-20% longer than the original
   - Uses clear, engaging language suitable for the target audience
   - Incorporates relevant keywords naturally throughout the text
   - Include link url to authoritative sources in the article for added credibility
   - Includes meta title and description suggestions
   - Provides actionable insights or advice where appropriate
   - Uses subheadings (H2, H3) to improve readability and structure

5. Suggest 2-3 internal linking opportunities within the article.

6. Ensure you include 3-5 external URL's as authoritative sources in the article for added credibility.

Remember, the goal is to create content that is noticeably better and more valuable to readers than the original, while still being optimized for search engines. Write in a [TONE] tone and use transition words and active voice throughout. Do not start by repeating instructions, start with article title.

URL to analyze and outrank: [URL]
Tone: [TONE]`;

// New prompt template for the Internal Link Optimizer
const internalLinkOptimizerPrompt = `As an AI-powered SEO expert, analyze the following text and suggest relevant internal links based on the provided list of internal URLs. Focus on the context and topic of both the source text and the target URLs.

Text to analyze:
[TEXT]

Available internal URLs:
[URLS]

Analyze the text and URLs, then insert relevant internal links directly into the analyzed text. For each inserted link:
1. Use existing anchor text from the original content or create new contextually appropriate phrases.
2. Ensure the link adds value and relates to the surrounding content.
3. Prioritize linking to cornerstone or pillar content when relevant.

After inserting the links, provide a summary of the changes made:
1. List each inserted link, including the anchor text and URL.
2. Explain why each link is relevant (max 30 words per explanation).
3. If new text was added to accommodate a link, highlight this addition.

Ensure your suggestions follow SEO best practices:
- Use descriptive anchor text that includes target keywords for the linked page.
- Vary anchor text to avoid over-optimization, using synonyms where appropriate.
- Integrate links seamlessly without disrupting the flow of information.
- Avoid redundant links to the same page.

Format your response as follows:

Modified Text:
[INSERTED_LINK_TEXT]

Link Summary:
1. Anchor text: [ANCHOR_TEXT]
   URL: [URL]
   Relevance: [BRIEF_EXPLANATION]
   (New text added: [YES/NO])

2. ...

3. ...


If no relevant internal links can be inserted, respond with: "No relevant internal links found for the given text."`;
// Function to add the buttons
function addButtons() {
    try {
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'seo-button-container';

        const toggleButton = createButton('▶', 'toggle-seo-buttons', toggleSEOButtons);
        buttonContainer.appendChild(toggleButton);

        const seoButtonsContainer = document.createElement('div');
        seoButtonsContainer.id = 'seo-buttons-container';
        seoButtonsContainer.style.display = 'none'; // Initially hidden

        const seoStrategyButton = createButton('Strategy Builder', 'seo-prompt-button', showKeywordInput);
        const seoBlogButton = createButton('Blog Writer', 'seo-blog-button', showBlogInput);
        const outrankButton = createButton('Outrank', 'outrank-button', showOutrankInput);
        const internalLinkOptimizerButton = createButton('Internal Link Optimizer', 'internal-link-optimizer-button', showInternalLinkOptimizerDialog);

        seoButtonsContainer.appendChild(seoStrategyButton);
        seoButtonsContainer.appendChild(seoBlogButton);
        seoButtonsContainer.appendChild(outrankButton);
        seoButtonsContainer.appendChild(internalLinkOptimizerButton);

        buttonContainer.appendChild(seoButtonsContainer);

        // Try multiple selectors to find the input area
        const selectors = [
            'div[class^="ProseMirror"]',
            'div[contenteditable="true"]',
            'div[role="textbox"]',
            'textarea',
            'div.chat-input-panel textarea',
            'div.chat-input-panel div[contenteditable]',
            '#prompt-textarea' // Add this selector for OpenAI Chat
        ];

        let inputArea;
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                inputArea = elements[elements.length - 1]; // Get the last matching element
                console.log(`Found input area using selector: ${selector}`);
                break;
            }
        }

        if (inputArea?.parentNode) {
            inputArea.parentNode.insertBefore(buttonContainer, inputArea);
            console.log("SEO buttons added above input area");
        } else {
            console.error("Input area not found. Buttons not added.");
        }
    } catch (error) {
        console.error("Error in addButtons:", error);
    }
}

function createButton(text, id, clickHandler) {
    const button = document.createElement('button');
    button.textContent = text;
    button.id = id;
    button.addEventListener('click', (event) => {
        event.stopPropagation();
        clickHandler();
    });
    return button;
}

function toggleSEOButtons() {
    const seoButtonsContainer = document.getElementById('seo-buttons-container');
    const toggleButton = document.getElementById('toggle-seo-buttons');
    if (seoButtonsContainer && toggleButton) {
        if (seoButtonsContainer.style.display === 'flex') {
            seoButtonsContainer.style.display = 'none';
            toggleButton.textContent = '▶';
            toggleButton.classList.remove('active');
        } else {
            seoButtonsContainer.style.display = 'flex';
            toggleButton.textContent = '▼';
            toggleButton.classList.add('active');
        }
    }
}
// Function to show keyword input dialog
function showKeywordInput() {
    if (currentDialogType !== 'internalLinkOptimizer') {
        closeExistingDialog();
    }
    currentDialogType = 'keywordInput';
    const dialog = document.createElement('div');
    dialog.id = 'keyword-dialog';
    dialog.innerHTML = `
        <p>Enter keyword, select keywords/cluster & language:</p>
        <div class="input-container">
            <input type="text" id="keyword-input" placeholder="Enter keyword">
        </div>
        <div> 
            <select id="count-select">
                <option value="1" selected>1 keyword</option>
                <option value="3">3 keywords</option>
                <option value="5">5 keywords</option>
                <option value="8">8 keywords</option>
                <option value="10">10 keywords</option>
            </select>
            <select id="slanguage-select">
                <option value="English" selected>English</option>
                <option value="Arabic">Arabic</option>
                <option value="Dutch">Dutch</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Hindi">Hindi</option>
                <option value="Hungarian">Hungarian</option>  
                <option value="Indonesian">Indonesian</option>  
                <option value="Italian">Italian</option>
                <option value="Korean">Korean</option> 
                <option value="Latvian">Latvian</option>       
                <option value="Urdu">Urdu</option>                
                <option value="Spanish">Spanish</option>
                <option value="Slovenian">Slovenian</option>
                <option value="Swedish">Swedish</option>
                <option value="Thai">Thai</option>   
            </select>                  
        </div>
        <button id="submit-keyword">Submit</button>
    `;
    
    const button = document.getElementById('seo-prompt-button');
    const rect = button.getBoundingClientRect();
    dialog.style.position = 'fixed';
    dialog.style.bottom = `${window.innerHeight - rect.top + window.scrollY}px`;
    dialog.style.left = `${rect.left + window.scrollX}px`;
    
    document.body.appendChild(dialog);

    document.getElementById('submit-keyword').addEventListener('click', submitPrompt);
    document.addEventListener('click', closeDialogOnClickOutside);
}

// Function to close dialog on click outside with dialog type check
function closeDialogOnClickOutside(event) {
    const dialog = document.getElementById('keyword-dialog');
    if (dialog && !dialog.contains(event.target) && 
        event.target.id !== 'seo-prompt-button' && 
        event.target.id !== 'seo-blog-button' &&
        event.target.id !== 'outrank-button' &&
        event.target.id !== 'internal-link-optimizer-button') {
        
        // Only close if the current dialog is not Internal Link Optimizer
        if (currentDialogType !== 'internalLinkOptimizer') {
            closeDialog();
        }
    }
}

function closeExistingDialog() {
    const existingDialog = document.getElementById('keyword-dialog');
    if (existingDialog && currentDialogType !== 'internalLinkOptimizer') {
        closeDialog();
    }
}


// Function to close the dialog (single definition)
function closeDialog() {
    const dialog = document.getElementById('keyword-dialog');
    if (dialog) {
        dialog.remove();
        // Remove listeners based on dialog type
        if (currentDialogType === 'internalLinkOptimizer') {
            document.removeEventListener('selectionchange', updateSelectedText);
        } else {
            document.removeEventListener('click', closeDialogOnClickOutside);
        }
        currentDialogType = null;
    }
}

// Function to submit the prompt
function submitPrompt() {
    try {
        const keyword = document.getElementById('keyword-input')?.value || '';
        const count = document.getElementById('count-select')?.value || '1';
        const slanguage = document.getElementById('slanguage-select')?.value || 'English';
        const fullPrompt = promptTemplate
            .replace(/\[keyword\]/g, keyword)
            .replace(/\[slanguage\]/g, slanguage)
            .replace(/\[count\]/g, count);
        
        const inputField = getInputField();
        if (inputField) {
            setInputFieldValue(inputField, fullPrompt);
            console.log("Prompt added to input field. Please review and press 'Send' when ready.");
        } else {
            console.error("Input field not found");
        }
        
        closeDialog();
    } catch (error) {
        console.error("Error in submitPrompt:", error);
    }
}

function getInputField() {
    return document.querySelector('div[class^="ProseMirror"]') || 
           document.querySelector('div[contenteditable="true"]') ||
           document.querySelector('div[role="textbox"]') ||
           document.querySelector('textarea') ||
           document.querySelector('#prompt-textarea');
}

function setInputFieldValue(inputField, value) {
    if (inputField.tagName.toLowerCase() === 'textarea') {
        inputField.value = value;
    } else {
        inputField.textContent = value;
    }
    
    ['input', 'change', 'blur'].forEach(eventType => {
        inputField.dispatchEvent(new Event(eventType, { bubbles: true }));
    });
}

// Function to show the blog input form// Function to show the blog input form
function showBlogInput() {
    if (currentDialogType !== 'internalLinkOptimizer') {
        closeExistingDialog();
    }
    currentDialogType = 'blogInput';
    const dialog = document.createElement('div');
    dialog.id = 'keyword-dialog';
    dialog.innerHTML = `
        <p>Enter blog title, select tone & language:</p>
        <div class="input-container">
            <input type="text" id="blog-title-input" placeholder="Enter blog title">
        </div>
        <div class="select-container">
            <select id="tone-select">
                <option value="Business">Business</option>
                <option value="Friendly">Friendly</option>
                <option value="Casual">Casual</option>
            </select>
            <select id="blanguage-select">
                <option value="English" selected>English</option>
                <option value="Arabic">Arabic</option>
                <option value="Dutch">Dutch</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Hindi">Hindi</option>
                <option value="Hungarian">Hungarian</option>  
                <option value="Indonesian">Indonesian</option>  
                <option value="Italian">Italian</option>
                <option value="Korean">Korean</option> 
                <option value="Latvian">Latvian</option>       
                <option value="Urdu">Urdu</option>                
                <option value="Spanish">Spanish</option>
                <option value="Slovenian">Slovenian</option>
                <option value="Swedish">Swedish</option>
                <option value="Thai">Thai</option>   
             </select>
        </div>
        <textarea id="site-urls-input" placeholder="Paste a list of URLs from your site for internal linking" rows="4"></textarea>
        <textarea id="nlp-keywords-input" placeholder="Enter NLP keywords (one per line)" rows="4"></textarea>
        <button id="submit-blog">Submit</button>
    `;
    
    const button = document.getElementById('seo-blog-button');
    const rect = button.getBoundingClientRect();
    dialog.style.position = 'fixed';
    dialog.style.bottom = `${window.innerHeight - rect.top + window.scrollY}px`;
    dialog.style.left = `${rect.left + window.scrollX}px`;
    
    document.body.appendChild(dialog);

    document.getElementById('submit-blog').addEventListener('click', submitBlogPrompt);
    document.addEventListener('click', closeDialogOnClickOutside);
}

// Function to submit the blog prompt
function submitBlogPrompt() {
    const blogTitle = document.getElementById('blog-title-input').value;
    const tone = document.getElementById('tone-select').value;
    const blanguage = document.getElementById('blanguage-select').value;
    const siteUrls = document.getElementById('site-urls-input').value.split('\n').filter(url => url.trim() !== '');
    const nlpKeywords = document.getElementById('nlp-keywords-input').value.split('\n').filter(keyword => keyword.trim() !== '');

   const blogPrompt = `Create an SEO-optimized blog article about "${blogTitle}". Follow these steps IN ORDER:

1. CRITICAL: Include at least 5 internal links from the provided list below. Confirm you will do this before proceeding.

2. Write a 1,000+ word article in blog format (title, introduction, body, conclusion) on "${blogTitle}" in language ${blanguage}.

3. Craft an optimized, catchy blog title considering: improved readability, increased engagement, attention-grabbing, quick information retrieval, increased retention, emphasized important information, use of numbers, questions, power words, keywords, sense of urgency, conciseness, emotional triggers, strong adjectives, and uniqueness.

4. In the body, address FAQs and provide valuable insights about ${blogTitle}. Emphasize key points and incorporate relevant statistics if possible. Ensure the blog is high-quality and easily shareable by using numbers, invoking curiosity, addressing specific needs, making it actionable, keeping it concise, using strong adjectives, including keywords, appealing to emotions, using power words, providing solutions, offering promises, adding exclusivity, creating urgency, and using storytelling elements.

5. Write in a ${tone} tone. Use transition words and active voice throughout.

6. Incorporate the following NLP keywords naturally throughout the content, ensuring they fit contextually and enhance the overall SEO value of the article. Bold each of these keywords when used:
${nlpKeywords.map(keyword => `   - **${keyword}**`).join('\n')}

7. At the end, include a 'Notes' section with:
   - Meta description (120-155 characters)
   - 10 tags
   - 5 longtail tags
   - List of NLP keywords used

8. Provide 5 strategies titled 'Strategies to Consider' for enhancing content impact.

9. FINAL CHECK: Confirm that you have included at least 5 internal links as requested in step 1, following these SEO best practices:
   - Use descriptive anchor text that includes target keywords for the linked page based on the URL slug. 
   For example, https://www.mysite.com/blog/best-diets-for-men could link via anchor text in a post about diet 
   results with a sentence saying "some of the best diets have been proven to contain high protein" where the text "best diets" is the anchor text to the https://www.mysite.com/blog/best-diets-for-men url based on the context of the slug. 
   - Place links naturally within the content, ensuring they add value and context for the reader.
   - Prioritize linking to cornerstone or pillar content pages.
   - Vary your anchor text to avoid over-optimization.
   - Link to relevant, deeper pages within your site's structure.
   - Ensure links are evenly distributed throughout the content, not clustered in one area.
   - Use a mix of navigational and contextual links.
   - Avoid linking to the same page multiple times unless necessary.
   - Check that the linked pages are relevant to the current content and user intent.
   - Include at least one link in the first or second paragraph for improved crawlability.

Internal links to use (include at least 5):
${siteUrls.map(url => `- ${url}`).join('\n')}

Respond with "Understood, I will complete all 9 steps, including adding at least 5 internal links" before beginning the task.`;

    const inputField = getInputField();
    if (inputField) {
        setInputFieldValue(inputField, blogPrompt);
        console.log("Blog prompt added to input field. Please review and press 'Send' when ready.");
    } else {
        console.error("Input field not found");
    }

    closeDialog();
}

function showOutrankInput() {
    if (currentDialogType !== 'internalLinkOptimizer') {
        closeExistingDialog();
    }
    currentDialogType = 'outrankInput';
    const dialog = document.createElement('div');
    dialog.id = 'keyword-dialog';
    dialog.innerHTML = `
    <p>Enter URL to outrank and select tone:</p>
    <div class="input-container">
        <input type="text" id="url-input" placeholder="Enter URL">
    </div>
    <div class="select-container">
        <select id="tone-select">
            <option value="Professional">Business</option>
            <option value="Conversational">Friendly</option>
            <option value="Casual">Casual</option>
        </select>
        <select id="olanguage-select">
            <option value="English" selected>English</option>
                <option value="Arabic">Arabic</option>
                <option value="Dutch">Dutch</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Hindi">Hindi</option>
                <option value="Hungarian">Hungarian</option>  
                <option value="Indonesian">Indonesian</option>  
                <option value="Italian">Italian</option>
                <option value="Korean">Korean</option> 
                <option value="Latvian">Latvian</option>       
                <option value="Urdu">Urdu</option>                
                <option value="Spanish">Spanish</option>
                <option value="Slovenian">Slovenian</option>
                <option value="Swedish">Swedish</option>
                <option value="Thai">Thai</option>                
            </select>  
        </div>
        <button id="submit-outrank">Submit</button>
    `;
    
    const button = document.getElementById('outrank-button');
    const rect = button.getBoundingClientRect();
    dialog.style.position = 'fixed';
    dialog.style.bottom = `${window.innerHeight - rect.top + window.scrollY}px`;
    dialog.style.left = `${rect.left + window.scrollX}px`;
    
    document.body.appendChild(dialog);

    document.getElementById('submit-outrank').addEventListener('click', submitOutrankPrompt);
    document.addEventListener('click', closeDialogOnClickOutside);
}
///end change
function submitOutrankPrompt() {
    try {
        const url = document.getElementById('url-input')?.value;
        const tone = document.getElementById('tone-select')?.value;
        const olanguage = document.getElementById('olanguage-select')?.value;

        if (!url || !tone || !olanguage) {
            console.error("URL, tone, or language is missing");
            return;
        }

        const outrankPrompt = outrankPromptTemplate
            .replace(/\[URL\]/g, url)
            .replace(/\[TONE\]/g, tone);

        const inputField = getInputField();
        if (inputField) {
            setInputFieldValue(inputField, outrankPrompt);
            console.log("Outrank prompt added to the input field. Please review and press 'Send' when ready.");
        } else {
            console.error("Input field not found");
        }

        closeDialog();
    } catch (error) {
        console.error("Error in submitOutrankPrompt:", error);
    }
}


// Function to show the Internal Link Optimizer dialog
let currentDialogType = null;

function showInternalLinkOptimizerDialog() {
    const existingDialog = document.getElementById('keyword-dialog');
    if (existingDialog && currentDialogType === 'internalLinkOptimizer') {
        // If the dialog already exists, just bring it to the front
        existingDialog.style.zIndex = '10000';
        return;
    }

    closeExistingDialog();
    currentDialogType = 'internalLinkOptimizer';
    const dialog = document.createElement('div');
    dialog.id = 'keyword-dialog';
    dialog.classList.add('draggable');
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.innerHTML = `
    <div class="dialog-header">Internal Link Optimizer</div>
    <label for="selected-text" class="input-label">Your Highlighted Text:</label>
    <textarea id="selected-text" placeholder="Highlighted text will appear here" rows="4"></textarea>
    <label for="internal-urls" class="input-label">Your URLs for Internal Linking:</label>
    <textarea id="internal-urls" placeholder="Paste your list of internal URLs (one per line)" rows="4"></textarea>
    <button id="find-internal-links">Analyse</button>
    <hr class="section-divider">
    <label for="optimizer-results" class="input-label">Internal Link Analysis Results:</label>
    <textarea id="optimizer-results" placeholder="Optimization results will appear here" rows="6" readonly></textarea>
    <div class="api-settings">
        <label for="api-key" class="api-key-label">Add your OpenAI or Anthropic API Key:</label>
        <input type="text" id="api-key" placeholder="Enter your AI API key">
        <div class="api-buttons">
            <button id="save-api-key">Save API Key</button>
            <select id="api-provider">
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic (Claude)</option>
            </select>
        </div>
    </div>
    <button id="close-dialog">Close</button>
    `;
    document.body.appendChild(dialog);
    
    // Reset the transform after appending to allow for proper dragging
    dialog.style.transform = 'none';
    dialog.style.top = `${Math.max(0, Math.min(dialog.offsetTop, window.innerHeight - dialog.offsetHeight))}px`;
    dialog.style.left = `${Math.max(0, Math.min(dialog.offsetLeft, window.innerWidth - dialog.offsetWidth))}px`;

    makeDraggable(dialog);

    document.getElementById('save-api-key').addEventListener('click', saveApiKey);
    document.getElementById('find-internal-links').addEventListener('click', submitInternalLinkOptimizerPrompt);
    document.getElementById('close-dialog').addEventListener('click', closeDialog);

    // Add event listener for text selection
    document.addEventListener('selectionchange', updateSelectedText);

    // Load saved data
    loadSavedData();
}
function makeDraggable(element) {
    const header = element.querySelector('.dialog-header');
    let isDragging = false;
    let startX, startY;

    header.addEventListener('mousedown', startDragging);

    function startDragging(e) {
        e.preventDefault();
        isDragging = true;
        startX = e.clientX - element.offsetLeft;
        startY = e.clientY - element.offsetTop;
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            const newX = e.clientX - startX;
            const newY = e.clientY - startY;
            
            // Ensure the dialog stays within the viewport
            const maxX = window.innerWidth - element.offsetWidth;
            const maxY = window.innerHeight - element.offsetHeight;
            
            element.style.left = `${Math.max(0, Math.min(newX, maxX))}px`;
            element.style.top = `${Math.max(0, Math.min(newY, maxY))}px`;
        }
    }

    function stopDragging() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDragging);
    }
}
function loadSavedData() {
    const savedApiKey = localStorage.getItem('aiApiKey');
    const savedApiProvider = localStorage.getItem('aiApiProvider');
    const savedInternalUrls = localStorage.getItem('internalUrls');
    
    if (savedApiKey) {
        document.getElementById('api-key').value = savedApiKey;
    }
    if (savedApiProvider) {
        document.getElementById('api-provider').value = savedApiProvider;
    }
    if (savedInternalUrls) {
        document.getElementById('internal-urls').value = savedInternalUrls;
    }
}
// Function to save API key with animation
function saveApiKey() {
    const apiKey = document.getElementById('api-key').value;
    const apiProvider = document.getElementById('api-provider').value;
    const internalUrls = document.getElementById('internal-urls').value;
    
    localStorage.setItem('aiApiKey', apiKey);
    localStorage.setItem('aiApiProvider', apiProvider);
    localStorage.setItem('internalUrls', internalUrls);
    
    AIService.setApiKey(apiKey);
    if (apiProvider === 'openai') {
        AIService.setApiEndpoint('https://api.openai.com/v1/chat/completions');
    } else if (apiProvider === 'anthropic') {
        AIService.setApiEndpoint('https://api.anthropic.com/v1/complete');
    }
    
    const saveButton = document.getElementById('save-api-key');
    saveButton.textContent = 'Saved!';
    saveButton.classList.add('saved');
    setTimeout(() => {
        saveButton.textContent = 'Save API Key';
        saveButton.classList.remove('saved');
    }, 2000);

    console.log('API Key saved:', apiKey); // Add this line for debugging
}
// Function to update the selected text in the dialog
function updateSelectedText(e) {
    const selectedText = window.getSelection().toString().trim();
    const textArea = document.getElementById('selected-text');
    if (textArea) {
        textArea.value = selectedText;
    }
}
// Function to submit the Internal Link Optimizer prompt
async function submitInternalLinkOptimizerPrompt() {
    const button = document.getElementById('find-internal-links');
    showSpinner(button);

    try {
        const selectedText = document.getElementById('selected-text').value;
        const internalUrlsInput = document.getElementById('internal-urls').value;
        const internalUrls = internalUrlsInput.split('\n').filter(url => url.trim() !== '');

        if (!selectedText || internalUrls.length === 0) {
            alert("Please enter both the selected text and internal URLs.");
            hideSpinner(button, false);
            return;
        }

        const apiKey = localStorage.getItem('aiApiKey');
        const apiProvider = localStorage.getItem('aiApiProvider');

        if (!apiKey || !apiProvider) {
            alert('Please save your API key and provider first.');
            hideSpinner(button, false);
            return;
        }

        console.log('Retrieved API Key:', apiKey);
        console.log('Retrieved API Provider:', apiProvider);

        AIService.setApiKey(apiKey);
        if (apiProvider === 'openai') {
            AIService.setApiEndpoint('https://api.openai.com/v1/chat/completions');
        } else if (apiProvider === 'anthropic') {
            AIService.setApiEndpoint('https://api.anthropic.com/v1/complete');
        }

        const prompt = internalLinkOptimizerPrompt
            .replace('[TEXT]', selectedText)
            .replace('[URLS]', internalUrls.join('\n'));
        
        const result = await AIService.analyzeTextForInternalLinks(prompt, internalUrls);
        
        // Update this part to display results in the new textarea
        const resultsTextarea = document.getElementById('optimizer-results');
        if (resultsTextarea) {
            resultsTextarea.value = result;
            console.log("Internal Link Optimizer results added to the results box.");
            hideSpinner(button, true);
        } else {
            console.error("Results textarea not found");
            hideSpinner(button, false);
        }
    } catch (error) {
        console.error("Error in submitInternalLinkOptimizerPrompt:", error);
        alert(`An error occurred while optimizing internal links: ${error.message}`);
        hideSpinner(button, false);
    }
}
// Add this function to create and show the spinner
function showSpinner(button) {
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    button.appendChild(spinner);
    button.classList.add('processing');
    button.disabled = true;
}

// Add this function to hide the spinner and update button state
function hideSpinner(button, success) {
    const spinner = button.querySelector('.spinner');
    if (spinner) {
        spinner.remove();
    }
    button.classList.remove('processing');
    button.classList.add(success ? 'success' : 'error');
    button.disabled = false;
    
    // Reset button state after a few seconds
    setTimeout(() => {
        button.classList.remove('success', 'error');
    }, 3000);
}

function isToggleButtonVisible() {
    const toggleButton = document.getElementById('toggle-seo-buttons');
    return toggleButton && toggleButton.offsetParent !== null;
}

function ensureButtonsPresent() {
    if (!isToggleButtonVisible()) {
        console.log("Toggle button not visible. Reinitializing...");
        buttonsInitialized = false;
        initializeButtons();
    }
}

function initializeButtons() {
    if (buttonsInitialized) {
        console.log("Buttons already initialized. Skipping...");
        return;
    }

    setTimeout(() => {
        try {
            const existingButtonContainer = document.getElementById('seo-button-container');
            if (existingButtonContainer) {
                console.log("Buttons already exist. Skipping...");
                buttonsInitialized = true;
                return;
            }
            addButtons();
            
            if (isToggleButtonVisible()) {
                buttonsInitialized = true;
                console.log("Buttons successfully initialized.");
            } else {
                throw new Error("Buttons not visible after initialization");
            }
        } catch (error) {
            console.error("Error in initializeButtons:", error);
        }
    }, 2700); // 2.7 seconds delay
}

const observer = new MutationObserver((mutations) => {
    const inputAreaAdded = mutations.some(mutation => 
        mutation.type === 'childList' && 
        Array.from(mutation.addedNodes).some(node => 
            node.nodeType === Node.ELEMENT_NODE && 
            (node.matches('div[class^="ProseMirror"]') || 
             node.matches('div[contenteditable="true"]') ||
             node.matches('div[role="textbox"]') ||
             node.matches('textarea') ||
             node.matches('#prompt-textarea'))
        )
    );

    if (inputAreaAdded) {
        console.log("Detected new input area. Checking buttons...");
        debounceEnsureButtonsPresent();
    }

    // Check if the chat panel has been switched or refreshed
    const chatPanelChanged = mutations.some(mutation => 
        mutation.type === 'childList' && 
        mutation.target.matches('div[id*="__next"]')
    );

    if (chatPanelChanged) {
        console.log("Chat panel changed. Checking buttons...");
        debounceEnsureButtonsPresent();
    }
});

// Debounce function to limit the rate at which a function can fire.
function debounce(func, wait = 200) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Debounced version of ensureButtonsPresent
const debounceEnsureButtonsPresent = debounce(ensureButtonsPresent, 1000);

// Periodic check function
setInterval(() => {
    if (!isToggleButtonVisible()) {
        console.log("Periodic check: Toggle button not visible. Reinitializing...");
        buttonsInitialized = false;
        initializeButtons();
    }
}, 2000);

// Run when the page is fully loaded
window.addEventListener('load', () => {
    console.log("Page loaded. Waiting to initialize buttons...");
    initializeButtons();
});

// Start observing the document body for changes
observer.observe(document.body, { childList: true, subtree: true });
function closeDialog() {
    const dialog = document.getElementById('keyword-dialog');
    if (dialog) {
        dialog.remove();
        // Remove the selectionchange event listener only if it's the internal link optimizer
        if (currentDialogType === 'internalLinkOptimizer') {
            document.removeEventListener('selectionchange', updateSelectedText);
        }
        currentDialogType = null;
    }
}
function closeExistingDialog() {
    const existingDialog = document.getElementById('keyword-dialog');
    if (existingDialog) {
        closeDialog();
    }
}

// Log when the script has finished loading
console.log("SEO extension script loaded and observer started.");