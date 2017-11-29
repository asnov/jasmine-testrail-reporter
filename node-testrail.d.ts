declare module 'node-testrail' {

    class TestRail {
        constructor(url: string, email: string, password: string);

        addRun(projectID: number, suite_id: string, name: string, description?: string, milestone_id?: number, callback?: Function): any;
        addSection(project_id: number, suite_id: string, parent_id: number, name: string, callback?: Function): any;
        get_projects(callback: (ret: IGetProjectsResults) => {}): void;
    }

    export = TestRail;

    // interface ITestRailAPI {
    //   addRun(projectID: number, suite_id: string, name: string, description?: string, milestone_id?: number, callback?: Function): any;
    //   addSection(project_id: number, suite_id: string, parent_id: number, name: string, callback?: Function): any;
    // }

    interface IGetProjectsResults {
        id: 3,
        name: 'Multi-suite Project',
        announcement: null,
        show_announcement: true,
        is_completed: false,
        completed_on: null,
        suite_mode: 3,
        url: 'https://alexnew.testrail.io/index.php?/projects/overview/3'
    }

}
