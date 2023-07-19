import React, { FC, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { useQuery } from '@tanstack/react-query';
import { fetchTopBarNotification } from '@frakt/api/common';
import { CloseModal } from '@frakt/icons';

import styles from './TopNotification.module.scss';

const CSS_HEADER_HEIGHT_VAR = '--header-height';

const useTopNotification = () => {
  const notificationRef = useRef<HTMLDivElement>(null);
  const initialHeaderHeight = useRef(0);
  const [closed, setClosed] = useState(false);

  const { data: topbarNotificationHtml } = useQuery(
    ['topBarNotification'],
    fetchTopBarNotification,
    {
      staleTime: 30 * 60 * 1000, // 30 mins
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (closed) return;

    const height = notificationRef.current.clientHeight || 0;

    const rootElement = document.querySelector<HTMLElement>(':root');

    const initialHeaderHeightPx = getComputedStyle(
      rootElement,
    ).getPropertyValue(CSS_HEADER_HEIGHT_VAR);

    initialHeaderHeight.current = parseInt(initialHeaderHeightPx, 10);
    rootElement.style.setProperty(
      CSS_HEADER_HEIGHT_VAR,
      `${initialHeaderHeight.current + height}px`,
    );

    return () => {
      rootElement.style.setProperty(
        CSS_HEADER_HEIGHT_VAR,
        `${initialHeaderHeight.current}px`,
      );
    };
  }, [closed, topbarNotificationHtml]);

  useEffect(() => {
    const onResize = () => {
      const height = notificationRef.current.clientHeight || 0;
      const rootElement = document.querySelector<HTMLElement>(':root');
      rootElement.style.setProperty(
        CSS_HEADER_HEIGHT_VAR,
        `${initialHeaderHeight.current + height}px`,
      );
    };

    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  const close = () => {
    document
      .querySelector<HTMLElement>(':root')
      .style.setProperty(
        CSS_HEADER_HEIGHT_VAR,
        `${initialHeaderHeight.current || 0}px`,
      );
    setClosed(true);
  };

  return {
    content: topbarNotificationHtml,
    notificationRef,
    hidden: !!(closed || !topbarNotificationHtml),
    close,
  };
};

export const TopNotification: FC = () => {
  const { content, notificationRef, hidden, close } = useTopNotification();

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.wrapper__hidden]: hidden,
      })}
      ref={notificationRef}
    >
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <div className={styles.closeIcon} onClick={close}>
        <CloseModal />
      </div>
    </div>
  );
};
