import { logoutUser } from '@slices';
import { ProfileMenuUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDispatch } from '@services/store';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = (): void => {
    void dispatch(logoutUser()).then(() => {
      void navigate('/login');
    });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
