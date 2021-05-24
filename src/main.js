require('ts-node').register();
const { contentSort, documentSort, SortTypes } = require('./sort');
const { formatTabArray, arrayFromTabs } = require('./format');
const { parseResponses, parseQueries, parseQueryVars } = require('./parse');
const { validateConfig, configDefaults } = require('./config');

const path = require('path');

module.exports = {
  plugin: (schema, documents, config, info) => {
    const configWithDefaults = {...configDefaults, ...config};

    validateConfig(configWithDefaults);

    const {
      colorLogs,
      responsesFilename,
      docSortType,
      docSortOrder,
      queryVarsPath,
      missingVarWarning,
      insertBlankTab,
      fragmentsLast,
    } = configWithDefaults;


    if (docSortType.toUpperCase() !== SortTypes.CONTENT) {
      // content sort must happen after content aggregation
      documentSort(docSortType, docSortOrder, documents);
    }

    const locations = documents.map(({ location }) => location);
    const dirNames = flattenLocations(locations);
    const docsWithDirName = documents.map((el, i) => ({ ...el, docDir: dirNames[i] }));

    const tabs = tabsFromLocations(dirNames, insertBlankTab);

    parseQueries(tabs, docsWithDirName, dirNames);

    if (queryVarsPath) {
      parseQueryVars(docsWithDirName, tabs, queryVarsPath, missingVarWarning, colorLogs);
    }

    if (responsesFilename) {
      parseResponses(tabs, docsWithDirName, responsesFilename);
    }

    if (docSortType.toUpperCase() === SortTypes.CONTENT) {
      contentSort(docSortType, docSortOrder, tabs, fragmentsLast);
    }

    const tabArray = [...insertBlankTab ? [insertTab()] : [], ...arrayFromTabs(tabs)];

    return formatTabArray(tabArray);
  },
};

const tabsFromLocations = (dirNames, insertBlankTab) => {
  const tabs = {};
  dirNames.forEach((loc) => (tabs[loc] = blankTab()));
  return tabs;
};

const insertTab = () => ({name: 'New Tab', ...blankTab()});
const blankTab = () => ({ query: '', variables: {}, responses: '' });

const flattenLocations = (locations) => {
  const splits = locations.map((location) => location.split('/'));
  let offset = 0;

  while (splits.every((locs) => locs[offset] === splits[0][offset])) {
    offset++;
  }

  return splits.map((split) => split[offset]);
};
