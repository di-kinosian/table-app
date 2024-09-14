import { ITableColumn, ITableRecord, ITableRecordKey } from './types';

function getRowKey<T extends Record<string, unknown>>(
  rowKey: ITableRecordKey<T>,
  record: ITableRecord<T> | T
): string {
  if (typeof rowKey === 'function') {
    return rowKey(record);
  }
  if (rowKey in record) {
    // Используйте String() для явного преобразования в строку
    return String(record[rowKey]);
  }
  
  return '';
}

function getColumnOffset<T>(columns: ITableColumn<T>[], index: number): number {
  return columns.slice(0, index).reduce((acc, col) => {
    return acc + parseInt((col.width || 0).toString(), 10);
  }, 0);
}

export { getRowKey, getColumnOffset };

