const path = require('path');
const fs = require('fs');
const {formatDelimiter} = require('../format');

const parseResponses = (tabs, documents, responsesFilename) => {
    documents.forEach(({ location, docDir }) => {
        const dir = path.dirname(location);
        const filePath = path.join(dir, responsesFilename);
        if (fs.existsSync(filePath)) {
            const responseData = fs.readFileSync(filePath).toString();
            tabs[docDir].responses = tabs[docDir].responses.concat(responseData, formatDelimiter);
        }
    });
}

module.exports = parseResponses;
