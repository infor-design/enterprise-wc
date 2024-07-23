import type {
  Reporter,
  TestCase,
  TestResult
} from '@playwright/test/reporter';
import {
  createReadStream,
  existsSync,
  mkdirSync,
  writeFileSync
} from 'fs';
import { join } from 'path';
import { ExecException, exec } from 'child_process';
import { blob } from 'stream/consumers';
import { Blob } from 'buffer';
import { ZephyrCloud, SyncOptions } from './cloud';

export type ZephyrResults = {
  result: string,
  testCase: {
    key: string,
    comment: string
  }
};

export class ZephyrReporter implements Reporter {
  private options: SyncOptions;

  private service: ZephyrCloud;

  private testResults: ZephyrResults[] = [];

  private reportBasePath: string = 'test-results/zephyr';

  private reportFullPath: string;

  private summary = {
    total: 0,
    counts: {
      passed: 0,
      failed: 0,
      flaky: 0,
      skipped: 0,
      noRun: 0
    }
  };

  constructor(options: SyncOptions) {
    this.options = options;
    this.reportFullPath = join(process.cwd(), this.reportBasePath, `zephyr-report-${new Date().toISOString()}.json`);
    this.service = new ZephyrCloud(this.options);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    let status: string;
    this.summary.total++;
    if (test.outcome() === 'flaky') {
      this.summary.counts.flaky++;
      status = 'Flaky';
    } else if (result.status === 'skipped') {
      this.summary.counts.skipped++;
      status = 'Skipped';
    } else if (result.status === 'passed') {
      this.summary.counts.passed++;
      status = 'Pass';
    } else if (result.status === 'failed' || result.status === 'timedOut') {
      this.summary.counts.failed++;
      status = 'Fail';
    } else {
      this.summary.counts.noRun++;
      status = 'Not Executed';
    }
    const zAnnotation = test.annotations.find((item) => item.type === 'zsID');
    if (zAnnotation !== undefined && zAnnotation.description) {
      const testCaseKey = zAnnotation.description;
      this.testResults.push({
        result: status,
        testCase: {
          key: testCaseKey,
          comment: 'via Playwright'
        }
      });
    }
  }

  async onEnd(): Promise<void | { status?: 'passed' | 'failed' | 'timedout' | 'interrupted' | undefined; } | undefined> {
    console.info(`Test Results:\n\nTOTAL  : ${this.summary.total}\n  `
      + `PASSED : ${this.summary.counts.passed}\n  `
      + `FAILED : ${this.summary.counts.failed}\n  `
      + `SKIPPED: ${this.summary.counts.skipped}\n  `
      + `NO RUN : ${this.summary.counts.noRun}\n`);
    if (!this.#validateOptions()) return;
    if (this.testResults.length > 0) {
      this.#createReport();
      const zip = await this.#archiveReport();
      const apiHealthCheck = await this.service.apiHealthCheck();
      if (apiHealthCheck.ok) {
        if (zip) {
          const response = await this.service.uploadTestResults(zip);
          if (!response.ok) console.info(`[zephyr sync] Failed to upload test results to Zephyr cloud: ${response.body}`);
        }
      } else {
        console.info(`[zephyr sync] Failed to connect to Zephyr cloud services: ${apiHealthCheck.body}`);
      }
    } else {
      console.info('[zephyr sync] No test results uploaded.');
    }
  }

  printsToStdio(): boolean {
    return true;
  }

  #validateOptions(): boolean {
    const requiredOptions = [
      { field: this.options.apiKey, name: 'API key' },
      { field: this.options.baseUrl, name: 'API url' },
      { field: this.options.projectId, name: 'Project key' }
    ];
    let flag = true;
    for (const option of requiredOptions) {
      if (!option.field) {
        console.info(`[Zephyr Sync] ${option.name} is required.`);
        flag = false;
      }
    }
    return flag;
  }

  #createReport() {
    const jReport = JSON.stringify({ version: 1, executions: this.testResults }, null, 2);
    if (!existsSync(this.reportBasePath)) mkdirSync(this.reportBasePath, { recursive: true });
    writeFileSync(this.reportFullPath, jReport);
  }

  async #archiveReport(): Promise<Blob | null> {
    const zipFileName = `results-${new Date().toISOString()}.zip`;
    const zipFullPath = join(process.cwd(), this.reportBasePath, zipFileName);
    try {
      const zipPath = await this.#execute('which zip');
      await this.#execute(`${zipPath.trim()} -r ${this.reportBasePath}/${zipFileName} ${this.reportFullPath}`);
      await this.#execute(`du -hs ${this.reportBasePath}/${zipFileName}`);
      const file = await blob(createReadStream(zipFullPath));
      return file;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async #execute(command: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      exec(command, (error: ExecException | null, stdout: string, stderr: string) => {
        if (error) {
          reject(error);
        }
        if (stderr) {
          reject(stderr);
        } else {
          resolve(stdout.trim());
        }
      });
    });
  }
}

export default ZephyrReporter;
