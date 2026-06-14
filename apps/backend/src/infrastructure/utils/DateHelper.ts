export class DateHelper {
  static formatDate(date: Date, locale = 'id-ID'): string {
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  static formatDateTime(date: Date, locale = 'id-ID'): string {
    return date.toLocaleString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  static formatTime(date: Date, locale = 'id-ID'): string {
    return date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  static daysDiff(from: Date, to: Date): number {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.ceil((to.getTime() - from.getTime()) / msPerDay);
  }

  static isExpired(date: Date): boolean {
    return date < new Date();
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  static startOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  static endOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }

  static toISODateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Parse tanggal dari string format 'YYYY-MM-DD' atau ISO string
   */
  static parseDate(dateStr: string): Date {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new Error(`Format tanggal tidak valid: ${dateStr}`);
    }
    return date;
  }
}
