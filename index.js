"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// import * as util from 'util';
// import TestRail = require('node-testrail');
// import {ITestRailAPI} from 'node-testrail';
// import TestRail = require('node-testrail-sync');
// import {ITestRailAPI} from 'node-testrail-sync';
// import TestRail = require('protractor-testrail-promise');
var assert = require("assert");
// import {IAddResultsForCases, IGetCaseReturn, IGetResultsReturn, IGetTestReturn} from 'protractor-testrail-promise';
var TestRail = require("protractor-testrail-promise");
var MODULE_NAME = 'jasmine-testrail-reporter';
var EStatuses;
(function (EStatuses) {
    EStatuses[EStatuses["Passed"] = 1] = "Passed";
    EStatuses[EStatuses["Blocked"] = 2] = "Blocked";
    EStatuses[EStatuses["Untested"] = 3] = "Untested";
    EStatuses[EStatuses["Retest"] = 4] = "Retest";
    EStatuses[EStatuses["Failed"] = 5] = "Failed";
})(EStatuses || (EStatuses = {}));
var jasmineToTestrailStatusesMatching = {
    'passed': EStatuses.Passed,
    'disabled': EStatuses.Blocked,
    'failed': EStatuses.Failed,
};
var Reporter = /** @class */ (function () {
    function Reporter(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.username, username = _c === void 0 ? process.env.TESTRAIL_USERNAME : _c, _d = _b.email, email = _d === void 0 ? process.env.TESTRAIL_EMAIL : _d, _e = _b.password, password = _e === void 0 ? process.env.TESTRAIL_PASSWORD : _e, _f = _b.projectId, projectId = _f === void 0 ? process.env.TESTRAIL_PROJECT_ID || 'first' : _f, _g = _b.suiteId, suiteId = _g === void 0 ? process.env.TESTRAIL_SUITE_ID : _g, _h = _b.runId, runId = _h === void 0 ? process.env.TESTRAIL_RUN_ID || 'last' : _h;
        var _this = this;
        this.specResults = [];
        this.jasmineResults = {};
        assert(email, MODULE_NAME + ": email parameter should not be empty!");
        assert(password, MODULE_NAME + ": password parameter should not be empty!");
        assert(typeof projectId === 'number' || ['first', 'last'].includes(projectId), MODULE_NAME + ": projectId parameter is wrong!");
        assert(typeof runId === 'number' || ['first', 'last', 'create'].includes(runId), MODULE_NAME + ": runId parameter is wrong!");
        if (!email)
            throw (new Error(MODULE_NAME + ": email parameter should not be empty!"));
        if (!password)
            throw (new Error(MODULE_NAME + ": password parameter should not be empty!"));
        this.testrail = new TestRail("https://" + username + ".testrail.io", email, password);
        this.asyncInit = (function () { return __awaiter(_this, void 0, void 0, function () {
            var projects, _a, _b, index, runs_1, _c, _d, index, _e, _f, _g, _h, _j, _k;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        if (!Number(projectId)) return [3 /*break*/, 1];
                        this.projectId = Number(projectId);
                        return [3 /*break*/, 3];
                    case 1:
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, this.testrail.getProjects()];
                    case 2:
                        projects = _b.apply(_a, [_l.sent()]);
                        index = projectId === 'first' ?
                            0 :
                            projects.length - 1;
                        this.projectId = projects[index].id;
                        _l.label = 3;
                    case 3:
                        if (!Number(runId)) return [3 /*break*/, 4];
                        this.runId = Number(runId);
                        return [3 /*break*/, 6];
                    case 4:
                        _d = (_c = JSON).parse;
                        return [4 /*yield*/, this.testrail.getRuns(this.projectId)];
                    case 5:
                        runs_1 = _d.apply(_c, [_l.sent()]);
                        index = runId === 'first' ?
                            0 :
                            runs_1.length - 1;
                        this.runId = runs_1[index].id;
                        this.suiteId = Number(suiteId) || runs_1[index].suite_id;
                        _l.label = 6;
                    case 6:
                        _e = this;
                        _g = (_f = JSON).parse;
                        return [4 /*yield*/, this.testrail.getTests(this.runId)];
                    case 7:
                        _e.testsFromServer = _g.apply(_f, [_l.sent()]);
                        _h = this;
                        _k = (_j = JSON).parse;
                        return [4 /*yield*/, this.testrail.getCases(this.projectId, this.suiteId)];
                    case 8:
                        _h.casesFromServer = _k.apply(_j, [_l.sent()]);
                        return [2 /*return*/];
                }
            });
        }); })();
    }
    Reporter.prototype.createTestCases = function () {
        console.log(MODULE_NAME + ": the method createTestCases is not implemented yet.");
    };
    Reporter.prototype.jasmineStarted = function (suiteInfo) {
        var _this = this;
        /* Wait for async tasks triggered by `specDone`. */
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._asyncFlow];
                    case 1:
                        _a.sent();
                        this._asyncFlow = null;
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Reporter.prototype.specDone = function (result) {
        this.specResults.push(result);
        this._asyncFlow = this._asyncSpecDone(result);
    };
    Reporter.prototype.suiteDone = function (result) {
        this.jasmineResults[result.id] = result;
        this.jasmineResults[result.id].specs = this.specResults;
        this.specResults = [];
    };
    Reporter.prototype._asyncSpecDone = function (result) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    Reporter.prototype.publishResults = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var allSpecsFromAllSuites, addResultsForCases, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.asyncInit];
                    case 1:
                        _c.sent();
                        allSpecsFromAllSuites = [].concat.apply([], Object.values(this.jasmineResults).map(function (suite) { return suite.specs; }));
                        addResultsForCases = allSpecsFromAllSuites.map(function (spec) {
                            spec.failedExpectations = spec.failedExpectations || [];
                            spec.status = spec.status || '';
                            var caseId = 0;
                            var matchArray = spec.description.match(/\((\d+):\)/);
                            if (matchArray && matchArray.length && matchArray.length > 1) {
                                caseId = Number(matchArray[1]);
                            }
                            else {
                                var casesFoundByName = _this.casesFromServer.filter(function (el) { return el.title === spec.description; });
                                if (casesFoundByName && casesFoundByName.length === 1) {
                                    caseId = casesFoundByName[0].id;
                                }
                                else if (casesFoundByName.length > 1) {
                                    throw new Error(MODULE_NAME + ": The TestRail case number is not specified in the jasmine case title and more than one titles match.");
                                }
                                else {
                                    throw new Error(MODULE_NAME + ": The TestRail case number should be specified in the jasmine case title or titles should match.");
                                }
                            }
                            return {
                                case_id: caseId,
                                status_id: jasmineToTestrailStatusesMatching[spec.status],
                                comment: spec.id + ": " + spec.fullName,
                                defects: spec.failedExpectations.map(function (el) { return "matcherName = " + el.matcherName + "\nmessage = " + el.message + "\nexpected = " + el.expected + "\nactual=" + el.actual; }).join('\n\n'),
                            };
                        });
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, this.testrail.addResultsForCases(this.runId, { results: addResultsForCases })];
                    case 2: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    return Reporter;
}());
exports.default = Reporter;
//# sourceMappingURL=index.js.map