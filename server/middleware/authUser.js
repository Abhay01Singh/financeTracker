import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No Token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID from token and attach to request (excluding password)
    req.user = { _id: decoded.id };

    if (!req.user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    next(); // Proceed to the controller
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: Token Failed" });
  }
};

export default authUser;
