const path = require('path');
const { formatDelimiter } = require('./format');

const documentSort = (docSortType, docSortOrder, documents) => {
  if (docSortType) {
    if (!Object.keys(sortFns).includes(docSortType.toUpperCase())) {
      throw new Error(
        `Unrecognized sort docSortType, ${docSortType}, valid values are: ${JSON.stringify(
          Object.values(sortTypes),
        )}, (case insensitive)`,
      );
    }

    if (docSortOrder && !Object.keys(SortOrders).includes(docSortOrder.toUpperCase())) {
      throw new Error(
        `Unrecognized sort docSortOrder, ${docSortOrder}, valid values are: ${JSON.stringify(
          Object.values(SortOrders),
        )}, (case insensitive)`,
      );
    }

    const sorter = sortFns[docSortType.toUpperCase()](docSortOrder);
    documents.sort(sorter);
  }
};

const contentSort = (docSortType, direction = SortOrders.DESC, tabs, fragmentsLast) => {
  for (let [tabName, { query }] of Object.entries(tabs)) {
    const splitSorted = query.split(formatDelimiter).map(x => x.trim()).sort();
    if (direction === SortOrders.ASC) {
      splitSorted.reverse();
    }

    if (fragmentsLast) {
      splitSorted.sort((a,b) => scoreFragment(a)-scoreFragment(b))
    }

    tabs[tabName].query = splitSorted.join(formatDelimiter);
  }
};

const scoreFragment = (singleRawSDL) => singleRawSDL.split(' ')[0] === 'fragment' ? 100000000 : -10000000;

const docFilenameSort = (direction = SortOrders.DESC) => {
  return (a, b) => {
    if (direction.toUpperCase() === SortOrders.ASC) {
      [a, b] = [b, a];
    }
    const fileA = path.basename(a.location);
    const fileB = path.basename(b.location);
    return fileA.localeCompare(fileB);
  };
};

const docContentSort = (direction = SortOrders.DESC) => {
  return (a, b) => {
    if (direction.toUpperCase() === SortOrders.ASC) {
      [a, b] = [b, a];
    }
    return a.rawSDL.localeCompare(b.rawSDL);
  };
};

const docDirectorySort = (direction = SortOrders.DESC) => {
  return (a, b) => {
    if (direction.toUpperCase() === SortOrders.ASC) {
      [a, b] = [b, a];
    }
    const fileA = path.dirname(a.location);
    const fileB = path.dirname(b.location);
    return fileA.localeCompare(fileB);
  };
};

const SortOrders = {
  ASC: 'ASC',
  DESC: 'DESC',
};

const SortTypes = {
  FILENAME: 'FILENAME',
  CONTENT: 'CONTENT',
  DIRECTORY: 'DIRECTORY',
};

const sortFns = {
  [SortTypes.FILENAME]: docFilenameSort,
  [SortTypes.CONTENT]: docContentSort,
  [SortTypes.DIRECTORY]: docDirectorySort,
};

module.exports = {
  documentSort,
  contentSort,
  SortTypes,
  SortOrders
};
