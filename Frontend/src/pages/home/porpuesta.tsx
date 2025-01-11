import React, { useState, useEffect } from "react";
import {
  Center,
  VStack,
  Heading,
  Box,
  Text,
  Button,
  useToast,
  Divider,
  HStack,
  Avatar,
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

      console.log(response);
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
       
        <Box
          width="100%"
          maxW="800px"
          padding={6}
          boxShadow="lg"
          borderRadius="md"
          bg="#1A1E1B"  // Fondo oscuro
        >
          {proposals.length ? (
            proposals.map((proposal, index) => (
              <Box
                key={index}
                p={4}
                mb={4}
                boxShadow="md"
                borderRadius="md"
                bg="#2D3333"  // Fondo oscuro para cada propuesta
              >
                <HStack spacing={4} align="center">
                  <Avatar size="sm" name="User Avatar" src="https://bit.ly/broken-link" />
                  <Box>
                    <Text fontSize="xl" fontWeight="bold" color="#00ffc4">
                      {proposal[1].title}
                    </Text>
                    <Text fontSize="sm" opacity={0.8} color="white">
                      Proposed by: {proposal[0]}
                    </Text>
                  </Box>
                </HStack>
                <Divider my={2} />
                <Text fontSize="sm" color="white" fontWeight="bold">
                  Description:
                </Text>
                <Text fontSize="sm" color="white">{proposal[1].description}</Text>

                <Text fontSize="sm" color="white" fontWeight="bold">
                  Objectives:
                </Text>
                <Text fontSize="sm" color="white">{proposal[1].objectives}</Text>

                <Text fontSize="sm" color="white" fontWeight="bold">
                  Plan:
                </Text>
                <Text fontSize="sm" color="white">{proposal[1].plan}</Text>

                <Text fontSize="sm" color="white" fontWeight="bold">
                  Budget:
                </Text>
                <Text fontSize="sm" color="white">{proposal[1].budget}</Text>

                <Text fontSize="sm" color="white" fontWeight="bold">
                  Impact:
                </Text>
                <Text fontSize="sm" color="white">{proposal[1].impact}</Text>
              </Box>
            ))
          ) : (
            <Text color="white">No proposals found.</Text>
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
