const path = require('path');
const { mergeResolvers, fileLoader } = require('merge-graphql-schemas');

const resolversArray = fileLoader(path.join(__dirname, './**/*.resolvers.*'));
const resolvers = mergeResolvers(resolversArray);

module.exports = resolvers;
