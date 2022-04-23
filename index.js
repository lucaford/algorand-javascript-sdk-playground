import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import inquirer from "inquirer";
import readlineSync from "readline-sync";

import {
  createAccount,
  firstTransaction,
  accountInformation,
  createNFT,
  createToken,
} from "./algorandFunctions.js";

clear();

console.log(
  chalk.yellow(figlet.textSync("Algorand", { horizontalLayout: "full" }))
);

const MENU = Object.freeze({
  CREATE_ACCOUNT: "Crear cuenta",
  ACCOUNT_INFORMATION: "Información de la cuenta",
  FIRST_TRANSACTION: "Primera transacción",
  CREATE_NFT: "Crear NFT",
  CREATE_TOKEN: "Crear token",
});

const algorandMenu = [
  {
    type: "list",
    name: "menu",
    message: "Menu",
    choices: [
      MENU.CREATE_ACCOUNT,
      MENU.ACCOUNT_INFORMATION,
      MENU.FIRST_TRANSACTION,
      MENU.CREATE_NFT,
      MENU.CREATE_TOKEN,
    ],
    default: "All",
  },
];

const triggerMenu = async () => {
  inquirer.prompt(algorandMenu).then(async (suite) => {
    switch (suite.menu) {
      case MENU.CREATE_ACCOUNT:
        const account = createAccount();
        // para mayor facilidad se guarda la data en globals. Practica totalmente NO recomendada en un ejercicio real.
        global.ADDRESS = account.addr;
        global.SK = account.sk;
        global.MNEMONIC = account.mnemonic;

        break;
      case MENU.ACCOUNT_INFORMATION:
        const holderAccount = await accountInformation(global.ADDRESS);
        console.log("HOLDER: ", holderAccount);

        break;
      case MENU.FIRST_TRANSACTION:
        firstTransaction(global.ADDRESS, global.SK);

        break;
      case MENU.CREATE_NFT:
        var nftUrl = readlineSync.question("Insertar url del NFT");
        createNFT(global.ADDRESS, nftUrl);

        break;
      default:
        var tokenUrl = readlineSync.question("Insertar url del Token");
        createToken(global.ADDRESS, tokenUrl);

        break;
    }
    triggerMenu();
  });
};

triggerMenu();
