import React, { useState, useEffect } from "react";
import {
  Center,
  VStack,
  Heading,
  Box,
  Text,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useSailsCalls } from "@/app/hooks";
import { CONTRACT_DATA } from "@/app/consts";
import { useSailsConfig } from "@/app/hooks/useSailsConfig";
import { useAlert } from "@gear-js/react-hooks";

function Proposals() {
  const toast = useToast();
  const [proposals, setProposals] = useState([]);
  const sails = useSailsCalls();
  const alert = useAlert();

  const sailsConfig = {
    network: "wss://testnet.vara.network",
    contractId: CONTRACT_DATA.programId,
    idl: CONTRACT_DATA.idl,
  };

  useSailsConfig(sailsConfig);

  useEffect(() => {
    if (!sails) {
      console.log("sails is not ready");
      return;
    }
    handleQueryProposals();
  }, [sails]);

  const handleQueryProposals = async () => {
    if (!sails) {
      alert.error("SailsCalls is not started!");
      return;
    }

    try {
     
      const response = await sails.query(
        `${CONTRACT_DATA.programId}/Service/QueryAllProposals`
    );


    console.log(response)
    setProposals(response);
      toast({
        title: "Proposals loaded successfully!",
        status: "success",
      });
    } catch (e) {
      alert.error("Error fetching proposals");
      console.error(e);
    }
  };

  return (
    <Center>
      <VStack spacing={6}>
        <Heading
          textColor="#00ffc4"
          fontSize="4xl"
          textShadow="2px 2px 0 #00bfa1, 4px 4px 0 #008f7d"
        >
          Proposals
        </Heading>
        <Box
          width="100%"
          maxW="800px"
          padding={6}
          boxShadow="lg"
          borderRadius="md"
          bg="gray.50"
        >
          {proposals.length ? (
            proposals.map((proposal, index) => (
              <Box
                key={index}
                p={4}
                mb={4}
                boxShadow="md"
                borderRadius="md"
                bg="white"
              >
                {/* <Text fontWeight="bold">Proposed by: {proposal.actor_id}</Text> */}
                {/* <Text fontSize={10} color={"black"} fontWeight="bold">Proposed by: {proposal[0]}</Text> */}
                <Text fontSize={10} color={"black"} fontWeight="bold">Title: {proposal[1].title}</Text>
                <Text fontSize={10} color={"black"}>Description: {proposal[1].description}</Text>
                <Text fontSize={10} color={"black"}>Objectives: {proposal[1].objectives}</Text>
                <Text fontSize={10} color={"black"}>Plan: {proposal[1].plan}</Text>
                <Text fontSize={10} color={"black"}>Budget: {proposal[1].budget}</Text>
                <Text fontSize={10} color={"black"}>Impact: {proposal[1].impact}</Text>

                {/* <Text fontWeight="bold">Title: {proposal.Proposal.title}</Text>
                <Text>Description: {proposal.Proposal.description}</Text>
                <Text>Objectives: {proposal.Proposal.objectives}</Text>
                <Text>Plan: {proposal.Proposal.plan}</Text>
                <Text>Budget: {proposal.Proposal.budget}</Text>
                <Text>Impact: {proposal.Proposal.impact}</Text> */}
              </Box>
            ))
          ) : (
            <Text>No proposals found.</Text>
          )}
        </Box>
        <Button
          onClick={handleQueryProposals}
          bg="#00ffc4"
          color="black"
          _hover={{ bg: "#00e6b0" }}
          fontWeight="bold"
        >
          Refresh Proposals
        </Button>
      </VStack>
    </Center>
  );
}

export { Proposals };