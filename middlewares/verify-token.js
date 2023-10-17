exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  // Here, you should implement your actual token verification logic.
  // It seems you are currently just comparing the token to a static string 'ABCDE',
  // which is not a secure way to verify tokens.
  // You should use a library like jsonwebtoken to verify JWT tokens,
  // or your custom token verification logic.

  // Example using jsonwebtoken:
  // jwt.verify(token, 'your-secret-key', (err, decoded) => {
  //   if (err) {
  //     return res.status(401).json({ message: 'Unauthorized!' });
  //   }
  //   // Token is valid, you can proceed with the next middleware.
  //   next();
  // });

  // Replace the following line with your actual token verification logic
  if (token === 'ABCDE') {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized!' });
  }
};
