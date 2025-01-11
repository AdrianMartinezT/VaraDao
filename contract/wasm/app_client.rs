// Code generated by sails-client-gen. DO NOT EDIT.
#[allow(unused_imports)]
use sails_rs::collections::BTreeMap;
#[allow(unused_imports)]
use sails_rs::{
    calls::{Activation, Call, Query, Remoting, RemotingAction},
    prelude::*,
    String,
};
pub struct AppFactory<R> {
    #[allow(dead_code)]
    remoting: R,
}
impl<R> AppFactory<R> {
    #[allow(unused)]
    pub fn new(remoting: R) -> Self {
        Self { remoting }
    }
}
impl<R: Remoting + Clone> traits::AppFactory for AppFactory<R> {
    type Args = R::Args;
    fn new(&self) -> impl Activation<Args = R::Args> {
        RemotingAction::<_, app_factory::io::New>::new(self.remoting.clone(), ())
    }
}

pub mod app_factory {
    use super::*;
    pub mod io {
        use super::*;
        use sails_rs::calls::ActionIo;
        pub struct New(());
        impl New {
            #[allow(dead_code)]
            pub fn encode_call() -> Vec<u8> {
                <New as ActionIo>::encode_call(&())
            }
        }
        impl ActionIo for New {
            const ROUTE: &'static [u8] = &[12, 78, 101, 119];
            type Params = ();
            type Reply = ();
        }
    }
}
pub struct Service<R> {
    remoting: R,
}
impl<R> Service<R> {
    pub fn new(remoting: R) -> Self {
        Self { remoting }
    }
}
impl<R: Remoting + Clone> traits::Service for Service<R> {
    type Args = R::Args;
    fn login(&mut self, wallet: ActorId) -> impl Call<Output = (), Args = R::Args> {
        RemotingAction::<_, service::io::Login>::new(self.remoting.clone(), wallet)
    }
    fn register_user(
        &mut self,
        name: String,
        role: String,
        gender: String,
        country: String,
    ) -> impl Call<Output = (), Args = R::Args> {
        RemotingAction::<_, service::io::RegisterUser>::new(
            self.remoting.clone(),
            (name, role, gender, country),
        )
    }
    fn submit_proposal(
        &mut self,
        wallet: ActorId,
        title: String,
        description: String,
        objectives: String,
        plan: String,
        budget: u64,
        impact: String,
    ) -> impl Call<Output = Events, Args = R::Args> {
        RemotingAction::<_, service::io::SubmitProposal>::new(
            self.remoting.clone(),
            (wallet, title, description, objectives, plan, budget, impact),
        )
    }
    fn query(&self) -> impl Query<Output = IoState, Args = R::Args> {
        RemotingAction::<_, service::io::Query>::new(self.remoting.clone(), ())
    }
    fn query_admins(&self) -> impl Query<Output = Vec<ActorId>, Args = R::Args> {
        RemotingAction::<_, service::io::QueryAdmins>::new(self.remoting.clone(), ())
    }
    fn query_all_proposals(&self) -> impl Query<Output = Vec<(ActorId, Proposal)>, Args = R::Args> {
        RemotingAction::<_, service::io::QueryAllProposals>::new(self.remoting.clone(), ())
    }
    fn query_all_users(&self) -> impl Query<Output = Vec<User>, Args = R::Args> {
        RemotingAction::<_, service::io::QueryAllUsers>::new(self.remoting.clone(), ())
    }
}

pub mod service {
    use super::*;

    pub mod io {
        use super::*;
        use sails_rs::calls::ActionIo;
        pub struct Login(());
        impl Login {
            #[allow(dead_code)]
            pub fn encode_call(wallet: ActorId) -> Vec<u8> {
                <Login as ActionIo>::encode_call(&wallet)
            }
        }
        impl ActionIo for Login {
            const ROUTE: &'static [u8] = &[
                28, 83, 101, 114, 118, 105, 99, 101, 20, 76, 111, 103, 105, 110,
            ];
            type Params = ActorId;
            type Reply = ();
        }
        pub struct RegisterUser(());
        impl RegisterUser {
            #[allow(dead_code)]
            pub fn encode_call(
                name: String,
                role: String,
                gender: String,
                country: String,
            ) -> Vec<u8> {
                <RegisterUser as ActionIo>::encode_call(&(name, role, gender, country))
            }
        }
        impl ActionIo for RegisterUser {
            const ROUTE: &'static [u8] = &[
                28, 83, 101, 114, 118, 105, 99, 101, 48, 82, 101, 103, 105, 115, 116, 101, 114, 85,
                115, 101, 114,
            ];
            type Params = (String, String, String, String);
            type Reply = ();
        }
        pub struct SubmitProposal(());
        impl SubmitProposal {
            #[allow(dead_code)]
            pub fn encode_call(
                wallet: ActorId,
                title: String,
                description: String,
                objectives: String,
                plan: String,
                budget: u64,
                impact: String,
            ) -> Vec<u8> {
                <SubmitProposal as ActionIo>::encode_call(&(
                    wallet,
                    title,
                    description,
                    objectives,
                    plan,
                    budget,
                    impact,
                ))
            }
        }
        impl ActionIo for SubmitProposal {
            const ROUTE: &'static [u8] = &[
                28, 83, 101, 114, 118, 105, 99, 101, 56, 83, 117, 98, 109, 105, 116, 80, 114, 111,
                112, 111, 115, 97, 108,
            ];
            type Params = (ActorId, String, String, String, String, u64, String);
            type Reply = super::Events;
        }
        pub struct Query(());
        impl Query {
            #[allow(dead_code)]
            pub fn encode_call() -> Vec<u8> {
                <Query as ActionIo>::encode_call(&())
            }
        }
        impl ActionIo for Query {
            const ROUTE: &'static [u8] = &[
                28, 83, 101, 114, 118, 105, 99, 101, 20, 81, 117, 101, 114, 121,
            ];
            type Params = ();
            type Reply = super::IoState;
        }
        pub struct QueryAdmins(());
        impl QueryAdmins {
            #[allow(dead_code)]
            pub fn encode_call() -> Vec<u8> {
                <QueryAdmins as ActionIo>::encode_call(&())
            }
        }
        impl ActionIo for QueryAdmins {
            const ROUTE: &'static [u8] = &[
                28, 83, 101, 114, 118, 105, 99, 101, 44, 81, 117, 101, 114, 121, 65, 100, 109, 105,
                110, 115,
            ];
            type Params = ();
            type Reply = Vec<ActorId>;
        }
        pub struct QueryAllProposals(());
        impl QueryAllProposals {
            #[allow(dead_code)]
            pub fn encode_call() -> Vec<u8> {
                <QueryAllProposals as ActionIo>::encode_call(&())
            }
        }
        impl ActionIo for QueryAllProposals {
            const ROUTE: &'static [u8] = &[
                28, 83, 101, 114, 118, 105, 99, 101, 68, 81, 117, 101, 114, 121, 65, 108, 108, 80,
                114, 111, 112, 111, 115, 97, 108, 115,
            ];
            type Params = ();
            type Reply = Vec<(ActorId, super::Proposal)>;
        }
        pub struct QueryAllUsers(());
        impl QueryAllUsers {
            #[allow(dead_code)]
            pub fn encode_call() -> Vec<u8> {
                <QueryAllUsers as ActionIo>::encode_call(&())
            }
        }
        impl ActionIo for QueryAllUsers {
            const ROUTE: &'static [u8] = &[
                28, 83, 101, 114, 118, 105, 99, 101, 52, 81, 117, 101, 114, 121, 65, 108, 108, 85,
                115, 101, 114, 115,
            ];
            type Params = ();
            type Reply = Vec<super::User>;
        }
    }
}
#[derive(PartialEq, Clone, Debug, Encode, Decode, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub enum Events {
    ProposalSubmitted,
}
#[derive(PartialEq, Clone, Debug, Encode, Decode, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct IoState {
    pub admins: Vec<ActorId>,
    pub all_users: Vec<User>,
    pub register: Vec<(ActorId, Proposal)>,
}
#[derive(PartialEq, Clone, Debug, Encode, Decode, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct User {
    pub wallet: ActorId,
    pub name: String,
    pub role: String,
    pub gender: String,
    pub country: String,
}
#[derive(PartialEq, Clone, Debug, Encode, Decode, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct Proposal {
    pub title: String,
    pub description: String,
    pub objectives: String,
    pub plan: String,
    pub budget: u64,
    pub impact: String,
}

pub mod traits {
    use super::*;
    #[allow(dead_code)]
    pub trait AppFactory {
        type Args;
        #[allow(clippy::new_ret_no_self)]
        #[allow(clippy::wrong_self_convention)]
        fn new(&self) -> impl Activation<Args = Self::Args>;
    }

    #[allow(clippy::type_complexity)]
    pub trait Service {
        type Args;
        fn login(&mut self, wallet: ActorId) -> impl Call<Output = (), Args = Self::Args>;
        fn register_user(
            &mut self,
            name: String,
            role: String,
            gender: String,
            country: String,
        ) -> impl Call<Output = (), Args = Self::Args>;
        fn submit_proposal(
            &mut self,
            wallet: ActorId,
            title: String,
            description: String,
            objectives: String,
            plan: String,
            budget: u64,
            impact: String,
        ) -> impl Call<Output = Events, Args = Self::Args>;
        fn query(&self) -> impl Query<Output = IoState, Args = Self::Args>;
        fn query_admins(&self) -> impl Query<Output = Vec<ActorId>, Args = Self::Args>;
        fn query_all_proposals(
            &self,
        ) -> impl Query<Output = Vec<(ActorId, Proposal)>, Args = Self::Args>;
        fn query_all_users(&self) -> impl Query<Output = Vec<User>, Args = Self::Args>;
    }
}