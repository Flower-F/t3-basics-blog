import { type inferAsyncReturnType } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import type { NextApiRequest } from 'next';
import { verifyJwt } from '../../utils/jwt';
import { prisma } from '../db/client';

interface ContextUser {
  id: string;
  email: string;
  name: string;
  iat: string;
  exp: number;
}

function getUserFromRequest(req: NextApiRequest) {
  const token = req.cookies.token;

  if (token) {
    try {
      const verified = verifyJwt<ContextUser>(token);
      return verified;
    } catch (error) {
      return null;
    }
  }

  return null;
}

/**
 * Replace this with an object if you want to pass things to createContextInner
 */
type CreateContextOptions = Record<string, never>;

/** Use this helper for:
 * - testing, so we don't have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    prisma,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  const contextInner = await createContextInner({});
  const user = getUserFromRequest(opts.req);

  return {
    ...contextInner,
    res: opts.res,
    req: opts.req,
    user,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
