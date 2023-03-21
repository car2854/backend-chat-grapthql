import { createParamDecorator } from "@nestjs/common/decorators";
import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const RequestContextUid = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
    
        const ctx = GqlExecutionContext.create(context).getContext();
        
        return ctx.uid;
    },
  );