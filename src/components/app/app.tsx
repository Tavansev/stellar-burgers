import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
} from '@pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  type Location,
} from 'react-router-dom';

import { fetchIngredients } from '@services/ingredientsSlice';
import { selectIngredientsState, selectUserState } from '@services/selectors';
import { useDispatch, useSelector } from '@services/store';
import { checkUserAuth } from '@services/userSlice';
import { clsx } from '@utils/class-names';

import type { AppContentProps } from './type';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const {
    items: ingredients,
    isLoading: isIngredientsLoading,
    error: ingredientsError,
  } = useSelector(selectIngredientsState);

  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError}
      />
    </div>
  );
};

export default App;

/* Маршруты показываются только когда ингредиенты загружены: без них не
   отрисовать ни конструктор, ни состав заказа. */
const AppContent = ({
  ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={clsx(styles.message, 'text text_type_main-medium')}>
        Не удалось загрузить ингредиенты
        {error ? `: ${error}` : '.'}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={clsx(styles.message, 'text text_type_main-medium')}>
        Нет ингредиентов
      </p>
    );
  }

  return <RouteComponent />;
};

type TRouteLocation = Omit<Location, 'state'> & {
  state: { background?: TRouteLocation } | null;
};

const RouteComponent = (): React.JSX.Element => {
  const location = useLocation() as TRouteLocation;
  const backgroundLocation = location.state?.background;

  return (
    <>
      <Routes location={backgroundLocation ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthRoute>
              <ForgotPassword />
            </AuthRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <AuthRoute>
              <ResetPassword />
            </AuthRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path="/ingredients/:id" element={<IngredientDetails />} />
        <Route path="/feed/:number" element={<OrderInfo />} />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <DetailModal>
                <IngredientDetails />
              </DetailModal>
            }
          />
          <Route
            path="/feed/:number"
            element={
              <DetailModal>
                <OrderInfo />
              </DetailModal>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <DetailModal>
                  <OrderInfo />
                </DetailModal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};

const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => {
  const location = useLocation();
  const { user, isAuthChecked } = useSelector(selectUserState);
  if (!isAuthChecked) return <Preloader />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
};

const AuthRoute = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  const { user, isAuthChecked } = useSelector(selectUserState);
  if (!isAuthChecked) return <Preloader />;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const DetailModal = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  const navigate = useNavigate();
  return (
    <Modal title="" onClose={() => void navigate(-1)}>
      {children}
    </Modal>
  );
};
