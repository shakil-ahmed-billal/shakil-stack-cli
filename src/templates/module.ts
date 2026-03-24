export const moduleController = (moduleName: string, lowercaseName: string) => `import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import { ${moduleName}Service } from './${lowercaseName}.service.js';

const create${moduleName} = catchAsync(async (req: Request, res: Response) => {
  const result = await ${moduleName}Service.create${moduleName}IntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '${moduleName} created successfully',
    data: result,
  });
});

export const ${moduleName}Controller = {
  create${moduleName},
};
`;

export const moduleService = (moduleName: string, lowercaseName: string) => `import { ${moduleName} } from '@prisma/client';
import prisma from '../../lib/prisma.js';

const create${moduleName}IntoDB = async (payload: any) => {
  // Logic here
  return payload;
};

export const ${moduleName}Service = {
  create${moduleName}IntoDB,
};
`;

export const moduleRoute = (moduleName: string, lowercaseName: string) => `import { Router } from 'express';
import { ${moduleName}Controller } from './${lowercaseName}.controller.js';

const router = Router();

router.post('/create-${lowercaseName}', ${moduleName}Controller.create${moduleName});

export const ${moduleName}Routes = router;
`;

export const moduleInterface = (moduleName: string) => `export type I${moduleName} = {
  // Define interface
};
`;

export const moduleValidation = (moduleName: string) => `import { z } from 'zod';

const create${moduleName}ValidationSchema = z.object({
  body: z.object({
    // Define schema
  }),
});

export const ${moduleName}Validations = {
  create${moduleName}ValidationSchema,
};
`;

export const moduleConstant = (moduleName: string) => `export const ${moduleName}SearchableFields = [];
`;

export const modulePrisma = (moduleName: string) => `model ${moduleName} {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`;
