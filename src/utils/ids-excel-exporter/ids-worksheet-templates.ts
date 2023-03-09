export const WORKBOOK_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mx="http://schemas.microsoft.com/office/mac/excel/2008/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xm="http://schemas.microsoft.com/office/excel/2006/main"><workbookPr/><sheets><sheet state="visible" name="Sheet1" sheetId="1" r:id="rId3"/></sheets><definedNames/><calcPr/></workbook>`;

export const WORKBOOK_XML_REL = `<?xml version="1.0" ?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
<Relationship Id="rId3" Target="worksheets/sheet1.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet"/>
</Relationships>`;

export const RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;

export const CONTENT_TYPES = `<?xml version="1.0" ?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default ContentType="application/xml" Extension="xml"/>
<Default ContentType="application/vnd.openxmlformats-package.relationships+xml" Extension="rels"/>
<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" PartName="/xl/worksheets/sheet1.xml"/>
<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" PartName="/xl/workbook.xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`;

export const WORKSHEET_TEMPLATE = `<?xml version="1.0" ?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:mx="http://schemas.microsoft.com/office/mac/excel/2008/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xm="http://schemas.microsoft.com/office/excel/2006/main">
<cols>{colPlaceholder}</cols>
<sheetData>{sheetDataPlaceholder}</sheetData>
</worksheet>`;

export const STYLES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet mc:Ignorable="x14ac x16r2 xr"
  xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
  xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
  xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"
  xmlns:x16r2="http://schemas.microsoft.com/office/spreadsheetml/2015/02/main"
  xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision">
  <numFmts count="0"></numFmts>
  <fonts count="3">
    <font>
      <sz val="11" />
      <color theme="1" rgb="FF000000" />
      <name val="Calibri" />
      <family val="2" />
      <scheme val="minor" />
    </font>
    <font>
      <sz val="11" />
      <color rgb="FFff0000" />
      <name val="Calibri Light" />
    </font>
    <font>
      <b />
      <sz val="11" />
      <color rgb="FF000000" />
      <name val="Calibri Light" />
    </font>
  </fonts>
  <fills count="4">
    <fill>
      <patternFill patternType="none" />
    </fill>
  </fills>
  <borders count="1">
    <border>
      <left />
      <right />
      <top />
      <bottom />
      <diagonal />
    </border>
    <border>
      <begin/>
      <end style="thin">
        <color indexed="64"/>
      </end>
      <top/>
      <bottom style="thin">
        <color indexed="64"/>
      </bottom>
      <diagonal/>
    </border>
  </borders>
  <cellStyleXfs count="1">
    <xf borderId="0" fillId="0" fontId="0" numFmtId="0" />
  </cellStyleXfs>
  <cellXfs count="4">
    <xf borderId="0" fillId="0" fontId="0" numFmtId="0" xfId="0" />
    <xf applyFont="1" borderId="1" fillId="0" fontId="2" numFmtId="0" xfId="0" applyAlignment="1">
      <alignment horizontal="center" />
    </xf>
    <xf borderId="0" fillId="0" fontId="0" numFmtId="14" xfId="0" applyNumberFormat="1" />
    <xf borderId="0" fillId="0" fontId="0" numFmtId="18" xfId="0" applyNumberFormat="1" />
  </cellXfs>
  <tableStyles count="0" defaultPivotStyle="PivotStyleLight16" defaultTableStyle="TableStyleMedium2" />
</styleSheet>`;

export interface ExcelColumn {
  id: string;
  field: string;
  type: string;
  name: string;
}

export interface XLSXColumn extends ExcelColumn {
  refLetter: string;
  width: number;
}

export interface ExcelConfig {
  filename: string;
  columns: Array<ExcelColumn>;
}
