const {formatDelimiter} = require('../format');

const parseQueries = (tabs, documents) => {
    documents.forEach(({ rawSDL, docDir }) => {
        tabs[docDir].query = tabs[docDir].query.concat(rawSDL, formatDelimiter);
    });
};

module.exports = parseQueries;