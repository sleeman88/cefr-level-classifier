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
    
    // Mapping colors to corresponding levels
    const levelMapping = {
        '#32cd32': 'A1', // A1 color
        '#32cd32; font-weight:bold': 'A2', // A2 color
        'blue': 'B1', // B1 color
        'blue; font-weight:bold': 'B2', // B2 color
        'red': 'C1', // C1 color
        'red; font-weight:bold': 'C2', // C2 color
        'orange': 'naContent', // NA content words
        '': 'naOthers' // NA others
    };

    // Loop through all <span> tags and classify words based on color
    const spans = doc.querySelectorAll('span');
    spans.forEach(span => {
        const style = span.getAttribute('style');
        const word = span.textContent.trim();

        // Determine the level based on color
        let level = 'naOthers'; // Default level is 'NA others'
        for (let color in levelMapping) {
            if (style && style.includes(color)) {
                level = levelMapping[color];
                break;
            }
        }

        // Classify the word by its level
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
