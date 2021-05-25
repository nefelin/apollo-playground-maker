const formatTabArray = (tabArray) => JSON.stringify(tabArray, null, ' ');

const arrayFromTabs = (tabs) => {
  const ar = [];
  for (let [key, value] of Object.entries(tabs)) {
    ar.push({
      name: key,
      query: value.query.trim(),
      variables: JSON.stringify(value.variables, null, ' '),
      responses: [value.responses],
    });
  }
  return ar;
};

const addEndpointAndHeaders = (endpoint, headers, tabArray) => tabArray.map(tab => ({...tab, endpoint, headers}));

const formatDelimiter = '\n\n';

module.exports = {
  formatTabArray,
  formatDelimiter,
  arrayFromTabs,
  addEndpointAndHeaders
};
