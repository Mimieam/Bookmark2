import { env, pipeline } from '@xenova/transformers';
import axios from 'axios';
import cheerio from 'cheerio';
import KeywordExtractor from 'keyword-extractor';

// Skip initial check for local models, since we are not loading any local models.
env.allowLocalModels = false;

// Due to a bug in onnxruntime-web, we must disable multithreading for now.
// See https://github.com/microsoft/onnxruntime/issues/14445 for more information.
env.backends.onnx.wasm.numThreads = 1;


// Function to fetch the content of the webpage
export const fetchPageContent = async (url) => {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        return $('body').text(); // Extracts text from the body of the page
    } catch (error) {
        console.error('Error fetching URL:', error);
        return '';
    }
};

// Function to extract keywords from content
export const extractKeywords = (content) => {
    return KeywordExtractor.extract(content, {
        language: 'english',
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true,
    });
};

// Function to dynamically generate labels based on content
export const generateDynamicLabels = async (content) => {
    const labelGenerator = await pipeline('text-generation', 'gpt2'); // or another suitable model
    const prompt = `Generate possible categories for this content: "${content.slice(0, 200)}"`; // Limit to first 200 chars for prompt
    const result = await labelGenerator(prompt, { max_length: 50 });
    return result[0].generated_text.split(',').map(label => label.trim());
};

// Main function to classify URL
export const classifyUrl = async (url, useDynamicLabels = false) => {
    const content = await fetchPageContent(url);

    // Decide which method to use for generating labels
    const potentialLabels = useDynamicLabels
        ? await generateDynamicLabels(content)
        : extractKeywords(content);

    // Load the zero-shot classification pipeline
    const classifier = await pipeline('zero-shot-classification', 'facebook/bart-large-mnli');

    // Classify the content using the selected labels
    const result = await classifier(content, potentialLabels);

    // Extract labels with scores
    const labelsWithScores = result.labels.map((label, index) => ({
        label,
        score: result.scores[index]
    }));

    return labelsWithScores;
};
