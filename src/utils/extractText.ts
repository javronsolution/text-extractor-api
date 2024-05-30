export default function extractKeyValuePairs(text: string): Record<string, string> {
    const keyValuePairs: Record<string, string> = {};
    const lines = text.split('\n');

    let currentKey = '';
    let currentValue = '';

    for (const line of lines) {
        // If the line contains a colon (:) followed by some text, it's likely a key-value pair
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
            // Extract key
            currentKey = line.substring(0, colonIndex).trim();

            // Extract value
            currentValue = line.substring(colonIndex + 1).trim();

            // Store key-value pair
            keyValuePairs[currentKey] = currentValue;
        } else if (currentKey !== '') {
            // If the line doesn't contain a colon but we have a current key, it's a multi-line value
            // Append the line to the current value with a newline character
            currentValue += '\n' + line.trim();
            keyValuePairs[currentKey] = currentValue;
        }
    }

    return keyValuePairs;
}