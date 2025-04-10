// Setting up our test framework
const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const { provider } = require("../pact");
const { eachLike, integer, string, boolean } =
  require("@pact-foundation/pact").MatchersV3;

// Importing our system under test (the bookClient) and our Book model
const { Book } = require("./book");
const { fetchBooks } = require("./bookClient");

// This is where we start writing our test
describe("Pact with Book API", () => {
  describe("given there are books", () => {
    const bookProperties = {
      id: integer(1), // Expects an integer, example value 1
      name: string("Example Book Name"), // Expects *any* string
      type: string("fiction"),
      available: boolean(true), // Expects a boolean, example true
    };

    describe("when a call to the API is made", () => {
      before(() => {
        provider
          .given("there are books")
          .uponReceiving("a request for books")
          .withRequest({
            method: "GET",
            path: "/books",
          })
          .willRespondWith({
            body: eachLike(bookProperties),
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
          });
      });

      it("will receive the list of current books", () => {
        return provider.executeTest((mockServer) => {
          process.env.API_PORT = mockServer.port;
          return expect(fetchBooks()).to.eventually.satisfy((books) => {
            expect(books).to.be.an("array");
            expect(books).to.not.be.empty;

            books.forEach((book) => {
              expect(book).to.all.be.an.instanceof(Book);
              expect(book).to.all.have.property("id").that.is.a("number");
              expect(book).to.all.have.property("name").that.is.a("string");
              expect(book).to.all.have.property("type").that.is.a("string");
              expect(book)
                .to.all.have.property("available")
                .that.is.a("boolean");
            });

            return true;
          });
        });
      });
    });
  });
});
