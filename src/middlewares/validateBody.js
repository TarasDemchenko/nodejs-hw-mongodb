import createHttpError from 'http-errors';

// export const validateBody = (schema) => async (req, res, next) => {
//   try {
//     await schema.validateAsync(req.body, {
//       abortEarly: false,
//     });
//     next();
//   } catch (err) {
//     const error = createHttpError(400, 'Bad Request', {
//       errors: err.details,
//     });
//     next(error);
//   }
// };

// export const validateBody = (shema) => {
//   return (req, res, next) => {
//     const result = shema.validate(req.body, { AbortEarly: false });

//     if (typeof result.error != 'undefined') {
//       return next(
//         createHttpError(
//           400,
//           JSON.stringify(result.error.details.map((err) => err.message)),
//         ),
//       );
//     }
//     next();
//   };
// };

export const validateBody = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { AbortEarly: false });
      next();
    } catch (error) {
      next(
        createHttpError(
          400,
          JSON.stringify(error.details.map((err) => err.message)),
        ),
      );
    }
  };
};
