import { FC, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { UserState } from '../../../../state/common/types';
import { getOwnerAvatar } from '../../../../utils/nameService';
import { shortenAddress } from '../../../../utils/solanaUtils';
import { getDiscordAvatarUrl, getDiscordUri } from '../../../../utils';
import { /* PencilIcon, */ TwitterIcon2 } from '../../../../icons';
import DiscordIcon from '../../../../icons/DiscordIcon2';
import { commonActions } from '../../../../state/common/actions';
// import Button from '../../../../components/Button';
import styles from './ProfileCard.module.scss';
// import { LinkWithArrow } from '../../../../components/LinkWithArrow';

interface ProfileCard {
  name?: string;
  twitterName?: string;
  walletPubkey: string;
  user?: UserState;
}

export const ProfileCard: FC<ProfileCard> = ({
  name,
  walletPubkey,
  twitterName,
  user,
}) => {
  const dispatch = useDispatch();
  const avatarUrl = getDiscordAvatarUrl(user?.discordId, user?.avatar);

  const unlink = useCallback(() => {
    dispatch(commonActions.deleteUser(walletPubkey));
  }, [dispatch, walletPubkey]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.userInfo}>
        <h2 className={styles.title}>User info</h2>
        <h3 className={styles.description}>
          <div
            className={styles.ownerAvatar}
            style={{
              backgroundImage: `url(${
                avatarUrl ?? getOwnerAvatar(twitterName)
              })`,
            }}
          >
            {/* <div className={styles.editAvatarIcon}>
              <PencilIcon />
            </div> */}
          </div>

          <div className={styles.ownerInfo}>
            {!!name && <p className={styles.name}>{name}</p>}
            <p className={styles.ownerAddress}>
              {shortenAddress(walletPubkey)}
            </p>
          </div>

          {twitterName && (
            <a
              className={styles.ownerTwitter}
              href={`https://twitter.com/${twitterName}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterIcon2 width={24} className={styles.twitterIcon} />
            </a>
          )}
        </h3>
        {!user ? (
          <a
            href={getDiscordUri(walletPubkey)}
            className={styles.discordButton}
            rel="noopener noreferrer"
          >
            <DiscordIcon className={styles.logo} /> Link discord
          </a>
        ) : (
          <button onClick={unlink} className={styles.discordButton}>
            <DiscordIcon className={styles.logo} /> Unlink discord
          </button>
        )}
      </div>
    </div>
  );
};
