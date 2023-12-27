# Generate magic videos and analyze results, trends etc


## Pre-requisites

### 

To use this script you will need to have Node installed, even though there are some imports used, they are all internal and you don't have to install anything else. To check the python version run:

    npx & yarn installed
    npx install 
    
    or 
    
    yarn install

Also make sure your account doesnt have a 2fa/okta login (use name@test.canva.com) and contains at least 10 user uploaded photos and/or videos and have dismissed the magic video welcome/onboarding dialog

The source code lives in e2e/canva-magic-video.spec.ts

## How to use

### 1 update .env file, add canva user/pwd (prod); no WAF token needed as we are using stealth plugin
### 2 run as: yarn playwright test or npx playwright test 
### or yarn playwright test --headed if you want to see the browser 
### or yarn playwright test --repeat-each 10 (to run it multiple times, in parralel)

### 3 check results in reports/generated_designs_data_<year-mmonth>.csv also see the playwright report + screenshots in the reports/<year-month> subfolders.


## TODOs / Next stpes:
- [v] Add a try/catch block or a graceful failure, for when it fails to generate the design
- [v] Record the steps + media selected
- [v] Better DOM locators 
- [v] Remove CSV class to a separate file; also other generic methods into a helper class
- [v] Check and remove the remainder bits of flakiness (also find a better way of tracking and categorizing these in the output)
- [x] Add a customized list of prompts (instead of static built in/example ones) - Relpace our simple prompt using Try example button with a custom prompt, could be a word list, or semantically sorted topics (could be read from a csv) WIP
- [v] Feedback from the team:  save media IDs;
- [v] Create a chart, analyze trends/error types; save red flagged errors as a separate entity;
- [x] Feedback from the team: create a build WIP

    Questions:
        - Create a build pipeline which will run daily and save 50 results into CSV
        - How to create a buildkite pipeline for code living outside of Canva/canva repo
        - Where to store credentials
        - How often to run and which Slack channel to post results in 
        - How to handle daily 100 Magic Video hits limit? 
        - Slack notifications

- [v] Create QA forum prezo and include such details as: 
    -how it started and evolved
    -structure and runs
    -feedback from the team and comms with stakeholders (improving saving media IDs)
    -issues caught so far
    -potential issues to be caught in the future