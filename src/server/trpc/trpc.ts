import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

import { type Context } from './context';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You should login to go on' });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const router = t.router;

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;

/**
 * Protected procedure
 **/
export const protectedProcedure = t.procedure.use(isAuthed);
