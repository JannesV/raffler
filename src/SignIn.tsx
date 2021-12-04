import {
  Auth,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup
} from '@firebase/auth';
import { Button } from 'antd';
import React, { FunctionComponent } from 'react';

const provider = new GoogleAuthProvider();

interface SignInProps {
  auth: Auth;
}

export const SignIn: FunctionComponent<SignInProps> = ({ auth }) => {
  const signInWithGoogle = async () => {
    const res = signInWithPopup(auth, provider);
  };

  return (
    <div>
      <Button onClick={signInWithGoogle}>Sign in</Button>
    </div>
  );
};
