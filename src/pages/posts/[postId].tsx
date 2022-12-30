import Error from 'next/error';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';

const SinglePostPage = () => {
  const router = useRouter();
  const postId = router.query.postId as string;
  const { data, isLoading } = trpc.post.singlePost.useQuery({ postId });

  if (isLoading) {
    return <p>Loading post content...</p>;
  }

  if (!data) {
    return <Error statusCode={404} />;
  }

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.body}</p>
    </div>
  );
};

export default SinglePostPage;
