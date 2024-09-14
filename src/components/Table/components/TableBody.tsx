import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';

import cn from 'classnames';

import { ITableBodyProps } from '..';

import styles from '../Table.module.scss';
import { ITableRecord } from '../types';
import TableRow from './TableRow';
import { Loader } from '../../Loader';

type UseInfinityLoaderParams = {
  distance?: number;
  fetcher?: () => void;
  hasMore?: boolean;
};

type UseInfinityLoaderTypes = [React.RefObject<Element>, React.RefObject<Element>];

export const useInfinityLoader = ({
  distance = 100,
  fetcher,
  hasMore,
}: UseInfinityLoaderParams): UseInfinityLoaderTypes => {
  const scrollerRef = useRef<HTMLElement>(null);
  const loaderRef = useRef<Element>(null);

  useLayoutEffect(() => {
    const loaderNode = loaderRef.current;
    const scrollContainerNode = scrollerRef.current;
    if (!fetcher && !scrollContainerNode && !loaderNode) return undefined;

    const options = {
      root: scrollContainerNode,
      rootMargin: `0px 0px ${distance}px 0px`,
    };

    let previousY: number | undefined;
    let previousRatio = 0;
    const listener: IntersectionObserverCallback = (entries) => {
      entries.forEach(({ isIntersecting, intersectionRatio, boundingClientRect = {} }) => {
        const { y } = boundingClientRect;
        if (
          isIntersecting &&
          intersectionRatio >= previousRatio &&
          (!previousY || (!!y && y < previousY))
        ) {
          fetcher?.();
        }
        previousY = y;
        previousRatio = intersectionRatio;
      });
    };
    const observer = new IntersectionObserver(listener, options);
    if (loaderNode) {
      observer.observe(loaderNode);
    }

    return () => observer.disconnect();
  }, [distance, fetcher, hasMore]);

  return [scrollerRef, loaderRef];
};

const TableBodyContent = <T extends Record<string, any>>(props: ITableBodyProps<T>) => {
  if (!props.dataList?.length) {
    return props.emptyState || null;
  }

  return (
    <div >
      {props.dataList?.map((record: ITableRecord<T>) => (
        <TableRow
          key={record.$rowKey}
          record={record}
          width={props.width}
          rowKey={props.rowKey}
          onSelectRow={props.onSelectRow}
          rowHeight={props.rowHeight}
          columns={props.columns}
          scrolledHorizontally={props.scrolledHorizontally}
          expandableContent={props.expandableContent}
        />
      ))}
    </div>
  );
};

export type TableBodyRef =
  | {
      element: HTMLElement | null;
      getScrollLeft: () => number | undefined;
      scrollTo: (options?: ScrollToOptions) => void;
    }
  | undefined;

const TableBody = forwardRef(
  <T extends Record<string, any>>(
    props: ITableBodyProps<T>,
    ref: React.ForwardedRef<TableBodyRef>
  ) => {
    const [scrollerRef, loaderRef] = useInfinityLoader({
      fetcher: props.fetchMore,
    });

    const handleScrollLeft = useCallback(
      (options?: ScrollToOptions) => {
        scrollerRef.current?.scrollTo(options);
      },
      [scrollerRef]
    );

    const getScrollLeft = useCallback(() => scrollerRef.current?.scrollLeft, [scrollerRef]);

    useImperativeHandle(
      ref,
      () => ({
        scrollTo: handleScrollLeft,
        getScrollLeft,
        element: scrollerRef.current as HTMLElement,
      }),
      [handleScrollLeft, getScrollLeft, scrollerRef]
    );

    if (props.isLoading) {
      return (
        <div className={styles.loaderContainer}>
          {props.loader ? props.loader : <Loader size={32} />}
        </div>
      );
    }

    return (
      <div
        ref={scrollerRef as any}
        className={cn(styles.body, {
          [styles.scrollable]: props.isScrollable,
        })}
        onScroll={props.onScroll}
      >
        <TableBodyContent<T> {...props} />
        {props.hasMore && (
          <div ref={loaderRef as any} className={styles.infinityLoaderContainer}>
            {props.loader ? props.loader : <Loader size={32} />}
          </div>
        )}
      </div>
    );
  }
);

TableBody.displayName = 'TableBody';

export default TableBody as <T extends Record<string, any>>(
  props: ITableBodyProps<T> & {
    ref: React.ForwardedRef<TableBodyRef>;
  }
) => JSX.Element;
