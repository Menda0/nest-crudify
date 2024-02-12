export default () => ({
  mongodb: {
    isTest: process.env.MONGODB_TEST,
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DBNAME,
  },
});
