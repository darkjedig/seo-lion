// AI Service for Internal Link Optimization

const AIService = {
    apiKey: null,
    apiEndpoint: null,

    setApiKey(key) {
        this.apiKey = key;
    },

    setApiEndpoint(endpoint) {
        this.apiEndpoint = endpoint;
    },

    async analyzeTextForInternalLinks(text, internalUrls) {
        if (!this.apiKey || !this.apiEndpoint) {
            throw new Error('API key or endpoint not set. Please check your configuration.');
        }
    
        const prompt = `As an AI-powered SEO expert, analyze the following text and suggest relevant internal links based on the provided list of internal URLs. Focus on the context and topic of both the source text and the target URLs.
    
    Text to analyze:
    ${text}
    
    Available internal URLs:
    ${internalUrls.join('\n')}
    
    Provide up to 3 relevant internal link suggestions. For each suggestion, include:
    1. The anchor text from the original text
    2. The URL to link to
    3. A brief explanation of why this link is relevant and how it relates to the content (max 50 words)
    
    Ensure that your suggestions follow SEO best practices:
    - Use descriptive anchor text that includes target keywords for the linked page
    - Ensure the suggested links add value and context for the reader
    - Prioritize linking to cornerstone or pillar content pages when relevant
    - Avoid over-optimization by varying anchor text if multiple links are suggested
    
    Format your response as follows:
    Suggestion 1:
    - Anchor text: [ANCHOR_TEXT]
    - URL: [URL]
    - Relevance: [BRIEF_EXPLANATION]
    
    Suggestion 2:
    ...
    
    Suggestion 3:
    ...
    
    If no relevant internal links can be suggested, respond with: "No relevant internal links found for the given text."`;
    
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{
                        role: "system",
                        content: "You are an AI assistant specialized in SEO and internal linking."
                    }, {
                        role: "user",
                        content: prompt
                    }]
                })
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error?.message || 'Unknown error'}`);
            }
    
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error calling AI service:', error);
            throw error;
        }
    }
};

// Example usage:
// AIService.setApiKey('your-api-key-here');
// AIService.setApiEndpoint('https://api.openai.com/v1/chat/completions');
// const result = await AIService.analyzeTextForInternalLinks(selectedText, internalUrls);