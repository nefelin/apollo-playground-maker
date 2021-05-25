const { SortTypes, SortOrders } = require('./sort');
const { MissingVarWarningLevels, MissingVarWarningsDetail, VarFileTypes } = require('./parse/types');

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

  const varFileTypeOptions = Object.keys(VarFileTypes);
  if (!varFileTypeOptions.includes(config.varFileType.toUpperCase())) {
    throw new Error(
        `Unrecognized varFileType option value '${config.varFileType}', available options are: ${varFileTypeOptions.join(
            ', ',
        )}`,
    );
  }
};

const configDefaults = {
  responsesFilename: undefined,
  docSortType: SortTypes.CONTENT,
  docSortOrder: SortOrders.DESC,
  varFileName: undefined,
  varFileType: VarFileTypes.SINGLE,
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
