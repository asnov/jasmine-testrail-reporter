declare module 'protractor-testrail-promise' {

    // module TestRail {}

    export = ProtractorTestrailPromise.TestRail;

}

declare namespace ProtractorTestrailPromise {

    type timespan = string;

    class TestRail {
        constructor(url: string, email: string, password: string);// : TestRail;


        addRun(project_id: number, suite_id: string, name: string, description?: string, milestone_id?: number, callback?: Function): any;

        addSection(project_id: number, suite_id: string, parent_id: number, name: string, callback?: Function): any;


        getProject(project_id: number): Promise<IGetProjectReturn>;

        getProjects(): Promise<string>; // IGetProjectReturn[]


        getRun(run_id: number): Promise<IGetRunReturn>;

        getRuns(project_id: number): Promise<string>;   // IGetRunReturn[]


        getTest(test_id: number): Promise<IGetTestReturn>;

        getTests(run_id: number): Promise<string>;  // IGetTestReturn[]


        getCase(case_id: number): Promise<IGetCaseReturn>;

        getCases(project_id: number, suite_id: number, section_id?: number): Promise<string>;   // IGetCaseReturn[]


        // RESULTS
        getResults(test_id: number, limit?: number): Promise<IGetResultsReturn[]>;

        getResultsForCase(run_id: number, case_id: number, limit?: number): Promise<IGetResultsReturn[]>;

        // getResultsForRun(run_id: number): Promise<IGetResultsReturn[]>; // TODO: not implemented yet
        addResult(test_id: number, status_id: number, comment: string, version: string, elapsed: timespan, defects: string, assignedto_id: number): Promise<IGetResultsReturn>;

        addResults(run_id: number, results: IAddResults[]): Promise<IGetResultsReturn[]>;

        addResultForCase(run_id: number, case_id: number, status_id: number, comment: string, version: string, elapsed: timespan, defects: string, assignedto_id?: number): Promise<IGetResultsReturn>;

        addResultsForCases(run_id: number, results: {results: IAddResultsForCases[]}): Promise<string>;    // IGetResultsReturn[]


        getStatuses(): IGetStatusesReturn[];
    }



    // interface ITestRailAPI {
    //   addRun(projectID: number, suite_id: string, name: string, description?: string, milestone_id?: number, callback?: Function): any;
    //   addSection(project_id: number, suite_id: string, parent_id: number, name: string, callback?: Function): any;
    // }

    export interface IGetProjectReturn {
        id: 3,
        name: 'Multi-suite Project',
        announcement: null,
        show_announcement: true,
        is_completed: false,
        completed_on: null,
        suite_mode: 3,
        url: 'https://alexnew.testrail.io/index.php?/projects/overview/3'
    }

    interface IGetRunReturn {
        id: 32,
        suite_id: 1,
        name: 'Test of 2017-11-23T02:10:32.788Z',
        description: 'The results of 10 automation tests at Wed Nov 22 2017 23:10:32 GMT-0300 (ART)',
        milestone_id: null,
        assignedto_id: null,
        include_all: true,
        is_completed: false,
        completed_on: null,
        config: null,
        config_ids: number[],
        passed_count: 0,
        blocked_count: 0,
        untested_count: 13,
        retest_count: 0,
        failed_count: 0,
        custom_status1_count: 0,
        custom_status2_count: 0,
        custom_status3_count: 0,
        custom_status4_count: 0,
        custom_status5_count: 0,
        custom_status6_count: 0,
        custom_status7_count: 0,
        project_id: 1,
        plan_id: null,
        created_on: 1511403034,
        created_by: 1,
        url: 'https://alexnew.testrail.io/index.php?/runs/view/32'
    }

    export interface IGetTestReturn {
        id: 451,
        case_id: 1,
        status_id: 1,
        assignedto_id: 1,
        run_id: 31,
        title: 'C1',
        template_id: 1,
        type_id: 7,
        priority_id: 2,
        estimate: null,
        estimate_forecast: null,
        refs: null,
        milestone_id: null,
        custom_preconds: null,
        custom_steps: null,
        custom_expected: null,
        custom_steps_separated: null,
        custom_mission: null,
        custom_goals: null
    }

    export interface IGetCaseReturn {
        id: 1,
        title: 'C1',
        section_id: 1,
        template_id: 1,
        type_id: 7,
        priority_id: 2,
        milestone_id: null,
        refs: null,
        created_by: 1,
        created_on: 1511138550,
        updated_by: 1,
        updated_on: 1511138550,
        estimate: null,
        estimate_forecast: null,
        suite_id: 1,
        custom_preconds: null,
        custom_steps: null,
        custom_expected: null,
        custom_steps_separated: null,
        custom_mission: null,
        custom_goals: null
    }

    interface IGetResultsCommon {
        status_id?: EStatuses | null;
        created_by?: number;
        created_on?: number;
        assignedto_id?: number | null;
        comment?: string;
        version?: string;
        elapsed?: timespan;
        defects?: string;
        custom_step_results?: any;
    }

    export interface IGetResultsReturn extends IGetResultsCommon {
        id: number;
    }

    interface IAddResults extends IGetResultsCommon {
        test_id: number;
    }

    export interface IAddResultsForCases extends IGetResultsCommon {   // one of Status ID, Assigned To or Comment is required
        case_id: number;
    }

    // FIXME: enum require to define the object but we can't in the module declaration
    // declare enum EStatuses {
    enum EStatuses {
        Passed = 1,
        Blocked = 2,
        Untested = 3,
        Retest = 4,
        Failed = 5,
    }

    interface IGetStatusesReturn {
        id: EStatuses | number;
        name: string;
        label: string;
        color_dark: number;
        color_medium: number;
        color_bright: number;
        is_system: boolean;
        is_untested: boolean;
        is_final: boolean;
    }

}
