import React, { ReactElement } from "react";

const DEFAULT_COLUMN_WIDTH: number = 100;

interface ITableSystemFields {
  $isExpanded: boolean;
  $rowKey: string;
}

type ITableRecord<T> = T & ITableSystemFields;

type ITableRecordKey<T> = string | ((record: ITableRecord<T> | T) => string);

interface ITableColumn<T> {
  $isLastSticky?: boolean;
  $stickyOffset?: number;
  cellStyle?:
    | React.CSSProperties
    | ((record: ITableRecord<T>) => React.CSSProperties);
  dataIndex?: keyof T;
  key: string;
  // default is 100 relative points
  width?: number | string;
  minWidth?: string;
  renderCell?: (record: ITableRecord<T>) => ReactElement | string;
  renderTitle?: () => ReactElement | string;
  sticky?: boolean;
  // absolute value like '120px'
  title?: string;
  titleStyle?: React.CSSProperties;
}

interface ITableHeaderProps<T> {
  columns: ITableColumn<T>[];
  hasStickyColumns: boolean;
  headerRef: React.MutableRefObject<HTMLDivElement | null>;
  height?: number;
  scrolledHorizontally?: boolean;
  width: number;
}

interface ITableRowProps<T> {
  record: T;
  width: number;
}

interface ITableRowComponentProps<T> {
  columns: ITableColumn<T>[];
  expandableContent?: (data: ITableRecord<T>) => JSX.Element;
  onSelectRow?: (data: T) => void;
  record: ITableRecord<T>;
  rowHeight?: number;
  rowKey: ITableRecordKey<T>;
  scrolledHorizontally?: boolean;
  width: number;
}

interface ITableBodyProps<T> {
  columns: ITableColumn<T>[];
  dataList?: ITableRecord<T>[];
  emptyState?: ReactElement;
  expandableContent?: (record: ITableRecord<T>) => JSX.Element;
  fetchMore?: () => void;
  hasMore?: boolean;
  headerHeight?: number;
  isLoading?: boolean;
  isScrollable: boolean;
  loader?: ReactElement;
  onScroll?: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void;
  onSelectRow?: (data: T) => void;
  rowHeight?: number;
  rowKey: ITableRecordKey<T>;
  scrolledHorizontally?: boolean;
  tableBody?: React.ComponentType<ITableBodyProps<T>> | null;
  width: number;
}

interface ITableProps<T> {
  className?: string;
  columns: ITableColumn<T>[];
  dataList?: T[];
  emptyState?: ReactElement;
  expandableContent?: (record: ITableRecord<T>) => JSX.Element;
  expandedRowKeys?: string[];
  fetchMore?: () => void;
  hasMore?: boolean;
  headerHeight?: number;
  isLoading?: boolean;
  loader?: ReactElement;
  onScroll?: (event: React.UIEvent) => void;
  onSelectRow?: (data: T) => void;
  rowHeight?: number;
  rowKey: ITableRecordKey<T>;
  style?: React.CSSProperties;
  tableBody?: React.ComponentType<ITableBodyProps<T>> | null;
}

interface ITableCellProps<T> {
  className?: string;
  column: ITableColumn<T>;
  record: ITableRecord<T>;
}
export { DEFAULT_COLUMN_WIDTH };
export type {
  ITableBodyProps,
  ITableCellProps,
  ITableColumn,
  ITableHeaderProps,
  ITableProps,
  ITableRecord,
  ITableRecordKey,
  ITableRowProps,
  ITableSystemFields,
  ITableRowComponentProps,
};
