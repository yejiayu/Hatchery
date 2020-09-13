import { Consensus } from './consensus';
import { getInputGenerators, getOutputGenerators } from './generator';
import { Event } from './event';
// import { sha3Hash } from './util';
import { Dispatcher } from './dispatcher';
// import { IERC20TransferData, IERC20CreateData } from './generator/erc20/types';
import { StateBuffer } from './state-buffer';
import { Repository } from './models';
import { run } from './graphql';

const event = new Event();
const repo = new Repository();
const sb = new StateBuffer();

const igs = getInputGenerators(sb, event);
const ogs = getOutputGenerators(repo);

const igMap = new Map();
for (const ig of igs) {
  igMap.set(ig.type(), ig);
}
sb.setIGMap(igMap);

const dispatcher = new Dispatcher(ogs, sb);

const con = new Consensus(event, sb, dispatcher);
con.start().catch(console.error);
event.on('newView', (newView) => {
  console.log('emit new view', newView);
});

run({ repo, igMap, consensus: con });

// const createData: IERC20CreateData = {
//     method: "create",
//     erc20ID: "MTT",
//     creator: "yjy",
//     supply: 1024 * 1024 * 1024,
//     creatorBalance: 1024 * 1024,
// }

// const createInput = {
//     type: "ERC20",
//     data: JSON.stringify(createData),
//     hash: "",
// };
// createInput.hash = sha3Hash(JSON.stringify(createInput));
// erc20IG.allow(createInput);

// const transferData: IERC20TransferData = {
//     method: "transfer",
//     erc20ID: "MTT",
//     from: "yjy",
//     to: "muta",
//     balance: 100,
// };
// const erc20Input = {
//     type: "ERC20",
//     data: JSON.stringify(transferData),
//     hash: "",
// };
// const inputHash = sha3Hash(JSON.stringify(erc20Input));
// erc20Input.hash = inputHash;

// erc20IG.allow(erc20Input);

// event.on("newView", newView => {
//     console.log("emit new view", newView);
// })
