import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useLocalStorage } from '@frakt/hooks';
import { Modal } from '@frakt/components/Modal';
import { CloseModal } from '@frakt/icons';
import { fetchTopNotification } from '@frakt/api/common';

import styles from './NotificationModal.module.scss';

export const NotificationModal = () => {
  const { data: topNotificationHtml } = useQuery(
    ['topNotification'],
    fetchTopNotification,
    {
      staleTime: 30 * 60 * 1000, // 30 mins
      refetchOnWindowFocus: false,
    },
  );

  //? Store in localstorage prev notification
  const [previousClosedNotification, setPreviousClosedNotification] =
    useLocalStorage<string | null>('userClosedNotificationModal', null);

  //? If its a new notification -- show notification again
  useEffect(() => {
    if (!topNotificationHtml) {
      return;
    }
    if (!previousClosedNotification) {
      return;
    }
    if (topNotificationHtml === previousClosedNotification) {
      return;
    }
    setPreviousClosedNotification(null);
  }, [
    previousClosedNotification,
    setPreviousClosedNotification,
    topNotificationHtml,
  ]);

  const onCancel = useCallback(
    () => setPreviousClosedNotification(topNotificationHtml),
    [setPreviousClosedNotification, topNotificationHtml],
  );

  //? Add event listener for each link in html from BE. To auto hide and close modal when user clicks on link
  const contentRef = useRef(null);
  useLayoutEffect(() => {
    if (topNotificationHtml) {
      const links: NodeList = contentRef.current?.querySelectorAll('a');
      links?.forEach((link) => link.addEventListener('click', onCancel));
    }
  }, [topNotificationHtml, onCancel]);

  const showModal =
    topNotificationHtml && topNotificationHtml !== previousClosedNotification;

  return (
    <Modal
      visible={showModal} //? Show notification when html exists and modal is not hidden
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

// raw html example
{
  /* <h1 style='text-align: center; font-size: 72px'>🎉</h1> <h1 style='text-align: center'>BONDS ARE HERE!</h1><p style='text-align: center; margin-bottom: 12px;'>High LTV, low fees and the most flexible <a href='/bonds'>lending</a> and <a href='/borrow'>borrowing</a> experience on Solana</p><a href='/bonds' style='color: #000000;text-align: center;display: flex;align-items: center;font-size: 14px;background: #9CFF1F;padding: 12px;width: 100%;border: unset; display: block'>Some action</a> */
}