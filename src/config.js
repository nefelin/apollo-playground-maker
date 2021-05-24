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
  if (!varWarnReportOptions.includes(config.missingVarWarning.report.toUpperCase())) {
    throw new Error(
        `Unrecognized missingVarWarning.report option value '${config.missingVarWarning.report}', available options are: ${varWarnReportOptions.join(
            ', ',
        )}`,
    );
  }

  const varWarnDetailOptions = Object.keys(MissingVarWarningsDetail);
  if (!varWarnDetailOptions.includes(config.missingVarWarning.detail.toUpperCase())) {
    throw new Error(
        `Unrecognized missingVarWarning.detail option value '${config.missingVarWarning.detail}', available options are: ${varWarnDetailOptions.join(
            ', ',
        )}`,
    );
  }
};

const configDefaults = {
  responsesFilename: undefined,
  docSortType: SortTypes.CONTENT,
  docSortOrder: SortOrders.DESC,
  queryVarsPath: undefined,
  missingVarWarning: {
    report: MissingVarWarningLevels.REQUIRED,
    detail: MissingVarWarningsDetail.HIGH
  },
  insertBlankTab: true,
  fragmentsLast: true,
  colorLogs: true,
};

module.exports = {
  validateConfig,
  configDefaults,
  MissingVarWarningLevels
};
