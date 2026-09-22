import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  type TLoginData,
  type TRegisterData,
} from '@api';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { deleteCookie, setCookie } from '@utils/cookie';

import type { TUser } from '@utils-types';

type TUserState = {
  user: TUser | null;
  isLoading: boolean;
  isAuthChecked: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isLoading: false,
  isAuthChecked: false,
  error: null,
};

const saveTokens = (refreshToken: string, accessToken: string): void => {
  localStorage.setItem('refreshToken', refreshToken);
  setCookie('accessToken', accessToken);
};

const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

export const checkUserAuth = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      return (await getUserApi()).user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Не удалось проверить авторизацию'));
    }
  }
);

export const login = createAsyncThunk<TUser, TLoginData, { rejectValue: string }>(
  'user/login',
  async (data, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      saveTokens(response.refreshToken, response.accessToken);
      return response.user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Не удалось войти'));
    }
  }
);

export const register = createAsyncThunk<TUser, TRegisterData, { rejectValue: string }>(
  'user/register',
  async (data, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      saveTokens(response.refreshToken, response.accessToken);
      return response.user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Не удалось зарегистрироваться'));
    }
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/update', async (data, { rejectWithValue }) => {
  try {
    return (await updateUserApi(data)).user;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Не удалось сохранить данные'));
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Не удалось выйти из аккаунта'));
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? action.error.message ?? 'Не удалось войти';
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ?? action.error.message ?? 'Не удалось зарегистрироваться';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error =
          action.payload ?? action.error.message ?? 'Не удалось сохранить данные';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
