import express from "express";

export const routerWrapper = (
  router: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => Promise<[number, any]>
) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const result = await router(req, res, next);
      if (!Array.isArray(result) || result.length != 2) {
        return next();
      }

      const [status, data] = result;
      if (typeof data === "undefined") {
        return res.status(status).send();
      } else {
        return res.status(status).send(data);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send();
    }
  };
};
