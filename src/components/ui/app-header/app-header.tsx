import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';

import { clsx } from '@utils/class-names';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

export const AppHeaderUI = ({ userName }: TAppHeaderUIProps): React.JSX.Element => (
  <header className={clsx(styles.header)}>
    <nav className={clsx(styles.menu)}>
      <div className={clsx(styles.menu_part_left)}>
        <NavLink
          to="/"
          end
          className={({ isActive }) => clsx(styles.link, isActive && styles.link_active)}
        >
          <BurgerIcon type={'primary'} className={clsx(styles.icon)} />
          <p className={clsx(styles.label)}>Конструктор</p>
        </NavLink>
        <NavLink
          to="/feed"
          className={({ isActive }) => clsx(styles.link, isActive && styles.link_active)}
        >
          <ListIcon type={'primary'} className={clsx(styles.icon)} />
          <p className={clsx(styles.label)}>Лента заказов</p>
        </NavLink>
      </div>
      <div className={clsx(styles.logo)}>
        <Logo />
      </div>
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          clsx(styles.link, styles.link_position_last, isActive && styles.link_active)
        }
      >
        <ProfileIcon type={'primary'} className={clsx(styles.icon)} />
        <p className={clsx(styles.label)}>
          {userName === '' ? 'Личный кабинет' : userName}
        </p>
      </NavLink>
    </nav>
  </header>
);
