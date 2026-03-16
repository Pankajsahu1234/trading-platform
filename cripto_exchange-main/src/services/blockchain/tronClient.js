

import pkg from "tronweb";

const { TronWeb } = pkg;

const tronWeb = new TronWeb({
  fullHost: "https://api.trongrid.io",   // ✅ MAINNET
  headers: {
    "TRON-PRO-API-KEY": process.env.TRONGRID_API_KEY || "",
  },
});

export default tronWeb;

