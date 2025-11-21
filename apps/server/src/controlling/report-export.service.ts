import { Injectable } from '@nestjs/common';
import ExcelJS from 'exceljs';

export interface ExportData {
  headers: string[];
  rows: any[][];
  title?: string;
}

@Injectable()
export class ReportExportService {
  async exportToExcel(data: ExportData): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Riport');

    // Title
    if (data.title) {
      worksheet.mergeCells('A1:' + String.fromCharCode(64 + data.headers.length) + '1');
      worksheet.getCell('A1').value = data.title;
      worksheet.getCell('A1').font = { size: 16, bold: true };
      worksheet.getCell('A1').alignment = { horizontal: 'center' };
      worksheet.addRow([]);
    }

    // Headers
    worksheet.addRow(data.headers);
    const headerRow = worksheet.getRow(worksheet.rowCount);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' },
    };
    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Data rows
    data.rows.forEach(row => {
      worksheet.addRow(row);
    });

    // Adjust column widths
    worksheet.columns.forEach((column, i) => {
      let maxLength = 0;
      column.eachCell!({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 0;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength + 2;
    });

    return await workbook.xlsx.writeBuffer() as Buffer;
  }

  async exportToCsv(data: ExportData): Promise<string> {
    const lines: string[] = [];

    if (data.title) {
      lines.push(data.title);
      lines.push('');
    }

    // Headers
    lines.push(data.headers.map(h => `"${h}"`).join(','));

    // Data rows
    data.rows.forEach(row => {
      lines.push(row.map(cell => `"${cell || ''}"`).join(','));
    });

    return lines.join('\n');
  }

  async exportToTxt(data: ExportData): Promise<string> {
    const lines: string[] = [];

    if (data.title) {
      lines.push(data.title);
      lines.push('');
    }

    // Headers
    lines.push(data.headers.join('|'));

    // Data rows
    data.rows.forEach(row => {
      lines.push(row.map(cell => cell || '').join('|'));
    });

    return lines.join('\n');
  }

  async exportToXml(data: ExportData): Promise<string> {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<Report>\n';

    if (data.title) {
      xml += `  <Title>${this.escapeXml(data.title)}</Title>\n`;
    }

    xml += '  <Rows>\n';

    // Headers row
    xml += '    <Row type="header">\n';
    data.headers.forEach(header => {
      xml += `      <Cell>${this.escapeXml(header)}</Cell>\n`;
    });
    xml += '    </Row>\n';

    // Data rows
    data.rows.forEach(row => {
      xml += '    <Row>\n';
      row.forEach((cell, index) => {
        xml += `      <Cell name="${this.escapeXml(data.headers[index])}">${this.escapeXml(cell?.toString() || '')}</Cell>\n`;
      });
      xml += '    </Row>\n';
    });

    xml += '  </Rows>\n';
    xml += '</Report>\n';

    return xml;
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

