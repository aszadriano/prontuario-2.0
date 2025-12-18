import React from 'react';
import clsx from 'clsx';

type Column<T> = {
  header: string;
  accessor: (row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
};

type Props<T> = {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  getRowId?: (row: T) => string;
  emptyMessage?: string;
};

export function Table<T>({ data, columns, onRowClick, getRowId, emptyMessage = 'Nenhum registro encontrado' }: Props<T>) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.header} style={{ textAlign: col.align ?? 'left', width: col.width }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="table-empty">
                {emptyMessage}
              </td>
            </tr>
          )}
          {data.map((row, idx) => {
            const rowId = getRowId ? getRowId(row) : String(idx);
            return (
              <tr
                key={rowId}
                className={clsx(onRowClick && 'table-row-clickable')}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td key={col.header} style={{ textAlign: col.align ?? 'left' }}>
                    {col.accessor(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
