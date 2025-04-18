const Verifier = require("@pact-foundation/pact").Verifier;
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const { providerName, pactFile } = require("../pact.js");
chai.use(chaiAsPromised);
let opts;

const simpleBooksApiBaseUrl = "https://simple-books-api.glitch.me";

// Verify that the provider meets all consumer expectations
describe("Pact Verification", () => {
  before(() => {
    opts = {
      // we need to know the providers name
      provider: providerName,
      // we need to where the provider will be running,
      providerBaseUrl: simpleBooksApiBaseUrl,
      // You can set the log level here, useful for debugging
      logLevel: "info",
    };

    // The PACT_URL can either be a path to a local file
    // or one from a Pact Broker
    if (process.env.PACT_URL) {
      opts = {
        ...opts,
        pactUrls: [process.env.PACT_URL],
      };
      // as a convenience, we have provided a path to the example consumer/provider pact
      // generated when running npm run test:consumer
    } else if (!process.env.PACT_URL && !process.env.PACT_BROKER_BASE_URL) {
      opts = {
        ...opts,
        pactUrls: [pactFile],
      };
    }

    // If we have a broker, then some more options are relevant
    if (process.env.PACT_BROKER_BASE_URL) {
      opts = {
        ...opts,
        // we need to know where our broker is located
        pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
        // we need specifics about the provider version we are verifying so we
        // can identify it later
        providerVersion: process.env.GIT_COMMIT,
        providerVersionBranch: process.env.GIT_BRANCH,
        // we only want to publish pacts if we are in CI
        publishVerificationResult: !!process.env.CI ?? false,
      };

      // we need to setup our broker authentication options
      // if setup
      if (process.env.PACT_BROKER_USERNAME) {
        opts = {
          ...opts,
          pactBrokerUsername: process.env.PACT_BROKER_USERNAME,
          pactBrokerPassword: process.env.PACT_BROKER_PASSWORD,
        };
      } else if (process.env.PACT_BROKER_TOKEN) {
        opts = {
          ...opts,
          pactBrokerToken: process.env.PACT_BROKER_TOKEN,
        };
      }

      // if we have a PACT_URL provided to use by the Pact broker
      // we do not need to set these options.
      // In regular provider builds, these options become relevant to select
      // your pacts
      if (!process.env.PACT_URL) {
        opts = {
          ...opts,
          // We can use consumer version selectors for fine grained control
          // over the pacts we retrieve
          consumerVersionSelectors: [
            { mainBranch: true },
            { deployedOrReleased: true },
          ],
          // Dont allow pending pacts that haven't had a successful
          // verification to block provider build
          enablePending: true,
          // Allow the provider to catch any in-flight work in progress
          // pacts from the consumers
          includeWipPactsSince: "2022-01-01",
        };
      }
    }
  });

  it("should validate the expectations of SimpleBooks Web", () => {
    console.log(opts);
    return new Verifier(opts)
      .verifyProvider()
      .then((output) => {
        console.log("Pact Verification Complete!");
        console.log(output);
      })
      .catch((e) => {
        console.error("Pact verification failed :(", e);
      });
  });
});
