const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const jwt = require('jsonwebtoken');
const response = require("../config/response");
const {
  authService,
  userService,
  tokenService,
  emailService,
} = require("../services");
const { User } = require("../models");
const { generateAuthTokens } = require("../services/token.service");

// register
const register = catchAsync(async (req, res) => {
  const { email,name,phone, address, ...rest } = req.body;
  const isUser = await userService.getUserByEmail(email);
  let code

  if (isUser) {
    if (isUser.isDeleted) {
     await userService.isUpdateUser(isUser.id, {
        email,
          name,
          phone,
          address,
          ...rest
      });
    } else if (!isUser.isEmailVerified) {
       await userService.isUpdateUser(isUser.id, {
        email,
        name,
        phone,
        address,
        ...rest
      });
    } else {
    }
  } else {
    code = await userService.createUser({
      email,
          name,
          phone,
          address,
          ...rest
    });
  }

  res.status(httpStatus.CREATED).json(
    response({
      message: "Thank you for registering. Please verify your email",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: {code},
    })
  );
});

// login
const login = catchAsync(async (req, res) => {
  const { email, password, fcmToken } = req.body;
  const isUser = await userService.getUserByEmail(email);
  // here we check if the user is in the database or not
  if (isUser?.isDeleted === true) {
    throw new ApiError(httpStatus.BAD_REQUEST, "This Account is Deleted");
  }
  if (isUser?.isEmailVerified === false) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email not verified");
  }
  if (!isUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "No users found with this email");
  }
  const user = await authService.loginUserWithEmailAndPassword(email, password, fcmToken);

  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.OK).json(
    response({
      message: "Login Successful",
      status: "OK",
      statusCode: httpStatus.OK,
      data: { user, tokens },
    })
  );
});

const GoogleLogin = catchAsync(async (req, res) => {

 const {credential} = req.body;
 if(!credential) throw new ApiError(httpStatus.BAD_REQUEST, "invalid request!")
  const decode = jwt.decode(credential);
  if(!decode) throw new ApiError(httpStatus.BAD_REQUEST, "invalid request!")
 console.log(decode);
 let user = await User.findOne({ email: decode.email });
 if (user?.isDeleted) throw new ApiError(httpStatus.BAD_REQUEST, "This Account is Deleted");

 if (!user) {
   user = new User({
    //  googleId: id, 
     name: decode.name,
     image: decode.picture, 
     email: decode.email, 
   });
   await user.save();  
 }



 const tokens = await generateAuthTokens(user);

//  const data = JSON.stringify({user, tokens});

//  res.redirect(`http://maniknew3000.sobhoy.com?data=${data}`);

 res.status(httpStatus.OK).json(
  response({
    message: "login Successful",
    status: "OK",
    statusCode: httpStatus.OK,
    data:{user,tokens}
  })
);
});


// logout
const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.OK).json(
    response({
      message: "LogOut Successful",
      status: "OK",
      statusCode: httpStatus.OK,
    })
  );
});

// refresh Tokens
const refreshTokens = catchAsync(async (req, res) => {
  // const tokens = await authService.refreshAuth(req.body.refreshToken);
  // res.send({ ...tokens });
});

// forgot Password
const forgotPassword = catchAsync(async (req, res) => {
  const user = await userService.getUserByEmail(req.body.email);
  if (!user) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "No users found with this email"
    );
  }
  // if(user.oneTimeCode === 'verified'){
  //   throw new ApiError(
  //     httpStatus.BAD_REQUEST,
  //     "try 3 minute later"
  //   );
  // }
  // Generate OTC (One-Time Code)
  const oneTimeCode =
    Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

  // Store the OTC and its expiration time in the database
  user.oneTimeCode = oneTimeCode;
  user.isResetPassword = true;
  await user.save();

  //console.log("oneTimeCode", user);
  await emailService.sendResetPasswordEmail(req.body.email, oneTimeCode);
  res.status(httpStatus.OK).json(
    response({
      message: "Email Sent",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});

// reset Password
const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.body.password, req.body.email);
  res.status(httpStatus.OK).json(
    response({
      message: "Password Reset Successful",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});

// change Password
const changePassword = catchAsync(async (req, res) => {
  await authService.changePassword(req.user, req.body);
  res.status(httpStatus.OK).json(
    response({
      message: "Password Change Successful",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});

// send Verification Email
const sendVerificationEmail = catchAsync(async (req, res) => {
  // const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  // await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  // res.status(httpStatus.OK).send();
});

// verify Email
const verifyEmail = catchAsync(async (req, res) => {
  const user = await authService.verifyEmail(req.body, req.query);

  const tokens = await tokenService.generateAuthTokens(user);

  res.status(httpStatus.OK).json(
    response({
      message: "Email Verified",
      status: "OK",
      statusCode: httpStatus.OK,
      data: { user, tokens },
    })
  );
  // res.status(httpStatus.OK).send();
});

// delete Me
const deleteMe = catchAsync(async (req, res) => {
  const user = await authService.deleteMe(req.body.password, req.user);
  res.status(httpStatus.OK).json(
    response({
      message: "Account Deleted",
      status: "OK",
      statusCode: httpStatus.OK,
      data: { user },
    })
  );
});

module.exports = {
  register,
  login,
  GoogleLogin,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  deleteMe,
  changePassword,
};
