
// Uncommenting the defaults below
// provides for an easier quick-start with Ganache.
// You can also follow this format for other networks;
// see <http://truffleframework.com/docs/advanced/configuration>
// for more details on how to specify configuration options!
module.exports = {
  networks: {
    development: { // This one is optional and reduces the scope for failing fast
      host: "localhost",
      port: 7545,
      network_id: "*", // Match any network id
      gas: 5000000
    },
    net42: {
      host: "localhost",
      port: 8545,
      network_id: 42,
      gas: 5000000
    }
  },
  compilers: {
    solc: {
      version: "^0.5.12"
    }
  }
};