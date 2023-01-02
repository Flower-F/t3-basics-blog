import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import type { CreateUserInput } from '../schema/user';
import { trpc } from '../utils/trpc';

const RegisterPage: NextPage = () => {
  const { handleSubmit, register } = useForm<CreateUserInput>();
  const router = useRouter();
  const { mutate, error } = trpc.user.register.useMutation({
    onSuccess: () => {
      router.push('/login');
    },
  });

  function onSubmit(values: CreateUserInput) {
    mutate(values);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {error?.message}
        <h1>Register</h1>

        <input type='email' placeholder='helloworld@example.com' {...register('email')} />
        <br />
        <input type='text' placeholder='Tom' {...register('name')} />

        <button type='submit'>Register</button>
      </form>

      <Link href='/login'>Login</Link>
    </>
  );
};

export default RegisterPage;
