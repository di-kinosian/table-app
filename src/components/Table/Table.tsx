/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { RefObject, UIEvent, useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import cn from 'classnames';
import styles from './Table.module.scss';
import { TableBody, TableHeader } from './components';
import { TableBodyRef } from './components/TableBody';
import { useColumns, useColumnWidths } from './hooks';
import { getRowKey } from './service';
import { ITableColumn, ITableProps, ITableRecord } from './types';

const VERTICAL_SCROLL_WIDTH = 4;

const Table = <T extends Record<string, any>>(props: ITableProps<T>) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [scrolledHorizontally, setScrolledHorizontally] = useState<boolean>(false);
  const {
    height: containerHeight = 0,
    width: containerWidth = 0,
    ref: tableRef,
  } = useResizeDetector();
  const { onScroll: handleScroll, expandedRowKeys } = props;
  const lastScrollPositionRef = useRef<number>(0);
  const tableBodyRef = useRef<TableBodyRef>(null);
  const [doesExpandedRowsOverflow, setExpandedRowsOverflowState] = useState<boolean>(false);

  const hasStickyColumns = useMemo(
    () => props.columns.some((column: ITableColumn<T>) => column.sticky),
    [props.columns]
  );

  const expandedRowKeysMap = useMemo<Record<string, boolean>>(
    () =>
      expandedRowKeys?.length
        ? expandedRowKeys.reduce((map, key) => ({ ...map, [key]: true }), {})
        : {},
    [expandedRowKeys]
  );

  const preparedData = useMemo(
    () =>
      props.dataList?.map((record) => {
        const rowKey = getRowKey(props.rowKey, record);
        return {
          ...record,
          $rowKey: rowKey,
          $isExpanded: Boolean(expandedRowKeysMap[rowKey]),
        } as ITableRecord<T>;
      }),
    [props.dataList, props.rowKey, expandedRowKeysMap]
  );

  const { fixedWidth, minWidth, responsiveWidthParts } = useColumnWidths(props.columns);

  useEffect(() => {
    if (!tableBodyRef.current?.element) return;
    const isBodyOverflowedByExpandedContent =
      tableBodyRef?.current?.element?.scrollHeight > tableBodyRef?.current?.element?.offsetHeight;
    setExpandedRowsOverflowState(isBodyOverflowedByExpandedContent);
  }, [expandedRowKeys]);

  const isVerticalScrollPresent = useMemo(() => {
    if (!preparedData?.length) {
      return false;
    }

    const rowHeight = props.rowHeight ? props.rowHeight : Table.defaultProps.rowHeight;
    const headerHeight = props.headerHeight ? props.headerHeight : Table.defaultProps.headerHeight;

    const tableContentHeight = rowHeight * preparedData.length;
    return containerHeight - headerHeight < tableContentHeight || doesExpandedRowsOverflow;
  }, [
    containerHeight,
    preparedData?.length,
    props.rowHeight,
    props.headerHeight,
    doesExpandedRowsOverflow,
  ]);

  const width = useMemo(() => {
    const scrollBarWidth = isVerticalScrollPresent ? VERTICAL_SCROLL_WIDTH : 0;

    return Math.max(containerWidth, minWidth) - scrollBarWidth;
  }, [containerWidth, minWidth, isVerticalScrollPresent]);

  const isScrollable = useMemo(() => containerWidth < minWidth, [containerWidth, minWidth]);

  // final table columns with accurate widths
  const columns = useColumns<T>(fixedWidth, props.columns, containerWidth, responsiveWidthParts);

  const onScroll = useCallback(
    (event: UIEvent) => {
      if (handleScroll) handleScroll(event);
      if (headerRef.current) {
        headerRef.current.style.transform = `translateX(-${event.currentTarget.scrollLeft}px)`;
        lastScrollPositionRef.current = event.currentTarget.scrollLeft;
      }
      setScrolledHorizontally(event.currentTarget.scrollLeft !== 0);
    },
    [headerRef, handleScroll, setScrolledHorizontally]
  );

  useEffect(() => {
    const bodyElement = tableBodyRef.current;
    const scrollLeft = bodyElement?.getScrollLeft();
    if (bodyElement && scrollLeft !== lastScrollPositionRef.current) {
      bodyElement.scrollTo({ left: lastScrollPositionRef.current });
    }
  }, [tableBodyRef, props.dataList]);

  const renderBody = () => {
    const componentProps = {
      fetchMore: props.fetchMore,
      hasMore: props.hasMore,
      onScroll,
      width,
      isScrollable,
      isLoading: props.isLoading || false,
      loader: props.loader,
      columns,
      dataList: preparedData,
      rowHeight: props.rowHeight,
      rowKey: props.rowKey,
      emptyState: props.emptyState,
      onSelectRow: props.onSelectRow,
      scrolledHorizontally,
      expandableContent: props.expandableContent,
    };

    if (props.tableBody) {
      return <props.tableBody {...componentProps} />;
    }
    return <TableBody<T> {...componentProps} ref={tableBodyRef} />;
  };

  return (
    <div
      className={cn(props.className, styles.table)}
      ref={tableRef as RefObject<HTMLDivElement>}
      style={props.style}
    >
      <TableHeader<T>
        height={props.headerHeight}
        width={width}
        headerRef={headerRef}
        columns={columns}
        hasStickyColumns={hasStickyColumns}
        scrolledHorizontally={scrolledHorizontally}
      />
      {renderBody()}
    </div>
  );
};

Table.defaultProps = {
  headerHeight: 48,
  rowHeight: 48,
};

export default Table;
