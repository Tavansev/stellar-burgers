import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { selectUserState } from '@services/selectors';
import { useDispatch, useSelector } from '@services/store';
import { register } from '@services/userSlice';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const errorText = useSelector(selectUserState).error ?? '';

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(register({ name: userName, email, password })).then((action) => {
      if (register.fulfilled.match(action)) void navigate('/', { replace: true });
    });
  };

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
