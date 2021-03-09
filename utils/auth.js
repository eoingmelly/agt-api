// Authentication Handling related functions
const jwt = require("jsonwebtoken");

//TODO Handle token generation, verification and validation in here.
const auth = {
  jwtAccExp: 0,
  jwtRefreshExp: 0,
  start: () => {
    auth.jwtAccExp = 60 * Number(process.env.JWT_ACC_EXP_M);
    auth.jwtRefreshExp = 60 * 60 * 24 * Number(process.env.JWT_REF_EXT_D);
  },
  // Creates a new JWT Access token
  createAccessToken: (user) => {
    return jwt.sign(
      { uid: user.id, org: user.organisationId },
      process.env.JWT_SECRET,
      {
        expiresIn: auth.jwtAccExp,
      }
    );
  },
  // Creates a new JWT Refresh token
  createRefreshToken: (id) => {
    let refresh_token = auth.refreshTokenGen(64);
    //let refresh_token_maxage = new Date() + auth.jwtRefreshExp;
    // session.client.set(
    //   String(id),
    //   JSON.stringify({
    //     refresh_token: refresh_token,
    //     expires: refresh_token_maxage,
    //   })
    // );
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

    console.log(
      "verifying tokens, req.cookies: Also, arse...",
      req.cookies,
      req.arse
    );

    let accesstoken = req.cookies.access_token || null;
    let refreshtoken = req.cookies.refresh_token || null;
    if (accesstoken && refreshtoken) {
      // verifies the access token if there is one
      jwt.verify(
        accesstoken,
        process.env.JWT_SECRET,
        async function (err, decoded) {
          if (err) {
            if (err.name === "TokenExpiredError") {
              let decoded = jwt.decode(accesstoken);
              // Checks on redisDB if there's a token saved with that User ID
              let redis_token =
                decoded.uid === "601b24e78e820f347445e1cb" ? true : null;
              // console.log("act is: ", accesstoken);
              // console.log("decoded is : ", decoded);

              if (!redis_token || redis_token.refresh_token === refreshtoken) {
                // If the token does not exist in redis is probably some kind of attack
                // the req.isLogged is passed as context, in any query we can just validate logged users
                // on the resolvers by checking if this variable is set to true or false
                req.isLoggedIn = false;
                next("Not this time...");
              } else {
                // Here we need to decide what to do with the user, either send him back to
                // Login or like is now on the code, re-issue the tokens.
                if (redis_token.expires > new Date()) {
                  let refresh_token = auth.refreshTokenGen(64);
                  res.cookie("refresh_token", refresh_token, {
                    secure: true,
                    httpOnly: true,
                    sameSite: "none",
                  });
                }
                // User id is set in the JWT payload
                //console.log("about to jwtSign: ", decoded);
                let token = jwt.sign(
                  { uid: decoded.uid },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: auth.jwtAccExp,
                  }
                );
                res.cookie("access_token", token, {
                  secure: true,
                  httpOnly: true,
                  sameSite: "none",
                });
                // We add the payload to the req Object to pass it in the context object
                // on the subsequent resolvers.
                req.userData = decoded;
                req.isLoggedIn = true;
                next();
              }
            } else {
              // Usually either an error in the token itself or somebody trying to guess the token
              req.isLoggedIn = false;
              next();
            }
          } else {
            // No errors, token is valid and we continue
            // We add the payload to the req Object to pass it in the context object
            // on the subsequent resolvers.
            req.userData = decoded;
            req.isLoggedIn = true;
            next();
          }
        }
      );
    } else {
      //
      req.isLoggedIn = false;
      next();
    }
  },
};

module.exports = auth;
