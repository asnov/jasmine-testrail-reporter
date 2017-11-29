import CustomReporter = jasmine.CustomReporter;
import CustomReporterResult = jasmine.CustomReporterResult;
import SuiteInfo = jasmine.SuiteInfo;
// import * as util from 'util';

// import TestRail = require('node-testrail');
// import {ITestRailAPI} from 'node-testrail';
// import TestRail = require('node-testrail-sync');
// import {ITestRailAPI} from 'node-testrail-sync';
// import TestRail = require('protractor-testrail-promise');
import * as assert from "assert";
// import {IAddResultsForCases, IGetCaseReturn, IGetResultsReturn, IGetTestReturn} from 'protractor-testrail-promise';
import TestRail = require('protractor-testrail-promise');
import IGetProjectReturn = ProtractorTestrailPromise.IGetProjectReturn;
import IGetTestReturn = ProtractorTestrailPromise.IGetTestReturn;
import IGetCaseReturn = ProtractorTestrailPromise.IGetCaseReturn;
import IAddResultsForCases = ProtractorTestrailPromise.IAddResultsForCases;
import IGetRunReturn = ProtractorTestrailPromise.IGetRunReturn;
import IGetResultsReturn = ProtractorTestrailPromise.IGetResultsReturn;

interface IExtendedCustomReporterResult extends CustomReporterResult {
    specs?: CustomReporterResult[];
}

interface ArrayOfExtendedCustomReporterResults {
    [index: string]: IExtendedCustomReporterResult;
}

const MODULE_NAME = 'jasmine-testrail-reporter';

enum EStatuses {
    Passed = 1,
    Blocked = 2,
    Untested = 3,
    Retest = 4,
    Failed = 5,
}

const jasmineToTestrailStatusesMatching: { [index: string]: EStatuses } = {
    'passed': EStatuses.Passed,
    'disabled': EStatuses.Blocked,
    'failed': EStatuses.Failed,
};

export default class Reporter implements CustomReporter {

    private testrail: TestRail;
    private projectId: number;
    private suiteId: number;
    private runId: number;
    private testsFromServer: IGetTestReturn[];
    private casesFromServer: IGetCaseReturn[];

    private specResults: CustomReporterResult[] = [];
    private jasmineResults: ArrayOfExtendedCustomReporterResults = {};

    private asyncInit: Promise<any> | null;
    private _asyncFlow: Promise<any> | null;

    constructor({
                    username = process.env.TESTRAIL_USERNAME,
                    email = process.env.TESTRAIL_EMAIL,
                    password = process.env.TESTRAIL_PASSWORD,
                    projectId = process.env.TESTRAIL_PROJECT_ID || 'first',
                    suiteId = process.env.TESTRAIL_SUITE_ID,
                    runId = process.env.TESTRAIL_RUN_ID || 'last',
                } = {}) {

        assert(email, `${MODULE_NAME}: email parameter should not be empty!`);
        assert(password, `${MODULE_NAME}: password parameter should not be empty!`);
        assert(typeof projectId === 'number' || ['first', 'last'].includes(projectId), `${MODULE_NAME}: projectId parameter is wrong!`);
        assert(typeof runId === 'number' || ['first', 'last', 'create'].includes(runId), `${MODULE_NAME}: runId parameter is wrong!`);

        if (!email) throw(new Error(`${MODULE_NAME}: email parameter should not be empty!`));
        if (!password) throw(new Error(`${MODULE_NAME}: password parameter should not be empty!`));

        this.testrail = new TestRail(`https://${username}.testrail.io`, email, password);


        this.asyncInit = (async () => {

            if (Number(projectId)) {
                this.projectId = Number(projectId)
            } else {
                const projects: IGetProjectReturn[] = JSON.parse(await this.testrail.getProjects());
                const index = projectId === 'first' ?
                    0 :
                    projects.length - 1;
                this.projectId = projects[index].id;
            }

            if (Number(runId)) {
                this.runId = Number(runId);
            } else {
                const runs: IGetRunReturn[] = JSON.parse(await this.testrail.getRuns(this.projectId));
                const index = runId === 'first' ?
                    0 :
                    runs.length - 1;
                this.runId = runs[index].id;
                this.suiteId = Number(suiteId) || runs[index].suite_id;
            }

            this.testsFromServer = JSON.parse(await this.testrail.getTests(this.runId));
            this.casesFromServer = JSON.parse(await this.testrail.getCases(this.projectId, this.suiteId));

        })();

    }

    createTestCases() {
        console.log(`${MODULE_NAME}: the method createTestCases is not implemented yet.`);
    }

    jasmineStarted(suiteInfo: SuiteInfo) {

        /* Wait for async tasks triggered by `specDone`. */
        beforeEach(async () => {

            await this._asyncFlow;
            this._asyncFlow = null;

        });

    }

    specDone(result: CustomReporterResult) {

        this.specResults.push(result);
        this._asyncFlow = this._asyncSpecDone(result);

    }

    suiteDone(result: CustomReporterResult) {

        this.jasmineResults[result.id] = result;
        this.jasmineResults[result.id].specs = this.specResults;
        this.specResults = [];

    }

    async _asyncSpecDone(result: any) {

        // @todo: Do your async stuff here depending on `result.status`, take screenshots etc...
        // await takeScreenshot();

    }

    async publishResults() {
        await this.asyncInit;

        // [].concat(...Object.values(this.jasmineResults).map(suite => suite.specs || []));
        const allSpecsFromAllSuites: CustomReporterResult[] = [].concat.apply([],
            Object.values(this.jasmineResults).map(suite => suite.specs));

        const addResultsForCases = allSpecsFromAllSuites.map(spec => {
                spec.failedExpectations = spec.failedExpectations || [];
                spec.status = spec.status || '';

                let caseId = 0;
                const matchArray = spec.description.match(/\((\d+):\)/);

                if (matchArray && matchArray.length && matchArray.length > 1) {
                    caseId = Number(matchArray[1]);
                } else {
                    const casesFoundByName = this.casesFromServer.filter(el => el.title === spec.description);
                    if (casesFoundByName && casesFoundByName.length === 1) {
                        caseId = casesFoundByName[0].id;
                    } else if (casesFoundByName.length > 1) {
                        throw new Error(`${MODULE_NAME}: The TestRail case number is not specified in the jasmine case title and more than one titles match.`);
                    } else {
                        throw new Error(`${MODULE_NAME}: The TestRail case number should be specified in the jasmine case title or titles should match.`);
                    }
                }

                return <IAddResultsForCases>{
                    case_id: caseId,
                    status_id: jasmineToTestrailStatusesMatching[spec.status],
                    comment: `${spec.id}: ${spec.fullName}`,
                    defects: spec.failedExpectations.map(
                        el => `matcherName = ${el.matcherName}\nmessage = ${el.message}\nexpected = ${el.expected}\nactual=${el.actual}`
                    ).join('\n\n'),
                };
            }
        );
        return <IGetResultsReturn[]> JSON.parse(await this.testrail.addResultsForCases(this.runId, {results: addResultsForCases}));
    }

}
