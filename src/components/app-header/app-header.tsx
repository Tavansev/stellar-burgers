import { AppHeaderUI } from '@ui';

import { useSelector } from '@services/store';

import type { RootState } from '@services/store';

export const AppHeader = (): React.JSX.Element => {
  const userName = useSelector((state: RootState) => state.user.user?.name);

  return <AppHeaderUI userName={userName} />;
};
