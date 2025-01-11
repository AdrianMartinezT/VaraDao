

// Add your state code

// State.rs
// necesary crates
use sails_rs::{
    prelude::*
};
use gstd::actor_id;

// static mut variable (contract's state)
pub static mut STATE: Option<State> = None;

// Create a struct for the state
#[derive(Clone, Default)]
pub struct State {
    pub admins: Vec<ActorId>,
    pub all_users: Vec<User>,
    pub register: Vec<(ActorId, Proposal)>,
}

// Struct para representar un usuario
#[derive(Encode, Decode, TypeInfo, Clone)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct User {
    pub wallet: ActorId,
    pub name: String,
    pub role: String,
    pub gender: String,
    pub country: String,
}

// Struct para representar una propuesta
#[derive(Encode, Decode, TypeInfo, Clone)]
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

// Impl to set methods or related functions
impl State {
    // Method to create a new instance 
    pub fn new() -> Self {
        Self { ..Default::default() }
    }

    // Related function to init the state
    pub fn init_state() {
        unsafe {
            STATE = Some(Self::new());
        }
    }

    // Related function to get the state as mut
    pub fn state_mut() -> &'static mut State {
        let state = unsafe { STATE.as_mut() };
        debug_assert!(state.is_some(), "The state is not initialized");
        unsafe { state.unwrap_unchecked() }
    }

    // Related function to get the state as ref
    pub fn state_ref() -> &'static State {
        let state = unsafe { STATE.as_ref() };
        debug_assert!(state.is_some(), "The state is not initialized");
        unsafe { state.unwrap_unchecked() }
    }

    // Function to register a new user
    pub fn register_user(&mut self, user: User) {
        self.all_users.push(user);
    }

    // Function to submit a proposal
    pub fn submit_proposal(&mut self, wallet: ActorId, proposal: Proposal) -> Result<(), &'static str> {
        let user_has_balance = self.check_balance(wallet, 10);
        if user_has_balance {
            self.process_payment(wallet, 10)?;
            self.register.push((wallet, proposal));
            Ok(())
        } else {
            Err("Insufficient $GVara balance")
        }
    }

    // Placeholder function to check user's balance
    fn check_balance(&self, wallet: ActorId, amount: u64) -> bool {
        // Logic to check if user has enough balance
        true
    }

    // Placeholder function to process payment
    fn process_payment(&self, wallet: ActorId, amount: u64) -> Result<(), &'static str> {
        // Logic to transfer $GVara from user's wallet to target_wallet
        // gstf
        //let target_wallet = ActorId::from([0x6b, 0x47, 0x66, 0x76, 0x42, 0x4e, 0x41, 0x46, 0x6d, 0x44, 0x33, 0x59, 0x4e, 0x67, 0x64, 0x61, 0x54, 0x55, 0x42, 0x68, 0x53, 0x4d, 0x47, 0x4d, 0x63, 0x4e, 0x76, 0x68, 0x63, 0x4b, 0x74, 0x66, 0x77, 0x70, 0x4c, 0x34, 0x46, 0x67, 0x41, 0x79, 0x31, 0x48, 0x72, 0x57, 0x54, 0x46, 0x4e, 0x32, 0x59]);
        let target_wallet = actor_id!("0x10ec502f53ce70403a4aeea11cacb9ef26a6c73b0c912ee6626e432388fc9769");
        let _result = transfer_funds(wallet, target_wallet, amount);
        Ok(())
    }
}

// Create a struct that can be sent to the user who reads state
#[derive(Encode, Decode, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct IoState {
    pub admins: Vec<ActorId>,
    pub all_users: Vec<User>,
    pub register: Vec<(ActorId, Proposal)>,
}

// Function to simulate the transfer of funds (this is a placeholder)
fn transfer_funds(_from: ActorId, _to: ActorId, _amount: u64) -> Result<(), &'static str> {
    // Logic for fund transfer
    Ok(())
}