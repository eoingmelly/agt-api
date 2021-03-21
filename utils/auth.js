// Authentication Handling related functions
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { tokensModel } = require("../gql/token/token.model");
const { GraphQLError } = require("graphql");

//TODO Handle token generation, verification and validation in here.
const auth = {
  jwtAccExp: 0,
  jwtRefreshExp: 0,
  start: () => {
    auth.jwtAccExp = 60 * Number(process.env.JWT_ACC_EXP_M);
    auth.jwtRefreshExp = 60 * 60 * 24 * Number(process.env.JWT_REF_EXT_D);
  },

  comparePasswords: async (pwClient, pwServer) => {
    let isMatch = await bcrypt.compare(pwServer, pwClient);
    return isMatch;
  },
  // Creates a new JWT Access token
  createAccessToken: (user) => {
    let tk = new tokensModel();
    tk.user = user.id;
    var theToken = jwt.sign({ uid: user.id }, process.env.JWT_SECRET, {
      expiresIn: auth.jwtAccExp,
    });
    tk.access_token = theToken;
    tk.save();

    return tk;
  },
  // Creates a new JWT Refresh token
  createRefreshToken: () => {
    refresh_token = auth.refreshTokenGen(64);
    return refresh_token;
  },

  refreshTokenGen: (len) => {
    // library like https://github.com/sindresorhus/crypto-random-string
    var text = "";
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < len; i++)
      text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
  },

  userHasPermissions: () => (next) => async (root, args, context, info) => {
    // if (!context.isLoggedIn) {
    //   throw new GraphQLError("You are not authorized!");
    // }

    console.log("We Checked for Permissions!!!");
    return next(root, args, context, info);
  },

  // Checks tokens, both if necesary
  verifyToken: (req, res, next) => {
    // This whole code can be improved greatly in terms of security but for
    // now I think is quite sufficient.

    let accesstoken = req.cookies.access_token || null;
    let refreshtoken = req.cookies.refresh_token || null;

    console.log("acc ", accesstoken);
    console.log("ref ", refreshtoken);

    if (accesstoken && refreshtoken) {
      // verifies the access token if there is one
      console.log("Both tokens exist, verify acc");
      jwt.verify(
        accesstoken,
        process.env.JWT_SECRET,
        async function (err, decoded) {
          if (err) {
            if (err.name === "TokenExpiredError") {
              console.log("Expired, so we need a new one.");

              console.log(
                "Check the accessToken to get the user id.",
                accesstoken
              );
              let decoded = jwt.decode(accesstoken);
              // Checks on redisDB if there's a token saved with that User ID

              console.log("Decoded: ", decoded);
              let srvTok = await tokensModel.findOne({
                access_token: accesstoken,
                user: decoded.uid,
              });

              if (srvTok) {
                console.log("srvTok acc = ", srvTok.access_token);
              }

              if (!srvTok) {
                // If the token does not exist in redis is probably some kind of attack
                // the req.isLogged is passed as context, in any query we can just validate logged users
                // on the resolvers by checking if this variable is set to true or false
                req.isLoggedIn = false;
                next();
              } else {
                // Here we need to decide what to do with the user, either send him back to
                // Login or like is now on the code, re-issue the tokens.
                let refresh_token = auth.refreshTokenGen(64);
                res.cookie("refresh_token", refresh_token, {
                  secure: true,
                  httpOnly: true,
                  sameSite: "none",
                });

                // User id is set in the JWT payload
                //console.log("about to jwtSign: ", decoded);
                let token = jwt.sign(
                  { uid: decoded.uid },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: auth.jwtAccExp,
                  }
                );

                srvTok = await tokensModel.findByIdAndUpdate({
                  access_token: token,
                  user: decoded.uid,
                });

                console.log("updating access token on client");
                res.cookie("access_token", token, {
                  secure: true,
                  httpOnly: true,
                  sameSite: "none",
                });
                // We add the payload to the req Object to pass it in the context object
                // on the subsequent resolvers.
                //req.userData = decoded;
                req.isLoggedIn = true;
                next();
              }
            } else {
              // Usually either an error in the token itself or somebody trying to guess the token
              console.log("unverified... ", err);

              req.isLoggedIn = false;
              next();
            }
          } else {
            // No errors, token is valid and we continue
            // We add the payload to the req Object to pass it in the context object
            // on the subsequent resolvers.
            console.log("Both tokens exist, verified acc ");
            req.userData = decoded;
            req.isLoggedIn = true;
            next();
          }
        }
      );
    } else {
      //
      console.log("eh, not logged in, so log in please! ");
      req.isLoggedIn = false;
      next();
    }
  },
};

module.exports = auth;
