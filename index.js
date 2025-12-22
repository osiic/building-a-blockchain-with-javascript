const SHA256 = require("crypto-js/sha256");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  constructor(transactions, previoudHash = "") {
    this.timestamp = Date.now();
    this.transactions = transactions;
    this.previoudHash = previoudHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previoudHash +
        this.timestamp +
        JSON.stringify(this.transactions) +
        this.nonce,
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`Block Mined: ${this.hash}`);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block("Genesis Block", "0000");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  miningPendingTransactions(miningRewardAddress) {
    let block = new Block(this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log("Block succesfully minde!");
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }

        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }
    return balance;
  }

  isClainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previoudBlock = this.chain[i - 1];

      if (
        currentBlock.hash !== currentBlock.calculateHash() ||
        currentBlock.previoudHash !== previoudBlock.hash
      ) {
        return false;
      }
    }
    return true;
  }
}

const Coin = new Blockchain();

console.log(
  `\n Balance of address1 is ${Coin.getBalanceOfAddress("address1")}`,
  `\n Balance of address2 is ${Coin.getBalanceOfAddress("address2")}`,
  `\n Balance of address3 is ${Coin.getBalanceOfAddress("address3")}`,
);

Coin.createTransaction(new Transaction(null, "address2", 1000));
Coin.createTransaction(new Transaction("address2", "address1", 500));

console.log(`\n Starting the miner...`);
Coin.miningPendingTransactions("address3");

console.log(
  `\n Balance of address1 is ${Coin.getBalanceOfAddress("address1")}`,
  `\n Balance of address2 is ${Coin.getBalanceOfAddress("address2")}`,
  `\n Balance of address3 is ${Coin.getBalanceOfAddress("address3")}`,
);

console.log(`\n Starting the miner Again...`);
Coin.miningPendingTransactions("address3");

console.log(
  `\n Balance of address1 is ${Coin.getBalanceOfAddress("address1")}`,
  `\n Balance of address2 is ${Coin.getBalanceOfAddress("address2")}`,
  `\n Balance of address3 is ${Coin.getBalanceOfAddress("address3")}`,
);

// console.log(JSON.stringify(Coin, null, 2));
