// export function to be called after all jest tests run
// fixes a common bug found when jest testing a mongoose app

module.exports = () => {
  process.exit(0);
};