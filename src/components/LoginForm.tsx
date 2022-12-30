import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { RequestOtpInput } from '../schema/user';
import { trpc } from '../utils/trpc';

function VerifyToken({ hash }: { hash: string }) {
  const router = useRouter();
  const { data, isLoading } = trpc.user.verifyOtp.useQuery({ hash });

  if (isLoading) {
    return <p>Verifying...</p>;
  }

  router.push(data?.redirect.includes('login') ? '/' : data?.redirect || '/');

  return <p>Redirecting...</p>;
}

const LoginForm = () => {
  const { handleSubmit, register } = useForm<RequestOtpInput>();
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const { mutate, error } = trpc.user.requestOtp.useMutation({
    onSuccess: () => {
      setSuccess(true);
    },
  });

  function onSubmit(values: RequestOtpInput) {
    mutate({ ...values, redirect: router.asPath });
  }

  const hash = router.asPath.split('#token=')[1];
  if (hash) {
    return <VerifyToken hash={hash} />;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {error?.message}
        {success && <p>Check your email</p>}
        <h1>Login</h1>

        <input type='email' placeholder='helloworld@example.com' {...register('email')} />
        <button type='submit'>Login</button>
      </form>

      <Link href='/register'>Register</Link>
    </>
  );
};

export default LoginForm;
