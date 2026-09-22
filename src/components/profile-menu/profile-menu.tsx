import { ProfileMenuUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDispatch } from '@services/store';
import { logout } from '@services/userSlice';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = (): void => {
    void dispatch(logout()).then((action) => {
      if (logout.fulfilled.match(action)) void navigate('/login', { replace: true });
    });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
