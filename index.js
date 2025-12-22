const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, timestamp, data, previoudHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previoudHash = previoudHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previoudHash +
        this.timestamp +
        JSON.stringify(this.data) +
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
  }

  createGenesisBlock() {
    return new Block(0, "01/01/2001", "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previoudHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
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

console.log(`Mining Block 1`);
Coin.addBlock(new Block(1, "20/1/2005", "Block 1"));

console.log(`Mining Block 1`);
Coin.addBlock(new Block(2, "20/2/2005", "Block 2"));
console.log(JSON.stringify(Coin, null, 2));
