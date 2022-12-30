import Link from 'next/link';
import { trpc } from '../../utils/trpc';

const PostListPage = () => {
  const { isLoading, data } = trpc.post.posts.useQuery();

  if (isLoading) {
    return <p>Loading post list...</p>;
  }

  return (
    <div>
      {data?.map((post) => {
        return (
          <article key={post.id}>
            <p>{post.title}</p>
            <Link href={`/posts/${post.id}`}>Read post</Link>
          </article>
        );
      })}
    </div>
  );
};

export default PostListPage;
