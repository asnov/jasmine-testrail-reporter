# jasmine-testrail-reporter  
  
Reports Jasmine test results to [TestRail](http://www.gurock.com/testrail/)  
  
#How to use  
  
The best way to pass parameters to the reporter is by environment variables:  
  
TESTRAIL_USERNAME - used to form URL, like <username>.testrail.io  
TESTRAIL_EMAIL  
TESTRAIL_PASSWORD - API key  
TESTRAIL_PROJECT_ID - number | 'first' | 'last', default = 'first' (the results will be saved to your first project in the TestRail project list)  
TESTRAIL_SUITE_ID - optional  
TESTRAIL_RUN_ID - number | 'first' | 'last', default = 'last' (the results will be saved to your last test run in the TestRail list)  
  
For example, you can use `env` utility, like this:  
```
env TESTRAIL_USERNAME=<...> TESTRAIL_EMAIL=<...> TESTRAIL_PASSWORD=<...> TESTRAIL_PROJECT_ID=first npm test  
```
  
  
protractor.conf.ts  
```
import TestRailReporter from 'jasmine-testrail-reporter';
const trReporter = new TestRailReporter();  // all parameters are inside environment variables
// or
const trReporter = new TestRailReporter({   // all parameters are setup in the code
                    username: 'username',   // security warning: attention when commit to repository !
                    email: 'email',         // security warning: attention when commit to repository !
                    password: 'password',   // security warning: attention when commit to repository !
                    projectId: 1,
                    suiteId: 1,
                    runId: 30,
});

export const config = {

    onPrepare: () => {
        jasmine.getEnv().addReporter(trReporter);
    },
    onComplete: function() {
            return myReporter.publishResults()
                .then(results => { console.log('complete'); })
                .catch(err => { console.log(err.message); });
    },

}  
```  
  
  
  
  
# Thanks  
- to [Simone Borecz](https://github.com/Noaa87) for the idea and motivation.  
- to [Simon Townsend](https://github.com/stowns) for the idea to use protractor's onComplete;  
  
  
TODO  
- [   ] demonstrate error (if any) in async constructor more earlier;  
- [   ] add status matching in parameters;  
- [   ] store CustomReporterResult.failedExpectations, passedExpectations, pendingReason in the IAddResultsForCases.custom_step_results;  
- [   ] implement ‘create’ option for RunId;  
- [   ] implement createTestCases method;  
- [   ] ...  
  
  
  