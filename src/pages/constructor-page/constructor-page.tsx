import { BurgerConstructor, BurgerIngredients } from '@components';
import { fetchIngredients } from '@slices';
import { Preloader } from '@ui';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '@services/store';

import type { RootState } from '@services/store';

import styles from './constructor-page.module.css';

export const ConstructorPage = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const ingredients = useSelector((state: RootState) => state.ingredients.ingredients);
  const isLoading = useSelector((state: RootState) => state.ingredients.isLoading);
  const error = useSelector((state: RootState) => state.ingredients.error);

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты: {error}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }

  return (
    <main className={styles.containerMain}>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};
