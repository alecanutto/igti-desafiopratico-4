import { db } from '../models/index.js';

const Account = db.account;

const validateAccount = async (account) => {
  const { agencia, conta } = account;
  account = {
    agencia,
    conta
  };
  try {
    if (typeof account.agencia !== 'undefined' && typeof account.agencia !== null) {
      account = await Account.findOne(account);
    } else {
      account = await Account.findOne({ conta: account.conta });
    }
    if (!account) {
      throw new Error(`(${agencia}/${conta}) agencia/conta invalida`);
    }
    return account;
  } catch (error) {
    throw new Error(error.message);
  }
};

const validateBalance = async (account) => {
  const { agencia, conta, balance } = account;
  account = {
    agencia,
    conta
  };
  try {
    if (typeof account.agencia !== 'undefined' && typeof account.agencia !== null) {
      account = await Account.findOne(account);
    } else {
      account = await Account.findOne({ conta: account.conta });
    }
    if (!account) {
      throw new Error(`(${agencia}/${conta}) agencia/conta inválida`);
    }
    if (account.balance < balance) {
      throw new Error(`Saldo insuficiente! (${agencia}/${conta}) agencia/conta possui saldo de: ${account.balance}`);
    }
    return account;
  } catch (error) {
    throw new Error(error.message);
  }
};

const fixbalance = async (req, res) => {
  const account = req.params;
  const { balance } = req.body;
  try {
    let newAccount = await validateAccount(account);
    console.log(balance);
    newAccount.balance = balance;
    newAccount = new Account(newAccount);
    await newAccount.save();
    res.send(newAccount);
  } catch (error) {
    throw new Error(error.message);
  }
};

const deposit = async (req, res) => {
  const account = req.body;
  try {
    let newDeposit = await validateAccount(account);
    newDeposit.balance += account.balance;
    newDeposit = new Account(newDeposit);
    await newDeposit.save();
    res.send(newDeposit);
  } catch (error) {
    throw new Error(error.message);
  }
};

const withdraw = async (req, res) => {
  const account = req.body;
  try {
    let newWithdraw = await validateBalance(account);
    newWithdraw.balance -= (account.balance + 1);
    newWithdraw = new Account(newWithdraw);
    await newWithdraw.save();
    res.send(newWithdraw);
  } catch (error) {
    throw new Error(error.message);
  }
};

const checkbalance = async (req, res) => {
  const account = req.params;
  try {
    const newAccount = await validateAccount(account);
    res.send(`Saldo: ${newAccount.balance}`);
  } catch (error) {
    throw new Error(error.message);
  }
};

const remove = async (req, res) => {
  const account = req.body;
  try {
    const countDeleted = await Account.findOneAndDelete({ conta: account.conta });
    console.log(countDeleted);
    const count = await Account.countDocuments({ agencia: account.agencia });
    res.send(`Quantidade: ${count}`);
  } catch (error) {
    throw new Error(error.message);
  }
};

const transfer = async (req, res) => {
  const account = req.body;
  try {
    const accountSource = await Account.findOne({ conta: account.contaOrigem });
    const accountTarget = await Account.findOne({ conta: account.contaDestino });
    let valueTransfer = account.balance;
    if (accountSource.agencia !== accountTarget.agencia) {
      valueTransfer += 8;
    }
    accountSource.balance -= valueTransfer;
    await accountSource.save();
    accountTarget.balance += account.balance;
    await accountTarget.save();
    res.send(`Saldo conta de origem: ${accountSource.balance}`);
  } catch (error) {
    throw new Error(error.message);
  }
};

const avgbalance = async (req, res) => {
  const { agencia } = req.params;
  try {
    const pipeline = [
      {
        '$match': {
          'agencia': parseInt(agencia)
        }
      }, {
        '$group': {
          '_id': '$agencia',
          'media': {
            '$avg': '$balance'
          }
        }
      },
    ];
    const avg = await Account.aggregate(pipeline);
    res.send(`Média: ${avg[0].media}`);
  } catch (error) {
    throw new Error(error.message);
  }
};

const topbybalancelowest = async (req, res) => {
  const { limit } = req.params;
  try {
    const pipeline = [
      {
        '$sort': {
          'balance': 1
        }
      }, {
        '$limit': parseInt(limit)
      }
    ];
    const accounts = await Account.aggregate(pipeline);
    res.send(accounts);
  } catch (error) {
    throw new Error(error.message);
  }
};

const topbybalancehighest = async (req, res) => {
  const { limit } = req.params;
  try {
    const pipeline = [
      {
        '$sort': {
          'balance': -1,
          'name': 1
        }
      }, {
        '$limit': parseInt(limit)
      }
    ];
    const accounts = await Account.aggregate(pipeline);
    res.send(accounts);
  } catch (error) {
    throw new Error(error.message);
  }
};

const transfertoprivate = async (_, res) => {
  try {
    const pipeline = [
      {
        '$sort': {
          'balance': -1
        }
      }, {
        '$group': {
          '_id': '$agencia',
          'balance': {
            '$max': '$balance'
          }
        }
      }
    ];
    const resultGroup = await Account.aggregate(pipeline);
    resultGroup.map(async result => {
      await Account.findOneAndUpdate({ agencia: result._id, balance: result.balance }, { agencia: 99 });
    });
    const accounts99 = await Account.find({ agencia: 99 });
    res.send(accounts99);
  } catch (error) {
    throw new Error(error.message);
  }
};

export default {
  fixbalance,
  deposit,
  withdraw,
  checkbalance,
  remove,
  transfer,
  avgbalance,
  topbybalancelowest,
  topbybalancehighest,
  transfertoprivate,
};
