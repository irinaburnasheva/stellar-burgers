import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  registerUserApi,
  TRegisterData,
  loginUserApi,
  TLoginData,
  getUserApi,
  updateUserApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi
} from '@api';

import { deleteCookie, setCookie } from '../../utils/cookie';

export const registerUserThunk = createAsyncThunk(
  'user/register',
  async (registerData: TRegisterData) => {
    const authData = await registerUserApi(registerData);

    setCookie('accessToken', authData.accessToken);
    localStorage.setItem('refreshToken', authData.refreshToken);

    return authData.user;
  }
);

export const loginUserThunk = createAsyncThunk(
  'user/login',
  async (loginData: TLoginData) => {
    const authData = await loginUserApi(loginData);

    setCookie('accessToken', authData.accessToken);
    localStorage.setItem('refreshToken', authData.refreshToken);

    return authData.user;
  }
);

export const logoutUserThunk = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.clear();
});

export const getUserThunk = createAsyncThunk('user/get', async () => {
  await getUserApi();
});

export const updateUserThunk = createAsyncThunk(
  'user/update',
  async (user: Partial<TRegisterData>) => {
    await updateUserApi(user);
  }
);

export const resetPasswordThunk = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }) => {
    await resetPasswordApi(data);
  }
);

export const forgotPasswordThunk = createAsyncThunk(
  'user/forgotPassword',
  async (data: { email: string }) => {
    await forgotPasswordApi(data);
  }
);

export interface UserState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: TUser | null;
  error: string | null | undefined;
}

const initialState: UserState = {
  isLoading: false,
  isAuthenticated: false,
  user: null,
  error: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    userStateSelector: (state) => state,
    authenticatedSelector: (state) => state.isAuthenticated,
    userDataSelector: (state) => state.user,
    userErrorSelector: (state) => state.error
  },
  extraReducers: (builder) => {
    //регистрация
    builder.addCase(registerUserThunk.pending, (state) => {
      state.isLoading = true;
      state.isAuthenticated = false;
    });
    builder.addCase(registerUserThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.error.message;
    });
    builder.addCase(registerUserThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    });
    //авторизация
    builder.addCase(loginUserThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loginUserThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.error.message;
    });
    builder.addCase(loginUserThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    });
    //сброс авторизации
    builder.addCase(logoutUserThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logoutUserThunk.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      state.isLoading = false;
    });
    //получение пользователя
    builder.addCase(getUserThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserThunk.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getUserThunk.fulfilled, (state) => {
      state.isLoading = false;
    });
    //изменение данных пользователя
    builder.addCase(updateUserThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateUserThunk.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(updateUserThunk.fulfilled, (state) => {
      state.isLoading = false;
    });
    //сброс пароля пользователя
    builder.addCase(resetPasswordThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(resetPasswordThunk.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(resetPasswordThunk.fulfilled, (state) => {
      state.isLoading = false;
    });
    //сброс пароля пользователя через email
    builder.addCase(forgotPasswordThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(forgotPasswordThunk.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(forgotPasswordThunk.fulfilled, (state) => {
      state.isLoading = false;
    });
  }
});

export { initialState };

export const {
  userStateSelector,
  authenticatedSelector,
  userDataSelector,
  userErrorSelector
} = userSlice.selectors;

export default userSlice.reducer;
