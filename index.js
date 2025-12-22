const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, timestamp, data, previoudHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previoudHash = previoudHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previoudHash +
        this.timestamp +
        JSON.stringify(this.data),
    ).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, "01/01/2001", "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previoudHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
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
Coin.addBlock(new Block(1, "02/01/2001", "Block Two"));
Coin.addBlock(new Block(2, "03/01/2001", "Block Three"));
console.log(`Is this chain valid? ${Coin.isClainValid()}`);
Coin.addBlock(new Block(3, "04/01/2001", "Block Four"));
Coin.chain[3].data = "Block Edit";
console.log(`Is this chain valid? ${Coin.isClainValid()}`);
// console.log(JSON.stringify(Coin, null, 2));
