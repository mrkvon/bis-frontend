import illustration from 'assets/happy-earth-TODO-replace-with-original.webp'
import classNames from 'classnames'
import { ExternalButtonLink } from 'components'
import { InfoMessage } from 'components/InfoMessage/InfoMessage'
import { ReactNode } from 'react'
import { Link, To } from 'react-router-dom'
import styles from './Home.module.scss'

export interface HomeButtonConfig {
  title: string
  detail: ReactNode
  link: To
  theme:
    | 'createEvent'
    | 'editEvent'
    | 'closeEvent'
    | 'opportunities'
    | 'myEvents'
    | 'myProfile'
    | 'simple'
}

export const Home = ({ buttons }: { buttons: HomeButtonConfig[] }) => (
  <>
    <InfoMessage id="guide-bis-usage" closable>
      <ExternalButtonLink
        secondary
        target="_blank"
        rel="noopener noreferrer"
        href="https://podpora.brontosaurus.cz"
      >
        Průvodce používání BIS
      </ExternalButtonLink>
    </InfoMessage>
    <div className={styles.container}>
      <nav className={styles.mainMenu}>
        {buttons.map(({ title, detail, link, theme }) => (
          <Link
            to={link}
            key={title}
            className={classNames(
              styles.menuItem,
              styles[theme],
              !link && styles.disabled,
            )}
            aria-disabled={!link}
            id={theme}
          >
            <header className={styles.title}>{title}</header>
            <div className={styles.detail}>{detail}</div>
          </Link>
        ))}
      </nav>
      <img className={styles.illustration} src={illustration} alt="" />
    </div>
  </>
)
