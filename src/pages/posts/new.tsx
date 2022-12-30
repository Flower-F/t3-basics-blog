import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { CreatePostInput } from '../../schema/post';
import { trpc } from '../../utils/trpc';

const CreatePostPage = () => {
  const { handleSubmit, register } = useForm<CreatePostInput>();
  const router = useRouter();

  const { mutate, error } = trpc.post.createPost.useMutation({
    onSuccess: ({ id }) => {
      router.push(`/posts/${id}`);
    },
  });

  function onSubmit(values: CreatePostInput) {
    mutate(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error?.message}
      <h1>Create posts</h1>

      <input type='text' placeholder='Your post title' {...register('title')} />
      <br />
      <textarea placeholder='Your post body' {...register('body')} />
      <br />
      <button type='submit'>Create post</button>
    </form>
  );
};

export default CreatePostPage;
