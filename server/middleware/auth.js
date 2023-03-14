import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      res.status(403).json("Access denied");
    }
    if (token.startWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }
    const verfied = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verfied;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
