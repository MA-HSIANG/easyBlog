const GenId = require("./snowFlake");
const genid = new GenId({ WorkerId: 1 });

//jwt過期時間
async function verifyTime(exp, jwtLogTime) {
  const time = parseInt(new Date().getTime() / 1000);

  if (time - exp >= jwtLogTime) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  genid,
  verifyTime,
};
