/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useCallback } from 'react';
import cn from 'classnames';
import { ITableColumn, ITableHeaderProps } from '..';
import styles from '../Table.module.scss';

/**
 * Table Header columns rendering strategy:
 * - sticky columns rendered separately at root level for top-most fixation
 * - all other columns wrapped inside scrollable container:
 * - - shadow copies of sticky column without content to keep correct alignment
 * - - the rest of regular columns
 */
const TableHeader = <T extends Record<string, any>>(props: ITableHeaderProps<T>) => {
  const renderHeaderCell = useCallback((column: ITableColumn<T>) => {
    return (
      <>
        {column.renderTitle ? (
          column.renderTitle()
        ) : (
          <div className={styles.cellValue}>{column.title}</div>
        )}
      </>
    );
  }, []);

  return (
    <div
      className={`${styles.headerContainer} notes-default`}
      style={{ lineHeight: `${props.height}px` }}
    >
      {props.hasStickyColumns &&
        props.columns
          .filter((c) => c.sticky)
          .map((c) => (
            <div
              className={cn(styles.headerCell, styles.sticky, {
                [styles.lastStickyCell]: props.scrolledHorizontally && c.$isLastSticky,
              })}
              key={c.key}
              role='columnheader'
              style={{
                ...c.titleStyle,
                width: c.width,
                left: c.$stickyOffset,
                height: props.height,
              }}
            >
              {renderHeaderCell(c)}
            </div>
          ))}
      <div
        className={styles.header}
        style={{
          height: props.height,
          width: props.width,
        }}
        ref={props.headerRef}
      >
        {props.columns.map((c) =>
          c.sticky ? (
            <div
              className={`${styles.headerCell}`}
              key={c.key}
              style={{ ...c.titleStyle, width: c.width }}
            >
              &nbsp;
            </div>
          ) : (
            <div
              className={`${styles.headerCell}`}
              key={c.key}
              role='columnheader'
              style={{ ...c.titleStyle, width: c.width }}
            >
              {renderHeaderCell(c)}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default TableHeader;
