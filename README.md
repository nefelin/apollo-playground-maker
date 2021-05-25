## What Is It?
apollo-playground-maker (APM) is a plugin for graphql-codegen[link]. Apollo's graphQL playground accepts an array of tabs as part of it's setup in the shape of.

# Add bits here about added endpoint/headers

This allows one to supply pre-populated tab-content for the playground. This could be used in a number of ways, but I have found myself
using it as a sort of swagger-like tool to test the graphQL operations the I have implemented inside my app. Note this only makes sense
if your graphQL API and your front-end app are tightly coupled, as in the backend for frontend[cite] pattern.

## How It Works
apollo-playground-maker with it's default settings, will aggregate graphQL operations and attempt to group them in sensible tabs.
 
#### Tab Grouping
APM determine tab names by trimming shared path information and using the first divergence as the depth the use for tab names.
For example, give the following directory structure:
```
components/
├── users
│   ├── GetProfile.gql
│   └── UpdateProfile.gql
└── posts
    ├── GetPost.gql
    └── responses
        └── GetResponses.gql
```

| Documents Setting               | Tabs Generated                    | Notes                                                                                     |
|---------------------------------|-----------------------------------|-------------------------------------------------------------------------------------------|
| components/users/*.gql          | GetProfile.gql, UpdateProfile.gql | Since there's only one directory, filenames are the differentiator                        |
| components/\*\*/\*.gql          | users, posts                      | other\_dir tab also contains queries found in sub\_dir                                    |
| components/posts/\*\*/\*.gql    | GetPost.gql, responses            | Because of this behavior, it's recommended to point APM at an empty directory             |

### Non GQL Files
In addition to aggregating graphQL operations, APM can aggregate query responses and query variable.

#### Query Variables
APM can attempt to hydrate query variables in two different ways. When APM encounters a named variable inside an operation, i.e. ```query Animal($species: String)```,
it will look for a ```species``` variable and add that to the query variables for the tab where the query will appear. APM will attempt to hydrate query variables only when passed the
```varFileName``` option.

##### Shared Global Var File
If the ```varFileName``` contains directory information i.e. ```src/queryVars.ts```, APM will attempt to hydrate all queries from that single file.

##### Per-Directory Var File
If the ```varFileName``` contains NO directory information i.e. ```queryVars.ts```, APM will look for a ```queryVars.ts``` file in the same directory as the operation utilizing
the argument.

#### Response Text
If passed a ```responsesFilename``` option, APM will look for a responses file whererever ```.gql``` files are encountered, aggregating those per tab.


### Options and Defaults
| Option            | Default Value | Description                                                                                                                |
|-------------------|---------------|----------------------------------------------------------------------------------------------------------------------------|
| responsesFilename |               | Filename to look for alongside GQL files to populate playground's Responses panel                                          |
| varFilename       |               | Filename to look for alongside GQL files (or globally, if path is provided) to populate playground's Query Variables panel |
| insertBlankTab    | true          | Should APM insert a blank playground tab in addition to the generated tabs                                                 |
| fragmentsLast     | true          | When docSortType is 'content', should APM ensure that fragments appear at the end of aggregated queries                    |
| color             | true          | Should logs appear in color                                                                                                |
| docSortType       | content       | Directory, Filename, or Content. What criteria is used to determine query ordering during aggregation                      |
| docSortOrder      | desc          | Asc, or Desc. How are documents ordered during sorting                                                                     |
| varWarningReport  | required      | All, Required, or None. When should APM warn that it was unable to find a query variable for a given query                 |
| varWarningDetail  | high          | High, or Low. What level of detail should APM provide when warning of missing query variables                              |

### Example codegen.yml
```
overwrite: true
schema: "src/gql/schema.gql"
generates:
  generated/main.json:
    documents: "./src/components/other_dir/**/*.gql"
    plugins:
      - "apollo-playground-maker"
    config:
      varFileName: "./src/gql/queryVars.ts"
      docSortType: "content"
      missingVarWarning:
        report: 'all'
        detail: 'high'
```
