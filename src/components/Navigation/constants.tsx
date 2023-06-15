import { PATHS } from '@frakt/constants';
import {
  Discord,
  DiscordDark,
  Twitter,
  TwitterDark,
  Medium,
  MediumDark,
  Github,
  GithubDark,
  Docs,
  DocsDark,
  Dashboard,
  DashboardDark,
  Borrow,
  BorrowDark,
  Raffles,
  RafflesDark,
  Staking,
  StakingDark,
  Lending,
  LendingDark,
} from '@frakt/icons';

import { Navigation } from './types';

export const COMMUNITY_LINKS = [
  {
    label: 'Discord',
    icon: Discord,
    iconDark: DiscordDark,
    href: process.env.FRAKT_DISCORD_SERVER,
  },
  {
    label: 'Twitter',
    icon: Twitter,
    iconDark: TwitterDark,
    href: 'https://twitter.com/FRAKT_HQ',
  },
];

export const DOCUMENTATIONS_LINKS = [
  {
    label: 'Docs',
    icon: Docs,
    iconDark: DocsDark,
    href: 'https://docs.frakt.xyz/frakt/',
  },
  {
    label: 'Medium',
    icon: Medium,
    iconDark: MediumDark,
    href: 'https://medium.com/@frakt_HQ',
  },
  {
    label: 'GitHub',
    icon: Github,
    iconDark: GithubDark,
    href: 'https://github.com/frakt-solana',
  },
];

export const NAVIGATION_LINKS: Navigation[] = [
  {
    pathname: PATHS.ROOT,
    to: PATHS.ROOT,
    label: 'Dashboard',
    icon: Dashboard,
    iconDark: DashboardDark,
    primary: true,
  },
  {
    pathname: PATHS.BORROW_ROOT,
    to: PATHS.BORROW_LITE,
    label: 'Borrow',
    event: 'navigation-borrow',
    icon: Borrow,
    iconDark: BorrowDark,
    primary: true,
  },
  {
    pathname: PATHS.LOANS,
    to: PATHS.LOANS,
    label: 'My loans',
    event: 'navigation-loans',
  },
  {
    pathname: PATHS.BONDS_LITE,
    to: PATHS.BONDS_LITE,
    label: 'Lend',
    event: 'navigation-bonds',
    icon: Lending,
    iconDark: LendingDark,
    primary: true,
  },
  {
    pathname: PATHS.LEND,
    to: PATHS.LEND,
    label: 'Pools',
    event: 'navigation-lend',
  },
  {
    pathname: PATHS.STRATEGIES,
    to: PATHS.STRATEGIES,
    label: 'Strategies',
    event: 'navigation-strategies',
  },
];

export const SECONDARY_NAVIGATION_LINKS: Navigation[] = [
  {
    href: PATHS.STAKING,
    label: 'Staking',
    event: 'navigation-staking',
    icon: Staking,
    iconDark: StakingDark,
  },
  {
    pathname: PATHS.LIQUIDATIONS,
    to: PATHS.LIQUIDATIONS,
    label: 'Raffles',
    event: 'navigation-liquidation',
    icon: Raffles,
    iconDark: RafflesDark,
  },
];
