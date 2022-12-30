import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { TRPCError } from '@trpc/server';
import { serialize } from 'cookie';
import { createUserSchema, requestOtpSchema, verifyOtpSchema } from '../../../schema/user';
import { decode, encode } from '../../../utils/base64';
import { getBaseUrl } from '../../../utils/helper';
import { signJwt } from '../../../utils/jwt';
import { sendLoginEmail } from '../../../utils/mailer';

import { router, publicProcedure } from '../trpc';

export const userRouter = router({
  register: publicProcedure.input(createUserSchema).mutation(async ({ ctx, input }) => {
    const { email, name } = input;

    try {
      const user = await ctx.prisma.user.create({
        data: {
          email,
          name,
        },
      });

      return user;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User already exists',
          });
        }
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      });
    }
  }),
  requestOtp: publicProcedure.input(requestOtpSchema).mutation(async ({ input, ctx }) => {
    const { email, redirect } = input;

    const user = await ctx.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    const token = await ctx.prisma.loginToken.create({
      data: {
        redirect,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    // send email to user
    sendLoginEmail({
      token: encode(`${token.id}:${user.email}`),
      url: getBaseUrl(),
      email: user.email,
    });

    return true;
  }),
  verifyOtp: publicProcedure.input(verifyOtpSchema).query(async ({ input, ctx }) => {
    const decoded = decode(input.hash).split(':');
    const [id, email] = decoded;

    const token = await ctx.prisma.loginToken.findFirst({
      where: {
        id,
        user: {
          email,
        },
      },
      include: {
        user: true,
      },
    });

    if (!token) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Invalid token',
      });
    }

    const jwt = signJwt({
      email: token.user.email,
      id: token.user.id,
    });

    ctx.res.setHeader('Set-Cookie', serialize('token', jwt, { path: '/' }));

    return {
      redirect: token.redirect,
    };
  }),
  me: publicProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
});
