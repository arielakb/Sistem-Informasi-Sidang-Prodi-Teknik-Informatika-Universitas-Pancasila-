export class CSVParserService {
  /**
   * Parse a CSV buffer or string into array of objects.
   * Simple implementation: header row required, comma-separated, supports quoted values.
   */
  async parse(bufferOrPath: string | Buffer): Promise<any[]> {
    const content = typeof bufferOrPath === 'string' ? bufferOrPath : bufferOrPath.toString('utf8');
    const lines = content.split(/\r?\n/).filter((l) => l.trim() !== '');
    if (!lines.length) return [];

    const headers = this.parseCsvLine(lines[0]);
    const rows: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCsvLine(lines[i]);
      const obj: any = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = values[j] ?? '';
      }
      rows.push(obj);
    }

    return rows;
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }

      if (ch === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
        continue;
      }

      current += ch;
    }

    result.push(current.trim());
    return result;
  }
}

export default new CSVParserService();
