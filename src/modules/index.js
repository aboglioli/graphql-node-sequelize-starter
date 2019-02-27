const { mergeTypes, mergeResolvers } = require('merge-graphql-schemas');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const { makeExecutableSchema } = require('graphql-tools');

const types = glob
  .sync(path.join(__dirname, './**/*.graphql'))
  .map(file => fs.readFileSync(file, { encoding: 'utf-8' }));

const resolvers = glob
  .sync(path.join(__dirname, './**/*resolvers.*'))
  .map(file => require(file));

module.exports = makeExecutableSchema({
  typeDefs: mergeTypes(types),
  resolvers: mergeResolvers(resolvers),
});
