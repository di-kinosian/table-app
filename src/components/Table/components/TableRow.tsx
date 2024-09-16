/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import cn from 'classnames';
import styles from '../Table.module.scss';
import { ITableRowComponentProps } from '../types';
import TableCell from './TableCell';

const TableRow = <T extends Record<string, any>>(props: ITableRowComponentProps<T>) => {
  return (
    <div
      className={styles.rowWrapper}
      style={{
        width: props.width,
      }}
    >
      <div
        tabIndex={0}
        key={props.record.$rowKey}
        className={styles.row}
        style={{
          width: props.width,
          height: props.rowHeight,
        }}
        role='row'
      >
        {props.columns.map((column) => (
          <TableCell
            key={column.key}
            column={column}
            record={props.record}
            className={cn({
              [styles.lastStickyCell]: props.scrolledHorizontally && column.$isLastSticky,
            })}
          />
        ))}
      </div>
    </div>
  );
};

export default TableRow;
