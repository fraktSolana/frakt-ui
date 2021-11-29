import { Helmet } from 'react-helmet';
import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import WhyNeedsSection from './sections/WhyNeedsSection';
import HowItWorksSection from './sections/HowItWorksSection';
import FAQSection from './sections/FAQSection';
import styles from './styles.module.scss';
import Ecosystem from './sections/Ecosystem';
import Partners from './sections/Partners';
import { DiscordIcon, TwitterIcon } from '../../icons';
import Roadmap from './sections/Roadmap';

const HomePage = (): JSX.Element => {
  return (
    <AppLayout>
      <Helmet>
        <title>FRAKTION ART</title>
      </Helmet>
      <Container component="main" className={styles.container}>
        <h1 className={styles.title}>
          BUY, SELL AND <b>FRAKTIONALIZE</b> NFTs
        </h1>
        <h2 className={styles.subtitle}>
          A platform for creating liquid markets for illiquid NFTs. Trade, shop,
          and earn yield on the most liquid decentralized NFT marketplace on
          Solana
        </h2>
        <a
          href="https://docs.fraktion.art"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.launchingSoon}
        >
          Read docs
        </a>
        <div className={styles.separatorDouble} />
        <WhyNeedsSection className={styles.whyNeeds} />
        <div className={styles.separator} />
        <HowItWorksSection className={styles.howItWorks} />
        <div className={styles.separator} />
        <Ecosystem />
        <div className={styles.separator} />
        <Roadmap />
        <div className={styles.separator} />
        <Partners />
        <div className={styles.separator} />
        <FAQSection />
      </Container>
      <footer className={styles.footer}>
        <p>Fraktion</p>
        <div className={styles.socialLinks}>
          <a
            href="https://twitter.com/fraktion_art"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitterIcon width={32} />
          </a>
          <a
            href="https://discord.gg/frakt"
            target="_blank"
            rel="noopener noreferrer"
          >
            <DiscordIcon width={32} />
          </a>
        </div>
      </footer>
    </AppLayout>
  );
};

export default HomePage;
