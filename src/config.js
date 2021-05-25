const { SortTypes, SortOrders } = require('./sort');
const { MissingVarWarningLevels, MissingVarWarningsDetail } = require('./parse/types');

const validateConfig = (config) => {
  const availableOpts = Object.keys(configDefaults);
  for (let passed of Object.keys(config)) {
    if (!availableOpts.includes(passed)) {
      throw new Error(
        `Unrecognized config opt '${passed}', available options are: ${availableOpts.join(
          ', ',
        )}`,
      );
    }
  }

  const varWarnReportOptions = Object.keys(MissingVarWarningLevels);
  if (!varWarnReportOptions.includes(config.varWarningReport.toUpperCase())) {
    throw new Error(
        `Unrecognized varWarningReport option value '${config.varWarningReport}', available options are: ${varWarnReportOptions.join(
            ', ',
        )}`,
    );
  }

  const varWarnDetailOptions = Object.keys(MissingVarWarningsDetail);
  if (!varWarnDetailOptions.includes(config.varWarningDetail.toUpperCase())) {
    throw new Error(
        `Unrecognized varWarningDetail option value '${config.varWarningDetail}', available options are: ${varWarnDetailOptions.join(
            ', ',
        )}`,
    );
  }
};

const configDefaults = {
  responsesFilename: undefined,
  docSortType: SortTypes.CONTENT,
  docSortOrder: SortOrders.DESC,
  varFilename: undefined,
  varWarningReport: MissingVarWarningLevels.REQUIRED,
  varWarningDetail: MissingVarWarningsDetail.HIGH,
  insertBlankTab: true,
  fragmentsLast: true,
  color: true,
};

module.exports = {
  validateConfig,
  configDefaults,
  MissingVarWarningLevels
};
