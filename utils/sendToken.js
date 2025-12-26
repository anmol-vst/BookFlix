const sendToken = (user, statuscode, message, res) => {
  const token = user.generateToken();
  
  res
    .status(statuscode)
    .cookie("Token", token, {
      expires: new Date(
        Date.now() + process.env.JWT_EXPIRES * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    })
    .json({
      success: true,
      user,
      message,
      token,
    });
};

module.exports = { sendToken };
