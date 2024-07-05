export interface SyncOptions {
  apiKey: string,
  projectId: string,
  buildId: string,
  branchId: string,
  baseUrl: string,
  testCycleFolderId: string,
  codeBase: string,
  codeVersion: string
}

export class ZephyrCloud {
  private options: SyncOptions;

  constructor(options: SyncOptions) {
    this.options = options;
  }

  async uploadTestResults(testResults: any): Promise<Response> {
    const url: string = `${this.options.baseUrl}/automations/executions/custom?projectKey=${this.options.projectId}&autoCreateTestCases=false`;
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${this.options.apiKey}`);
    const data = new FormData();
    const testCycle = {
      name: `[${this.options.branchId}][${this.options.buildId}][PW] - ${new Date().toISOString()}`,
      description: `Automated test execution for #${this.options.buildId}`,
      folderId: this.options.testCycleFolderId,
      customFields: {
        Branch: this.options.branchId,
        'Code Base Scope': this.options.codeBase,
        'Code Version': this.options.codeVersion
      }
    };

    data.append('file', testResults);
    data.append('testCycle', new Blob([JSON.stringify(testCycle)], { type: 'application/json' }));

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: data,
      redirect: 'follow'
    });
    return response;
  }

  async apiHealthCheck(): Promise<Response> {
    const url: string = `${this.options.baseUrl}/healthcheck`;
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${this.options.apiKey}`);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      redirect: 'follow'
    });

    return response;
  }
}
