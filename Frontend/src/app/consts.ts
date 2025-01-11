import { HexString } from '@gear-js/api';

interface ContractSails {
  programId: HexString,
  idl: string
}

export const ACCOUNT_ID_LOCAL_STORAGE_KEY = 'account';

export const ADDRESS = {
  NODE: import.meta.env.VITE_NODE_ADDRESS,
  BACK: import.meta.env.VITE_BACKEND_ADDRESS,
  GAME: import.meta.env.VITE_CONTRACT_ADDRESS as HexString,
};

export const ROUTES = {
  HOME: '/',
  EXAMPLES: '/examples',
  NOTFOUND: '*',
};

// To use the example code, enter the details of the account that will pay the vouchers, etc. (name and mnemonic)
// Here, you have an example account that contains tokens, in your dApp, you need to put a sponsor name
// and a sponsor mnemonic
export const sponsorName = 'Alice';
export const sponsorMnemonic = 'bottom drive obey lake curtain smoke basket hold race lonely fit walk';

export const CONTRACT_DATA: ContractSails = {
  programId: '0x6867f02724caa4f851d274d6e4d73f6b8bca3392c45b3863910f3770a1e24ae7',
  idl: `
    type Events = enum {
  ProposalSubmitted,
};

type IoState = struct {
  admins: vec actor_id,
  all_users: vec User,
  register: vec struct { actor_id, Proposal },
};

type User = struct {
  wallet: actor_id,
  name: str,
  role: str,
  gender: str,
  country: str,
};

type Proposal = struct {
  title: str,
  description: str,
  objectives: str,
  plan: str,
  budget: u64,
  impact: str,
};

constructor {
  New : ();
};

service Service {
  Login : (wallet: actor_id) -> null;
  RegisterUser : (name: str, role: str, gender: str, country: str) -> null;
  SubmitProposal : (wallet: actor_id, title: str, description: str, objectives: str, plan: str, budget: u64, impact: str) -> Events;
  query Query : () -> IoState;
  query QueryAdmins : () -> vec actor_id;
  query QueryAllProposals : () -> vec struct { actor_id, Proposal };
  query QueryAllUsers : () -> vec User;
};`
};