const MongoDB = require("./mongodb.service");
const { mongoConfig, tokenSecret } = require("../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config");

const userRegister = async (user) => {
  try {
    if (!user?.username || !user?.email || !user?.password)
      return { status: false, message: "Please fill up all the fields" };
    const passwordHash = await bcrypt.hash(user?.password, 10);
    let userObject = {
      username: user?.username,
      email: user?.email,
      password: passwordHash,
      profileImage: "",
    };

    let savedUser = await MongoDB.db
      .collection(mongoConfig.collections.USERS)
      .insertOne(userObject);
    if (savedUser?.acknowledged && savedUser?.insertedId) {
      let token = jwt.sign(
        { username: userObject?.user, email: userObject?.email },
        tokenSecret,
        { expiresIn: "24h" }
      );
      return {
        status: true,
        message: "Korisnik je registrovan uspješno",
        data: token,
      };
    } else {
      return {
        status: false,
        message: "Registracija nije uspjela",
      };
    }
  } catch (error) {
    console.log(error);
    let errorMessage = "Registracija nije uspjela";
    error?.code === 11000 && error?.keyPattern?.username
      ? (errorMessage = "Korisnik već postoji")
      : null;
    error?.code === 11000 && error?.keyPattern?.email
      ? (errorMessage = "Email već postoji")
      : null;
    return {
      status: false,
      message: errorMessage,
      error: error?.toString(),
    };
  }
};

const userLogin = async (user) => {
  try {
    if (!user?.username || !user?.password)
      return { status: false, message: "Please fill up all the fields" };
    let userObject = await MongoDB.db
      .collection(mongoConfig.collections.USERS)
      .findOne({ username: user?.username });
    if (userObject) {
      let isPasswordVerfied = await bcrypt.compare(
        user?.password,
        userObject?.password
      );
      if (isPasswordVerfied) {
        let token = jwt.sign(
          { username: userObject?.username, email: userObject?.email },
          tokenSecret,
          { expiresIn: "24h" }
        );
        return {
          status: true,
          message: "User login successful",
          data: token,
        };
      } else {
        return {
          status: false,
          message: "Netačna lozinka",
        };
      }
    } else {
      return {
        status: false,
        message: "Korisnik nije pronađen",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: "Prijava nije uspjela.",
      error: error?.toString(),
    };
  }
};

const checkUserExist = async (query) => {
  let messages = {
    email: "Korisnik već postoji",
    username: "Ovo korisničko ime već postoji",
  };
  try {
    let queryType = Object.keys(query)[0];
    let userObject = await MongoDB.db
      .collection(mongoConfig.collections.USERS)
      .findOne(query);
    return !userObject
      ? { status: true, message: `This ${queryType} is not taken` }
      : { status: false, message: messages[queryType] };
  } catch (error) {}
};

const tokenVerification = async (req, res, next) => {
  console.log(
    `authentication.service | tokenVerification | ${req?.originalUrl}`
  );
  try {
    if (
      req?.originalUrl.includes("/login") ||
      req?.originalUrl.includes("/user-exist") ||
      req?.originalUrl.includes("/register") ||
      req?.originalUrl.includes("/refresh-token")
    )
      return next();
    let token = req?.headers["authorization"];
    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7, token?.length);
      jwt.verify(token, config.tokenSecret, (error, decoded) => {
        if (error) {
          res.status(401).json({
            status: false,
            message: error?.name ? error?.name : "Token nije validan",
            error: `Token nije validan | ${error?.message}`,
          });
        } else {
          req["username"] = decoded?.username;
          next();
        }
      });
    } else {
      res.status(401).json({
        status: false,
        message: "Token nedostaje",
        error: "Token nedostaje",
      });
    }
  } catch (error) {
    res.status(401).json({
      status: false,
      message: error?.message ? error?.message : "Neuspješna autentifikacija",
      error: `Neuspješna autentifikacija | ${error?.message}`,
    });
  }
};

const tokenRefresh = async (req, res) => {
  console.log(`authentication.service | tokenRefresh | ${req?.originalUrl}`);
  try {
    let token = req?.headers["authorization"];
    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7, token?.length);
      jwt.verify(
        token,
        config.tokenSecret,
        { ignoreExpiration: true },
        async (error, decoded) => {
          if (error) {
            res.status(401).json({
              status: false,
              message: error?.name ? error?.name : "Token nije validan",
              error: `Token nije validan | ${error?.message}`,
            });
          } else {
            if (decoded?.username && decoded?.email) {
              let newToken = jwt.sign(
                { username: decoded?.username, email: decoded?.email },
                tokenSecret,
                { expiresIn: "24h" }
              );
              res.json({
                status: true,
                message: "Token uspješno refrešovan.",
                data: newToken,
              });
            } else {
              res.status(401).json({
                status: false,
                message: error?.name ? error?.name : "Token nije validan",
                error: `Token nije validan | ${error?.message}`,
              });
            }
          }
        }
      );
    } else {
      res.status(401).json({
        status: false,
        message: error?.name ? error?.name : "Token nedostaje",
        error: `Token nedostaje | ${error?.message}`,
      });
    }
  } catch (error) {
    res.status(401).json({
      status: false,
      message: error?.name ? error?.name : "Refrešovanje tokena nije uspjelo",
      error: `Refrešovanje tokena nije uspjelo | ${error?.message}`,
    });
  }
};

module.exports = {
  userRegister,
  userLogin,
  checkUserExist,
  tokenVerification,
  tokenRefresh,
};
