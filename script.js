document.getElementById('processButton').addEventListener('click', function() {
    // Get the HTML content from the div
    const inputText = document.getElementById('inputText').innerHTML;

    // Parse the HTML to extract color-coded words
    const parser = new DOMParser();
    const doc = parser.parseFromString(inputText, 'text/html');
    
    // Variables to classify words by level
    const levels = {
        A1: [],
        A2: [],
        B1: [],
        B2: [],
        C1: [],
        C2: [],
        naContent: [], // NA content words
        naOthers: [] // NA other words
    };
    
    // Mapping colors and font-weight to corresponding levels
    const levelMapping = {
        '#32cd32': 'A1', // A1 color
        '#32cd32; font-weight:bold': 'A2', // A2 color (A1 color + bold)
        'blue': 'B1', // B1 color
        'blue; font-weight:bold': 'B2', // B2 color (B1 color + bold)
        'red': 'C1', // C1 color
        'red; font-weight:bold': 'C2', // C2 color (C1 color + bold)
        'orange': 'naContent', // NA content words
        '': 'naOthers' // NA others (for unclassified words)
    };

    // Loop through all <span> tags and classify words based on color and font weight
    const spans = doc.querySelectorAll('span');
    spans.forEach(span => {
        const style = span.getAttribute('style');
        const word = span.textContent.trim();

        // Only consider the color style (ignoring background-color or other styles)
        let color = style ? style.split(';').find(s => s.includes('color')) : '';
        
        // If no color style is found, skip this span
        if (!color) return;

        // Determine the level based on color and font-weight
        let level = 'naOthers'; // Default level is 'NA others'
        if (color.includes('#32cd32') && style.includes('font-weight:bold')) {
            level = 'A2'; // A2 level (A1 color + bold)
        } else if (color.includes('#32cd32')) {
            level = 'A1'; // A1 level
        } else if (color.includes('blue') && style.includes('font-weight:bold')) {
            level = 'B2'; // B2 level (B1 color + bold)
        } else if (color.includes('blue')) {
            level = 'B1'; // B1 level
        } else if (color.includes('red') && style.includes('font-weight:bold')) {
            level = 'C2'; // C2 level (C1 color + bold)
        } else if (color.includes('red')) {
            level = 'C1'; // C1 level
        } else if (color.includes('orange')) {
            level = 'naContent'; // NA content words
        }

        // Add the word to the appropriate level
        if (word) {
            levels[level].push(word);
        }
    });

    // Display the results in a table format (words separated by "/")
    let resultHtml = '<table><tr><th>Level</th><th>Words</th></tr>';
    
    resultHtml += `
        <tr>
            <td>A1</td>
            <td>${levels.A1.join(' / ') || ''}</td>
        </tr>
        <tr>
            <td>A2</td>
            <td>${levels.A2.join(' / ') || ''}</td>
        </tr>
        <tr>
            <td>B1</td>
            <td>${levels.B1.join(' / ') || ''}</td>
        </tr>
        <tr>
            <td>B2</td>
            <td>${levels.B2.join(' / ') || ''}</td>
        </tr>
        <tr>
            <td>C1</td>
            <td>${levels.C1.join(' / ') || ''}</td>
        </tr>
        <tr>
            <td>C2</td>
            <td>${levels.C2.join(' / ') || ''}</td>
        </tr>
        <tr>
            <td>NA content words</td>
            <td>${levels.naContent.join(' / ') || ''}</td>
        </tr>
        <tr>
            <td>NA other words</td>
            <td>${levels.naOthers.join(' / ') || ''}</td>
        </tr>
    `;

    resultHtml += '</table>';
    document.getElementById('result').innerHTML = resultHtml || 'No matching words found.';
});
