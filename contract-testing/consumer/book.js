class Book {
  constructor(id, name, type, available) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.available = available;
  }

  toString() {
    return `Book ${this.id}, Name: ${this.name}`;
  }
}

module.exports = {
  Book,
};
