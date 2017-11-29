declare module 'node-testrail-sync' {

  export interface ITestRailAPI {
    addRun(projectID: number, suite_id: string, name: string, description?: string, milestone_id?: number, callback?: Function): any;
    addSection(project_id: number, suite_id: string, parent_id: number, name: string, callback?: Function): any;
  }

}
