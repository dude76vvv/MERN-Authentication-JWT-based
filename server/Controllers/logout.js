const logoutUser = async (req, res) => {
  try {
    res.clearCookie("access-token");

    return res.status(200).json({
      status: "success",
      message: "cookie clear",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: "unsuccess",
      error: "fail to clear cookie",
    });
  }
};

module.exports = logoutUser;
