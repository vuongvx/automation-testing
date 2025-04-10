const request = require("superagent");
const { Book } = require("./book");

const hostname = "127.0.0.1";

const fetchBooks = () => {
  return request.get(`http://${hostname}:${process.env.API_PORT}/books`).then(
    (res) => {
      return res.body.reduce((acc, o) => {
        acc.push(new Book(o.id, o.name, o.type, o.available));
        return acc;
      }, []);
    },
    (err) => {
      console.log(err);
      throw new Error(`Error from response: ${err.body}`);
    },
  );
};

module.exports = {
  fetchBooks,
};
