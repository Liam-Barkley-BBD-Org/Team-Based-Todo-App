import express from 'express';
import errorHandler from './middlewares/errorHandlerMiddleware.js';

import { HTTP_STATUS } from "./utils/httpStatusUtil.js";
import { userRouter } from './routers/userRouter.js';
import { roleRouter } from './routers/roleRouter.js';
import { userRoleRouter } from './routers/userRoleRouter.js';

const app = express();
app.use(express.json());

// routes
app.use('/api/users', userRouter);
app.use('/api/roles', roleRouter);
app.use('/api/user_roles', userRoleRouter);

app.use((req, res, next) => {
  res.status(HTTP_STATUS.NOT_FOUND).json();
});

app.use(errorHandler);

const PORT = process.env.API_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
