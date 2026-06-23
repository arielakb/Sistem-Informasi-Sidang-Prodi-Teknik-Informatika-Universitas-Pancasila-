import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TableColumn<T> {
  key: keyof T;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: {
    current: number;
    total: number;
    pageSize: number;
    onChange: (page: number) => void;
  };
  onRowClick?: (row: T) => void;
  className?: string;
}

export const Table = React.forwardRef(function Table<T extends { id?: string | number }>(
  {
    data,
    columns,
    loading = false,
    pagination,
    onRowClick,
    className = '',
  }: TableProps<T>,
  ref: React.Ref<HTMLDivElement>
) {
  const handlePrevPage = () => {
    if (pagination && pagination.current > 1) {
      pagination.onChange(pagination.current - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination && pagination.current < Math.ceil(pagination.total / pagination.pageSize)) {
      pagination.onChange(pagination.current + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin h-8 w-8 border-2 border-pancasila-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        Tidak ada data untuk ditampilkan
      </div>
    );
  }

  return (
    <div ref={ref} className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={row.id || idx}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td key={String(column.key)} className="px-6 py-4 text-sm text-gray-700">
                  {column.render
                    ? column.render(row[column.key], row)
                    : String(row[column.key] || '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {pagination && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            Menampilkan {(pagination.current - 1) * pagination.pageSize + 1} -{' '}
            {Math.min(pagination.current * pagination.pageSize, pagination.total)} dari{' '}
            {pagination.total} data
          </p>
          <div className="flex gap-2">
            <button
              onClick={handlePrevPage}
              disabled={pagination.current === 1}
              className="p-2 border border-gray-300 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-4 py-2 text-sm text-gray-700">
              {pagination.current} / {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            <button
              onClick={handleNextPage}
              disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
              className="p-2 border border-gray-300 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

Table.displayName = 'Table';
