const path = require('path');
const { MissingVarWarningLevels, MissingVarWarningsDetail } = require('./types');
const colors = require('colors');
/*
 arraySuffix: The suffix to append to types when looking to hydrate queryVars
 e.g when parsing the following query:

    query HelloWorld($in: [HelloWorldInput]) {

 The parser will try to import helloWorldInputArray. An array wrapped n times with get n suffixes.
 e.g.

    query HelloWorld($in: [[HelloWorldInput]]) {

 looks for helloWorldInputArrayArray
 */
const arraySuffix = 'Array';

const parseQueryVars = (documents, tabs, varFilename, varWarningReport, varWarningDetail, color) => {
    if (!color) {
        colors.disable()
    }

    const fixedPath = fixPath(varFilename);

    documents.forEach((doc) => {
        const varDefs = doc.document.definitions
            .map(({ variableDefinitions }) => variableDefinitions)
            .map((defList = []) =>
                defList.map(({ type, variable }) => {
                    let coreType = type;
                    let listCount = 0;
                    let isNullable = true;
                    while (coreType.kind !== 'NamedType') {
                        if (coreType.kind === 'ListType') {
                            listCount++;
                            coreType = coreType.type;
                        }
                        if (coreType.kind === 'NonNullType') {
                            if (!listCount) {  // this is ugly but GQL's weird [string!]! nullable specificity is complicated to parse. We're gonna assume contents are always non-nullable for now.
                                isNullable = false;
                            }
                            coreType = coreType.type;
                        }
                    }

                    return {
                        varName: variable.name.value,
                        varType: coreType.name.value,
                        listCount,
                        isNullable,
                    };
                }),
            );

        const flatDefs = varDefs?.reduce((acc, curr) => [...curr, ...acc], []);
        flatDefs?.forEach(({ varName, varType, listCount, isNullable }) => {
            // const lookFor = isBasicType(varType) ? varName : varNameFromType(varType, listCount);
            const lookFor = varName;

            const varFilePath = filenameHasPath(varFilename) ? fixedPath : path.join(path.dirname(doc.location), varFilename); // full path means use single file, filename only means look for this pattern at each doc.
            const varFileData = require(varFilePath);

            const maybeFlatExport = varFileData[lookFor];
            const maybeDefaultExport = varFileData.default?.[lookFor];
            const varData = maybeFlatExport || maybeDefaultExport;

            if (varData === undefined || varData === null) {
                switch (varWarningReport.toUpperCase()) {
                    case MissingVarWarningLevels.ALL:
                        warnOfMissingVar(doc, lookFor, varType, listCount, varName, varFilePath, varWarningDetail);
                        break;
                    case MissingVarWarningLevels.REQUIRED:
                        if (!isNullable) {
                            warnOfMissingVar(doc, lookFor, varType, listCount, varName, varFilePath, varWarningDetail);
                        }
                        break;
                    default:
                        // do nothing, errors silenced
                }
                return;
            }
            tabs[doc.docDir].variables = { ...tabs[doc.docDir].variables, [varName]: varData };
        });
    });
};

const warnOfMissingVar = (doc, lookFor, varType, listCount, varName, fixedPath, varWarningDetail) => {
    const gqlVarName ='$' + varName;

    const header = colors.red('Warning: ') + colors.cyan('Missing Query Variable');
    const location = colors.grey(`at ${doc.location}`);
    const parseError = `Couldn't find export '${colors.bold(lookFor)}' of type '${colors.bold(arrayifyVarType(varType, listCount))}' to hydrate '${colors.bold(gqlVarName)}'`;
    const varFile = colors.grey(`queryVarsFile set to: ${fixedPath}`);

    const sdl = colors.green(doc.rawSDL.replace(gqlVarName, colors.red(gqlVarName)));

    const simpleWarning = [header, parseError, location].join('\n');
    const detailedWarning = [simpleWarning, varFile, sdl].join('\n');

    if (varWarningDetail.toUpperCase() === MissingVarWarningsDetail.HIGH) {
        console.error(detailedWarning)
    } else {
        console.error(simpleWarning)
    }
};

const fixPath = (rawPath) => path.resolve(process.cwd(), rawPath);
const filenameHasPath = (fileName) => fileName.split(path.sep).length > 1;

const varNameFromType = (varType, listCount) => lowerFirstLetter(varType) + arraySuffix.repeat(listCount);
const arrayifyVarType = (varType, listCount) => varType + '[]'.repeat(listCount);

const isBasicType = (typeName) =>
    typeName === 'String' ||
    typeName === 'Int' ||
    typeName === 'Float' ||
    typeName === 'Boolean' ||
    typeName === 'ID';

const lowerFirstLetter = (word) =>
    word.slice(0, 1).toLowerCase().concat(word.slice(1, word.length));

module.exports = parseQueryVars;