/// <reference types="jasmine" />
import CustomReporter = jasmine.CustomReporter;
import CustomReporterResult = jasmine.CustomReporterResult;
import SuiteInfo = jasmine.SuiteInfo;
import IGetResultsReturn = ProtractorTestrailPromise.IGetResultsReturn;
export default class Reporter implements CustomReporter {
    private testrail;
    private projectId;
    private suiteId;
    private runId;
    private testsFromServer;
    private casesFromServer;
    private specResults;
    private jasmineResults;
    private asyncInit;
    private _asyncFlow;
    constructor({username, email, password, projectId, suiteId, runId}?: {
        username?: string | undefined;
        email?: string | undefined;
        password?: string | undefined;
        projectId?: string;
        suiteId?: string | undefined;
        runId?: string;
    });
    createTestCases(): void;
    jasmineStarted(suiteInfo: SuiteInfo): void;
    specDone(result: CustomReporterResult): void;
    suiteDone(result: CustomReporterResult): void;
    _asyncSpecDone(result: any): Promise<void>;
    publishResults(): Promise<IGetResultsReturn[]>;
}
