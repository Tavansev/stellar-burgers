import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { selectUserState } from '@services/selectors';
import { useDispatch, useSelector } from '@services/store';
import { login } from '@services/userSlice';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const errorText = useSelector(selectUserState).error ?? '';

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    const from =
      (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/';
    void dispatch(login({ email, password })).then((action) => {
      if (login.fulfilled.match(action)) void navigate(from, { replace: true });
    });
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
