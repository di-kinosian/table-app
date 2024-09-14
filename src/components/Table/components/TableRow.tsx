/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import cn from 'classnames';
import styles from '../Table.module.scss';
import { ITableRowComponentProps } from '../types';
import TableCell from './TableCell';

const TableRow = <T extends Record<string, any>>(props: ITableRowComponentProps<T>) => {
  const onSelectRow = (record: T) => () => {
    const selection = window.getSelection()?.toString();
    if (props.onSelectRow && selection?.length === 0) {
      props.onSelectRow(record as T);
    }
  };
  const handleKeyDown = (key: string, record: T) => {
    if (key === 'Enter') {
      if (props.onSelectRow) {
        props.onSelectRow(record as T);
      }
      return true;
    }
    return false;
  };
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
        onClick={onSelectRow(props.record)}
        onKeyDown={(e) => {
          if (handleKeyDown(e.key, props.record)) {
            e.stopPropagation();
          }
        }}
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
      {props.record.$isExpanded && props.expandableContent && props.expandableContent(props.record)}
    </div>
  );
};

export default TableRow;
