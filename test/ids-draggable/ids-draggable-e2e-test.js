describe('Ids Draggable e2e Tests', () => {
  const exampleUrl = 'http://localhost:4444/ids-draggable';

  beforeAll(async () => {
    await page.goto(exampleUrl, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Draggable Component');
  });

  it('can drag with no axis', async () => {
    await page.goto(exampleUrl, { waitUntil: ['networkidle2', 'load'] });
    const example = await page.$('#no-axis');
    const startRects = await example.boundingBox();

    await page.mouse.move(startRects.x + startRects.width / 2, startRects.y + startRects.height / 2);
    await page.mouse.down();
    await page.mouse.move(-200, -200);
    await page.mouse.up();
    const endRects = await example.boundingBox();

    expect(endRects.x).toBeLessThan(startRects.x);
    expect(endRects.y).toBeLessThan(startRects.y);
  });

  it('can drag on y axis', async () => {
    await page.goto(exampleUrl, { waitUntil: ['networkidle2', 'load'] });
    const example = await page.$('#axis-y');
    const startRects = await example.boundingBox();

    await page.mouse.move(startRects.x + startRects.width / 2, startRects.y + startRects.height / 2);
    await page.mouse.down();
    await page.mouse.move(-200, -200);
    await page.mouse.up();
    const endRects = await example.boundingBox();

    expect(endRects.x).toEqual(startRects.x);
    expect(endRects.y).toBeLessThan(startRects.y);
  });

  it('can drag on x axis', async () => {
    await page.goto(exampleUrl, { waitUntil: ['networkidle2', 'load'] });
    const example = await page.$('#axis-x');
    const startRects = await example.boundingBox();

    await page.mouse.move(startRects.x + startRects.width / 2, startRects.y + startRects.height / 2);
    await page.mouse.down();
    await page.mouse.move(-200, -200);
    await page.mouse.up();
    const endRects = await example.boundingBox();

    expect(endRects.x).toBeLessThan(startRects.x);
    expect(endRects.y).toEqual(startRects.y);
  });

  it('can drag with limits', async () => {
    await page.goto(exampleUrl, { waitUntil: ['networkidle2', 'load'] });
    const example = await page.$('#limits');
    const startRects = await example.boundingBox();

    await page.mouse.move(startRects.x + startRects.width / 2, startRects.y + startRects.height / 2);
    await page.mouse.down();
    await page.mouse.move(-200, -200);
    await page.mouse.up();
    const endRects = await example.boundingBox();

    // will max out at a limit
    expect(endRects.x).toBeLessThan(startRects.x);
    expect(endRects.y).toBeLessThan(startRects.y);
  });

  it('can drag with containment', async () => {
    await page.goto(exampleUrl, { waitUntil: ['networkidle2', 'load'] });
    const example = await page.$('#contained');
    const startRects = await example.boundingBox();

    await page.mouse.move(startRects.x + startRects.width / 2, startRects.y + startRects.height / 2);
    await page.mouse.down();
    await page.mouse.move(-200, -200);
    await page.mouse.up();
    const endRects = await example.boundingBox();

    expect(endRects.x).toBeGreaterThanOrEqual(startRects.x);
  });

  it('can drag with containment on axis x', async () => {
    await page.goto(exampleUrl, { waitUntil: ['networkidle2', 'load'] });
    const example = await page.$('#contained-y');
    const startRects = await example.boundingBox();

    await page.mouse.move(startRects.x + startRects.width / 2, startRects.y + startRects.height / 2);
    await page.mouse.down();
    await page.mouse.move(-200, -200);
    await page.mouse.up();
    const endRects = await example.boundingBox();

    // will max out at the container limits
    expect(endRects.x).toEqual(startRects.x);
    expect(endRects.y).toEqual(startRects.y);
  });

  it('can drag with containment on axis y', async () => {
    await page.goto(exampleUrl, { waitUntil: ['networkidle2', 'load'] });
    const example = await page.$('#contained-x');
    const startRects = await example.boundingBox();

    await page.mouse.move(startRects.x + startRects.width / 2, startRects.y + startRects.height / 2);
    await page.mouse.down();
    await page.mouse.move(-200, -200);
    await page.mouse.up();
    const endRects = await example.boundingBox();

    // will max out at the container limits
    expect(endRects.x).toBeLessThan(startRects.x);
    expect(endRects.y).toEqual(startRects.y);
  });

  it('will not drag when disabled', async () => {
    await page.goto(exampleUrl, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate('document.querySelector("#no-axis").disabled = true');
    const example = await page.$('#no-axis');
    const startRects = await example.boundingBox();

    await page.mouse.move(startRects.x + startRects.width / 2, startRects.y + startRects.height / 2);
    await page.mouse.down();
    await page.mouse.move(-200, -200);
    await page.mouse.up();
    const endRects = await example.boundingBox();

    expect(endRects.x).toEqual(startRects.x);
    expect(endRects.y).toEqual(startRects.y);
  });

  it('will not re-drag when isDragging is true', async () => {
    await page.goto(exampleUrl, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate('document.querySelector("#no-axis").isDragging = true');
    const example = await page.$('#no-axis');
    const startRects = await example.boundingBox();

    await page.mouse.move(startRects.x + startRects.width / 2, startRects.y + startRects.height / 2);
    await page.mouse.down();
    await page.mouse.move(-200, -200);
    await page.mouse.up();
    const endRects = await example.boundingBox();

    expect(endRects.x).toBeLessThan(startRects.x);
    expect(endRects.y).toBeLessThan(startRects.y);
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(exampleUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await expect(page).toPassAxeTests({ disabledRules: ['color-contrast', 'region'] });
  });
});

describe('Ids Draggable Sandbox e2e Tests', () => {
  const sandboxUrl = 'http://localhost:4444/ids-draggable/sandbox.html';

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(sandboxUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await expect(page).toPassAxeTests({ disabledRules: ['color-contrast', 'region'] });
  });
});
