/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useMemo } from 'react';
import { getColumnOffset } from './service';
import { DEFAULT_COLUMN_WIDTH, ITableColumn } from './types';

export const useColumnWidths = <T> (columns: ITableColumn<T>[]) => {
  // calculate all cell width that set explicitly
  const fixedWidth = useMemo(
    () => columns.reduce<number>(
      (acc: number, column: ITableColumn<T>) => (typeof column.width === 'string' ?
        acc + parseInt(column.width, 10) :
        acc),
      0,
    ),
    [columns],
  );

  // calculate sum of weighted (relative width) columns
  const responsiveWidthParts = useMemo(
    () => columns.reduce<number>((acc: number, column: ITableColumn<T>) => {
      let x = acc;
      if (typeof column.width === 'number') {
        // use width value
        x += column.width;
      } else if (typeof column.width !== 'string') {
        // fallback to default width
        x += DEFAULT_COLUMN_WIDTH;
      }
      return x;
    }, 0),
    [columns],
  );

  // calculate min table width based on explicit width and minWidth attrs
  const minWidth = useMemo(
    () => columns.reduce<number>(
      (acc: number, column: ITableColumn<T>) => (typeof column.width === 'string' ?
        acc + parseInt(column.width, 10) :
        acc + parseInt(column.minWidth || '0', 10)),
      0,
    ),
    [columns],
  );

  return {
    fixedWidth,
    minWidth,
    responsiveWidthParts,
  };
};

const getResponsiveWidth = (width: number, minWidth: string): string => (width < parseInt(minWidth, 10) ? minWidth : `${Math.floor(width)}px`);

// calculate final column width based on
// container width, column explicit width and weights
export const useColumns = <T> (
  fixedWidth: number,
  columns: ITableColumn<T>[],
  containerWidth: number,
  responsiveWidthParts: number,
) => {
  return React.useMemo<ITableColumn<T>[]>(() => {
    const partWidth = (containerWidth - fixedWidth) / responsiveWidthParts;
    const lastStickyColumnName = columns.filter((
      item,
    ) => item.sticky).slice(-1)[0]?.key;
    return columns.map(
      (column, index, columnsArr): ITableColumn<T> => ({
        ...column,
        width:
          typeof column.width === 'string' ?
            column.width :
            getResponsiveWidth(
              (column.width || DEFAULT_COLUMN_WIDTH) * partWidth,
              column.minWidth || '0',
            ),
        $stickyOffset: column.sticky ? getColumnOffset(columnsArr, index) : 0,
        $isLastSticky: lastStickyColumnName === column.key,
      }),
    );
  }, [fixedWidth, columns, containerWidth, responsiveWidthParts]);
};
