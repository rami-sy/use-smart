const _ = require("lodash");

class AccountManager {
  static missingAccounts(ldapAccounts, azureAccounts) {
    const missing = [];

    if (_.isEmpty(ldapAccounts) && _.isEmpty(azureAccounts)) {
      return missing;
    }

    if (_.isEmpty(ldapAccounts)) {
      for (let azure of azureAccounts) {
        missing.push({ userId: azure.userId, missingAccount: "LDAP" });
      }
      return missing;
    }

    if (_.isEmpty(azureAccounts)) {
      for (let ldap of ldapAccounts) {
        missing.push({ userId: ldap.userId, missingAccount: "Azure" });
      }
      return missing;
    }

    for (let ldap of ldapAccounts) {
      if (!_.some(azureAccounts, ["userId", ldap.userId])) {
        missing.push({ userId: ldap.userId, missingAccount: "Azure" });
      }
    }

    for (let azure of azureAccounts) {
      if (!_.some(ldapAccounts, ["userId", azure.userId])) {
        missing.push({ userId: azure.userId, missingAccount: "LDAP" });
      }
    }

    return missing;
  }

  static summarizeCountries(users) {
    return _.countBy(users, "country");
  }

  static mergeAccounts(users, ldapAccounts, azureAccounts) {
    return users.map((user, index) => {
      const accounts = [];
      if (ldapAccounts[index]) accounts.push(ldapAccounts[index]);
      if (azureAccounts[index]) accounts.push(azureAccounts[index]);

      return {
        ...user,
        accounts,
      };
    });
  }
}

// // given accounts
// // notice undefined values
// // if juan is third in users list then his corresponding account or undefined value are also in third place
// const ldapAccounts = [
//   { ldapId: 1, userId: 145, email: "john@example.com" },
//   { ldapId: 2, userId: 293, email: "jane@example.com" },
//   undefined,
//   undefined,
// ];

// const azureAccounts = [
//   { id: 43, userId: 145, email: "john@example.com" },
//   undefined,
//   { id: 44, userId: 712, email: "juan@example.com" },
//   undefined,
// ];

// const users = [
//   { country: "USA", userId: 145, email: "john@example.com" },
//   { country: "USA", userId: 293, email: "jane@example.com" },
//   { country: "Peru", userId: 712, email: "juan@example.com" },
//   { country: "Chile", userId: 782, email: "matias@example.com" },
// ];

// // when mergeAccounts method is called
// const result = AccountManager.mergeAccounts(users, ldapAccounts, azureAccounts);

// // then returned result should be as follows
// console.log(result);

// [
//     {
//         userId: 145,
//         country: "USA",
//         email: "john@example.com",
//         accounts: [
//             { ldapId: 1, userId: 145, email: "john@example.com" },
//             { id: 43, userId: 145, email: "john@example.com" },
//         ],
//     },
//     {
//         userId: 293,
//         country: "USA",
//         email: "jane@example.com",
//         accounts: [{ ldapId: 2, userId: 293, email: "jane@example.com" }],
//     },
//     {
//         userId: 712,
//         country: "Peru",
//         email: "juan@example.com",
//         accounts: [{ id: 44, userId: 712, email: "juan@example.com" }],
//     },
//     {
//         userId: 782,
//         country: "Chile",
//         email: "matias@example.com",
//         accounts: [],
//     }
// ];
const ldapAccounts = [
  { ldapId: 1, userId: 145, email: "john@example.com" },
  undefined,
  undefined,
  { ldapId: 3, userId: 782, email: "matias@example.com" },
];

const azureAccounts = [
  undefined,
  { id: 44, userId: 293, email: "jane@example.com" },
  { id: 45, userId: 712, email: "juan@example.com" },
  undefined,
];

const users = [
  { country: "USA", userId: 145, email: "john@example.com" },
  { country: "USA", userId: 293, email: "jane@example.com" },
  { country: "Peru", userId: 712, email: "juan@example.com" },
  { country: "Chile", userId: 782, email: "matias@example.com" },
];

const result = AccountManager.mergeAccounts(users, ldapAccounts, azureAccounts);
console.log({ result: JSON.stringify(result) });
