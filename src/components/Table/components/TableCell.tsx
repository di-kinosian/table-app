/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { CSSProperties, ReactNode, useMemo } from 'react';
import cn from 'classnames';
import { ITableCellProps, ITableRecord } from '..';
import styles from '../Table.module.scss';

const TableCell = <T extends Record<string, any>>(props: ITableCellProps<T>) => {
  const { column, record, className } = props;

  const cellStyle = useMemo<CSSProperties>(() => {
    let customStyles = column.cellStyle;
    if (typeof column.cellStyle === 'function') {
      customStyles = column.cellStyle(record);
    }

    return {
      ...customStyles,
      width: column.width,
      position: column.sticky ? 'sticky' : 'initial',
      left: column.sticky ? column.$stickyOffset : 'initial',
    };
  }, [record, column]);

  const cellValue = useMemo(() => {
    let value: string | ReactNode = '';

    if (typeof column.renderCell === 'function') {
      // render is a function, it might return ReactComponent or string
      value = column.renderCell(record as ITableRecord<T>);
    } else if (column.dataIndex && column.dataIndex in record) {
      // render not provided, get value from record
      value = record[column.dataIndex as never];
    }

    // wrap plain string value with container
    if (typeof value === 'string') {
      value = (
        <div className={styles.cellValue} title={value}>
          {value}
        </div>
      );
    }

    return value;
  }, [column, record]);

  return (
    <div
      className={cn(styles.cell, className)}
      key={column.key}
      style={cellStyle}
    >
      {cellValue as React.ReactNode}
    </div>
  );
};

export default TableCell;
