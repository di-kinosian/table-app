/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react";
import {
  RefObject,
  UIEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { useResizeDetector } from "react-resize-detector";
import cn from "classnames";
import styles from "./Table.module.scss";
import { TableBody, TableHeader } from "./components";
import { TableBodyRef } from "./components/TableBody";
import { useColumns, useColumnWidths } from "./hooks";
import { getRowKey } from "./service";
import { ITableColumn, ITableProps, ITableRecord } from "./types";

const Table = <T extends Record<string, any>>(props: ITableProps<T>) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [scrolledHorizontally, setScrolledHorizontally] =
    useState<boolean>(false);
  const {
    width: containerWidth = 0,
    ref: tableRef,
  } = useResizeDetector();
  const lastScrollPositionRef = useRef<number>(0);
  const tableBodyRef = useRef<TableBodyRef>(null);

  const hasStickyColumns = useMemo(
    () => props.columns.some((column: ITableColumn<T>) => column.sticky),
    [props.columns],
  );

  const preparedData = useMemo(
    () =>
      props.dataList?.map((record) => {
        const rowKey = getRowKey(props.rowKey, record);
        return {
          ...record,
          $rowKey: rowKey,
        } as ITableRecord<T>;
      }),
    [props.dataList, props.rowKey],
  );

  const { fixedWidth, minWidth, responsiveWidthParts } = useColumnWidths(
    props.columns,
  );

  const width = useMemo(() => {
    return Math.max(containerWidth, minWidth);
  }, [containerWidth, minWidth]);

  const isScrollable = useMemo(
    () => containerWidth < minWidth,
    [containerWidth, minWidth],
  );

  // final table columns with accurate widths
  const columns = useColumns<T>(
    fixedWidth,
    props.columns,
    containerWidth,
    responsiveWidthParts,
  );

  const onScroll = useCallback(
    (event: UIEvent) => {
      if (headerRef.current) {
        headerRef.current.style.transform = `translateX(-${event.currentTarget.scrollLeft}px)`;
        lastScrollPositionRef.current = event.currentTarget.scrollLeft;
      }
      setScrolledHorizontally(event.currentTarget.scrollLeft !== 0);
    },
    [headerRef, setScrolledHorizontally],
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
      onScroll,
      width,
      isScrollable,
      isLoading: props.isLoading || false,
      loader: props.loader,
      columns,
      dataList: preparedData,
      rowHeight: props.rowHeight,
      rowKey: props.rowKey,
      scrolledHorizontally,
    };
    return <TableBody<T> {...componentProps} ref={tableBodyRef} />;
  };

  return (
    <div
      className={cn(props.className, styles.table)}
      ref={tableRef as RefObject<HTMLDivElement>}
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
