import React from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

function Login({ onSuccess, onError }) {
    return (
        <div>
            <h2>React Google Login</h2>
            <br />
            <br />
            <GoogleOAuthProvider clientId="1085707510405-flo13bhgh4ji31g8atiisahocrcgddq9.apps.googleusercontent.com">
                <GoogleLogin
                    buttonText="Login with Google"
                    onSuccess={onSuccess}
                    onError={onError}
                    cookiePolicy={'single_host_origin'}
                />
            </GoogleOAuthProvider>
        </div>
    );
}

export default Login;