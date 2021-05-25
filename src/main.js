require('ts-node').register();
const { contentSort, documentSort, SortTypes } = require('./sort');
const { addEndpointAndHeaders, formatTabArray, arrayFromTabs } = require('./format');
const { parseResponses, parseQueries, parseQueryVars } = require('./parse');
const { validateConfig, configDefaults } = require('./config');

const path = require('path');

const plugin = (schema, documents, config, info) => {
    const configWithDefaults = {...configDefaults, ...config};

    validateConfig(configWithDefaults);

    const {
      color,
      responsesFilename,
      docSortType,
      docSortOrder,
      varFilename,
      missingVarWarning,
      insertBlankTab,
      fragmentsLast,
      varFileType,
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

    if (varFilename) {
      parseQueryVars(docsWithDirName, tabs, varFilename, missingVarWarning, color);
    }

    if (responsesFilename) {
      parseResponses(tabs, docsWithDirName, responsesFilename);
    }

    if (docSortType.toUpperCase() === SortTypes.CONTENT) {
      contentSort(docSortType, docSortOrder, tabs, fragmentsLast);
    }

    const tabArray = [...insertBlankTab ? [insertTab()] : [], ...arrayFromTabs(tabs)];

    return formatTabArray(tabArray);
};

const tabsFromLocations = (dirNames, insertBlankTab) => {
  const tabs = {};
  dirNames.forEach((loc) => (tabs[loc] = blankTab()));
  return tabs;
};

const insertTab = () => ({name: 'New Tab', query: '', variables: '', responses: [] });
const blankTab = () => ({ query: '', variables: {}, responses: '' });

const flattenLocations = (locations) => {
  if (locations.length === 1) {
    return [getDirName(locations[0])]
  }

  const splits = locations.map((location) => location.split('/'));
  let offset = 0;

  while (splits.every((locs) => locs[offset] === splits[0][offset])) {
    offset++;
  }

  return splits.map((split) => split[offset]);
};

const getDirName = (fullPath) => {
  const dirs = path.dirname(fullPath).split(path.sep);
  return dirs[dirs.length-1];
};

module.exports = {
    plugin,
    addEndpointAndHeaders
};
