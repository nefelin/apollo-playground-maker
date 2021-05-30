require('ts-node').register();
const { contentSort, documentSort, SortTypes } = require('./sort');
const { formatTabArray, arrayFromTabs } = require('./format');
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
      varWarningDetail,
      varWarningReport,
      insertBlankTab,
      fragmentsLast,
      tabNamePrefix,
      tabNameSuffix
    } = configWithDefaults;


    if (docSortType.toUpperCase() !== SortTypes.CONTENT) {
      // content sort must happen after content aggregation
      documentSort(docSortType, docSortOrder, documents);
    }

    const locations = documents.map(({ location }) => location);
    const dirNames = flattenLocations(locations, tabNamePrefix, tabNameSuffix);
    const docsWithDirName = documents.map((el, i) => ({ ...el, docDir: dirNames[i] }));

    const tabs = tabsFromLocations(dirNames);

    parseQueries(tabs, docsWithDirName, dirNames);

    if (varFilename) {
      parseQueryVars(docsWithDirName, tabs, varFilename, varWarningReport, varWarningDetail, color);
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

const tabsFromLocations = (dirNames) => {
  const tabs = {};
  dirNames.filter(onlyUnique).forEach((loc) => (tabs[loc] = blankTab()));
  return tabs;
};

const DefaultEndpoint = 'http://localhost:4000/graphql';
const insertTab = () => ({ name: 'New Tab', query: '', variables: '', responses: [], endpoint: DefaultEndpoint });
const blankTab = () => ({ query: '', variables: {}, responses: '', endpoint: DefaultEndpoint });

const flattenLocations = (locations, tabNamePrefix, tabNameSuffix) => {
  if (locations.length === 1) {
    return [getDirName(locations[0])]
  }

  const splits = locations.map((location) => location.split('/'));
  let offset = 0;

  while (splits.every((locs) => locs[offset] === splits[0][offset])) {
    offset++;
  }

  const dirs = splits.map((split) => split[offset]);
  return dirs.map(dirName => tabNamePrefix + dirName + tabNameSuffix);
};

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

const getDirName = (fullPath) => {
  const dirs = path.dirname(fullPath).split(path.sep);
  return dirs[dirs.length-1];
};

module.exports = {
    plugin,
};
