import { ApolloServer, gql } from 'apollo-server';
import { Repository } from '../models';
import { IInputGenerator, IConsensus } from '../interfaces';
import { genInputWithData } from '../util';

const typeDefs = gql`
  type Query {
    view(version: Int): View
    getERC20Balance(erc20ID: String, address: String): Int
    getERC20(erc20ID: String): ERC20
  }

  type Mutation {
    createERC20(input: CreateERC20Input): String
    transferERC20(input: TransferERC20Input): String
  }

  input CreateERC20Input {
    erc20ID: String!
    creator: String!
    supply: Int!
    creatorBalance: Int!
  }

  input TransferERC20Input {
    erc20ID: String!
    from: String!
    to: String!
    balance: Int!
  }

  type View {
    version: Int
    prevHash: String
    timestamp: Int
    inputs: [Input]
    outputs: [Output]
  }

  type Input {
    type: String
    data: String
    hash: String
  }

  type Output {
    type: String
    inputHash: String
    data: String
    hash: String
  }

  type ERC20 {
    erc20ID: String
    creator: String
    supply: Int
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    view(_, args, ctx: Context) {
      if (args.version) {
        return ctx.consensus.getView(args.version);
      }
      return ctx.consensus.getLatestView();
    },

    getERC20Balance(_, args, ctx: Context) {
      const erc20 = ctx.repo.erc20Map.get(args.erc20ID);
      if (erc20) {
        return erc20.getBalance(args.address);
      }

      return 0;
    },

    getERC20(_, args, ctx: Context) {
      return ctx.repo.erc20Map.get(args.erc20ID);
    },
  },

  Mutation: {
    createERC20(_, args, ctx: Context) {
      args.input.method = 'create';
      const data = JSON.stringify(args.input);
      const ig = ctx.igMap.get('ERC20');

      const input = genInputWithData('ERC20', data);
      ig?.allow(input);

      return input.hash;
    },

    transferERC20(_, args, ctx: Context) {
      args.input.method = 'transfer';

      const data = JSON.stringify(args.input);
      const ig = ctx.igMap.get('ERC20');

      const input = genInputWithData('ERC20', data);
      ig?.allow(input);

      return input.hash;
    },
  },
};

type Context = {
  repo: Repository;
  igMap: Map<string, IInputGenerator>;
  consensus: IConsensus;
};

export function run(ctx: Context) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async () => {
      return {
        repo: ctx.repo,
        igMap: ctx.igMap,
        consensus: ctx.consensus,
      };
    },
  });

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
}
