import { useState, useEffect } from 'react';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useSearchParams, useRouter } from 'src/routes/hook';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form';
import { TextField } from '@mui/material';
import axios, { endpoints } from 'src/utils/axios';
import { decryptToken, encryptToken } from 'src/utils/common';
import { constants } from 'src/utils/constant';
import { useSnackbar } from 'src/components/snackbar'
import { jwtDecode } from 'src/auth/context/jwt/utils';

// ----------------------------------------------------------------------

export default function JwtLoginView() {

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');
  const searchParams = useSearchParams();


  // State for login state
  const [loginState, setLoginState] = useState({
    email: 'adminuser@test.in',
    password: 'defaultPassword',
    emailErr: false,
    passErr: false
  });
  const { enqueueSnackbar } = useSnackbar();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const password = useBoolean();

  const handleLogin = async () => {

    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (loginState.email.length === 0 || !re.test(loginState.email)) {
      setLoginState((prev) => ({ ...prev, emailErr: true }));
      return;
    }
    setLoginState((prev) => ({ ...prev, emailErr: false }));

    if (loginState.password.length === 0) {
      setLoginState((prev) => ({ ...prev, passErr: true }));
      return;
    };

    setLoginState((prev) => ({ ...prev, passErr: false }));

    try {
      setIsSubmitting(true);
      const apiResponse = await axios.post(endpoints.auth.login, {
        email: loginState.email,
        password: loginState.password,
      });

      if (apiResponse) {

        // Set USER DATA
        const encryptedUserObj = encryptToken(JSON.stringify(apiResponse.data.data.user));
        localStorage.setItem(constants.keyUserData, encryptedUserObj);

        // SET TOKEN
        const encryptedToken = encryptToken(apiResponse.data.data.token);
        localStorage.setItem(constants.keyUserToken, encryptedToken);

        // SET AXIOS HEADER
        axios.defaults.headers.common.Authorization = `Bearer ${apiResponse.data.data.token}`;
        setIsSubmitting(false);

        // Go TO DASHBOARD
        router.push('/dashboard');

      };

    } catch (error) {
      setIsSubmitting(false);
      enqueueSnackbar(error.error, { variant: "error" })
    }
  };

  useEffect(() => {
    const token = localStorage.getItem(constants.keyUserToken);
    if (token) {
      const decrypted = decryptToken(token);

      if (decrypted) {

        const decodedToken = jwtDecode(decrypted);
        const currentTimestamp = Math.floor(Date.now() / 1000);

        if (decodedToken.exp && decodedToken.exp < currentTimestamp) {

          // Token is expired, clear token and redirect to login page
          localStorage.clear();

          // Display a message
          alert("Your session has expired. Please log in again.");

          // Redirect to '/login';
          window.location.href = '/';

        } else {
          router.push('/dashboard');
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">Sign in to Accounting Software</Typography>

      {/* <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">New user?</Typography>

        <Link component={RouterLink} href={paths.auth.jwt.register} variant="subtitle2">
          Create an account
        </Link>
      </Stack> */}
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <TextField
        name="email"
        label="Email address"
        value={loginState.email}
        onChange={(e) => {
          setLoginState((prev) => ({ ...prev, email: e.target.value, emailErr: false }));
        }}
        error={loginState.emailErr}
        helperText={loginState.emailErr ? 'Please enter valid email!' : null}
      />

      <TextField
        name="password"
        label="Password"
        type={password.value ? 'text' : 'password'}
        value={loginState.password}
        onChange={(e) => {
          setLoginState((prev) => ({ ...prev, password: e.target.value, passErr: false }))
        }}
        error={loginState.passErr}
        helperText={loginState.passErr ? 'Please enter valid password!' : null}

        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        variant="contained"
        loading={isSubmitting}
        onClick={handleLogin}
      >
        Login
      </LoadingButton>
    </Stack>
  );

  return (
    <FormProvider>
      {renderHead}

      {/* <Alert severity="info" sx={{ mb: 3 }}>
        Use email : <strong>demo@minimals.cc</strong> / password :<strong> demo1234</strong>
      </Alert> */}

      {renderForm}
    </FormProvider>
  );
}
