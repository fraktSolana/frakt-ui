import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';

import { useLocalStorage } from '@frakt/hooks';
import { Modal } from '@frakt/components/Modal';
import { CloseModal } from '@frakt/icons';
import { fetchTopNotification } from '@frakt/api/common';

import styles from './NotificationModal.module.scss';

const HIDE_NOTIFICATION_TIME = 60 * 60; //? Don't show notification after closing or following a link for X seconds

export const NotificationModal = () => {
  const { data: topNotificationHtml } = useQuery(
    ['topNotification'],
    fetchTopNotification,
    {
      staleTime: 30 * 60 * 1000, // 30 mins
      refetchOnWindowFocus: false,
    },
  );

  //? Store in localstorage unix timestamp when user closed notification
  const [closedByUserTimestamp, setClosedByUserTimeStamp] = useLocalStorage<
    number | null
  >('userClosedNotificationModal', null);

  //? If hide time expired -- show notification again
  useEffect(() => {
    if (
      closedByUserTimestamp &&
      moment().unix() - closedByUserTimestamp > HIDE_NOTIFICATION_TIME
    ) {
      setClosedByUserTimeStamp(null);
    }
  }, [closedByUserTimestamp, setClosedByUserTimeStamp]);

  const onCancel = useCallback(
    () => setClosedByUserTimeStamp(moment().unix()),
    [setClosedByUserTimeStamp],
  );

  //? Add event listener for each link in html from BE. To auto hide and close modal when user clicks on link
  const contentRef = useRef(null);
  useLayoutEffect(() => {
    if (topNotificationHtml) {
      const links: NodeList = contentRef.current?.querySelectorAll('a');
      links?.forEach((link) => link.addEventListener('click', onCancel));
    }
  }, [topNotificationHtml, onCancel]);

  return (
    <Modal
      visible={!!(!closedByUserTimestamp && topNotificationHtml)} //? Show notification when html exists and modal is not hidden
      centered
      onCancel={onCancel}
      width={500}
      footer={false}
      closable={false}
      className={styles.modal}
    >
      <div className={styles.closeModalSection}>
        <div className={styles.closeModalIcon} onClick={onCancel}>
          <CloseModal />
        </div>
      </div>

      <div
        className={styles.content}
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: topNotificationHtml }}
      />
    </Modal>
  );
};
