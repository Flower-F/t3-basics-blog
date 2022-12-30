import { createPostSchema, getSinglePostSchema } from '../../../schema/post';
import { router, publicProcedure, protectedProcedure } from '../trpc';

export const postRouter = router({
  createPost: protectedProcedure.input(createPostSchema).mutation(async ({ ctx, input }) => {
    const post = await ctx.prisma.post.create({
      data: {
        ...input,
        user: {
          connect: {
            id: ctx.user.id,
          },
        },
      },
    });
    return post;
  }),
  posts: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),
  singlePost: publicProcedure.input(getSinglePostSchema).query(async ({ ctx, input }) => {
    return ctx.prisma.post.findUnique({
      where: {
        id: input.postId,
      },
    });
  }),
});
