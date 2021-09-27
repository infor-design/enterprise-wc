# Performance Benchmarks

## Initial

### Tooltips
[Link](http://localhost:4300/ids-tooltip/performance.html) - with no hard refresh

**Page load 1**
Loading Time: 3408.2000000476837
MemoryInfo: {totalJSHeapSize: 42727872, usedJSHeapSize: 39987288, jsHeapSizeLimit: 4294705152}Observations:
 - Paint happens a few seconds after
 - [Violation] 'DOMContentLoaded' handler took 2779ms

**Page load 2**
Loading Time: 3306.7000000476837
MemoryInfo: {totalJSHeapSize: 45230615, usedJSHeapSize: 41983847, jsHeapSizeLimit: 4294705152}
Observations:
 - Paint happens a few seconds after
 - [Violation] 'DOMContentLoaded' handler took 2532ms

**Page load 3**
Loading Time: 3366.899999976158
MemoryInfo: {totalJSHeapSize: 42187020, usedJSHeapSize: 39526388, jsHeapSizeLimit: 4294705152}
Observations:
 - Paint happens a few seconds after
 - [Violation] 'DOMContentLoaded' handler took 2213ms

**Page load 1 (after - round 1)**
Loading Time: 1470.60000002
MemoryInfo: {totalJSHeapSize: 66361834, usedJSHeapSize: 64188334, jsHeapSizeLimit: 4294705152}
Observations:
 - Paint happens a few seconds after
 - [Violation] 'DOMContentLoaded' handler took 650ms

**Page load 2 (after - round 1)**
Loading Time: 1210.3000000715256
MemoryInfo: {totalJSHeapSize: 62022290, usedJSHeapSize: 57670454, jsHeapSizeLimit: 4294705152}
Observations:
 - Paint happens a few seconds after
 - [Violation] 'DOMContentLoaded' handler took 612ms

**Page load 3 (after - round 1)**
Loading Time: 1185.7000000
MemoryInfo: {totalJSHeapSize: 65432455, usedJSHeapSize: 63194903, jsHeapSizeLimit: 4294705152}
Observations:
 - Paint happens a few seconds after
 - [Violation] 'DOMContentLoaded' handler took 613ms

### Datagrid Loading

**Page load 1**
Loading Time: 860
MemoryInfo: {totalJSHeapSize: 4294705152, usedJSHeapSize: 30796259, jsHeapSizeLimit: 30534023}

**Page load 2**
Loading Time: 1179.2999999523163
MemoryInfo: {totalJSHeapSize: 4294705152, usedJSHeapSize: 36174166, jsHeapSizeLimit: 35410954}

**Page load 3**
Loading Time: 809
MemoryInfo: {totalJSHeapSize: 4294705152, usedJSHeapSize: 41139446, jsHeapSizeLimit: 35465286}

**Page load 1 (after - round 1)**
Loading Time: 757.5
MemoryInfo: {totalJSHeapSize: 82845654, usedJSHeapSize: 80637798, jsHeapSizeLimit: 4294705152}

**Page load 2 (after - round 1)**
Loading Time: 497.8000000715256
MemoryInfo: {totalJSHeapSize: 82678617, usedJSHeapSize: 80235965, jsHeapSizeLimit: 4294705152}

**Page load 3 (after - round 1)**
Loading Time: 458.7000000476837
MemoryInfo: {totalJSHeapSize: 83742536, usedJSHeapSize: 81716820, jsHeapSizeLimit: 4294705152}

### Buttons Loading

[Link](http://localhost:4300/ids-button/performance.html)

**Page load 1**
Loading Time: 2813
MemoryInfo: {totalJSHeapSize: 61220533, usedJSHeapSize: 57732217, jsHeapSizeLimit: 4294705152}
Observations:
 - Paint happens a few seconds after
 - [Violation] 'DOMContentLoaded' handler took 2342ms

**Page load 2**
Loading Time: 2681.2999999523163
MemoryInfo: {totalJSHeapSize: 57366922, usedJSHeapSize: 53165994, jsHeapSizeLimit: 4294705152}
Observations:
 - Paint happens a few seconds after
 - [Violation] 'DOMContentLoaded' handler took 2558ms

**Page load 3**
Loading Time: 3021
MemoryInfo: {totalJSHeapSize: 60220328, usedJSHeapSize: 58576096, jsHeapSizeLimit: 4294705152}
Observations:
 - Paint happens a few seconds after
 - [Violation] 'DOMContentLoaded' handler took 2448ms

**Page load 1 (after - round 1)**
Loading Time: 1097.8999999761581
MemoryInfo: {totalJSHeapSize: 4294705152, jsHeapSizeLimit: 62041844, usedJSHeapSize: 56650892}
Observations:
 - Paint happens a few seconds after
 - [Violation] 'DOMContentLoaded' handler took 562ms

**Page load 2 (after - round 1)**
Loading Time: 1026.6000000238419
MemoryInfo: {totalJSHeapSize: 4294705152, jsHeapSizeLimit: 68028201, usedJSHeapSize: 62379489}
Observations:
 - Paint happens a few seconds after
 - [Violation] 'DOMContentLoaded' handler took 592ms

**Page load 3 (after - round 1)**
Loading Time: 1098.1999999284744
MemoryInfo: {totalJSHeapSize: 4294705152, jsHeapSizeLimit: 72319920, usedJSHeapSize : 68550344}
Observations:
 - Paint happens a few seconds after
 - [Violation] 'DOMContentLoaded' handler took 2448ms

## Results

- Append a script has too slow of a FOUC and doesn't help much
- Append a style tag is slightly faster
- After: 30-40% better
