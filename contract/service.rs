// Add your service code
// service.rs
// necessary crates
use sails_rs::{
    prelude::*,
    gstd::msg,
};
use gstd::actor_id;


// import the state
use crate::states::*;
use crate::services::service::state::*;

#[derive(Default)]
pub struct Service;

// Implementation for seed related function to init the state
impl Service {
    // Initialize the service state (call only once)
    pub fn seed() {
        State::init_state();
    }
}

#[service]
impl Service {
    // Service constructor
    pub fn new() -> Self {
        Self
    }

    // Service to handle user registration
    //pub fn register_user(&mut self, wallet: ActorId, name: String, role: String, gender: String, country: String) {
    pub fn register_user(&mut self, name: String, role: String, gender: String, country: String) {
        let wallet = msg::source();
        // Validate inputs
        if name.is_empty() || role.is_empty() || gender.is_empty() || country.is_empty() {
            panic!("All fields are required");
        }

        // Register the user
        let user = User {
            wallet,
            name,
            role,
            gender,
            country,
        };
        State::state_mut().register_user(user);
    }

    // Service to allow user login with wallet
    pub fn login(&mut self, wallet: ActorId) {
        // Check if the user exists
        let user_exists = State::state_ref().all_users.iter().any(|user| user.wallet == wallet);
        if !user_exists {
            panic!("User not registered");
        }
    }

    // Service to submit a proposal
    pub fn submit_proposal(
        &mut self, 
        wallet: ActorId, 
        title: String, 
        description: String, 
        objectives: String, 
        plan: String, 
        budget: u64, 
        impact: String
    ) -> Events {
        // Validate inputs
        if title.is_empty() || description.is_empty() || objectives.is_empty() || plan.is_empty() || impact.is_empty() {
            panic!("All fields are required");
        }

        // Submit the proposal
        let proposal = Proposal {
            title,
            description,
            objectives,
            plan,
            budget,
            impact,
        };
        
        match State::state_mut().submit_proposal(wallet, proposal) {
            Ok(_) => Events::ProposalSubmitted,
            Err(e) => panic!("{}", e),
        }
    }

    // Query for admins
    pub fn query_admins(&self) -> Vec<ActorId> {
        State::state_ref().admins.clone()
    }

    // Query for all users
    pub fn query_all_users(&self) -> Vec<User> {
        State::state_ref().all_users.clone()
    }

    // Query for all proposals
    pub fn query_all_proposals(&self) -> Vec<(ActorId, Proposal)> {
        State::state_ref().register.clone()
    }

    // Returns a struct for a user query
    pub fn query(&self) -> IoState {
        //State::state_ref().to_owned().into()
        let state = State::state_ref();

        let ioState = IoState {
            admins: state.admins.clone(),
            all_users: state.all_users.clone(),
            register: state.register.clone()
        };

        ioState
    }
}

// Struct to use as a response to the user
#[derive(Encode, Decode, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub enum Events {
    ProposalSubmitted,
}

