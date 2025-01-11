import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  useToast,
  Avatar,
  Divider,
  Spacer,
} from "@chakra-ui/react";
import {
  FaUserPlus,
  FaArrowCircleUp,
  FaHome,
  FaComments,
  FaVoteYea,
  FaCoins,
  FaGavel,
} from "react-icons/fa";
import { useAccount, useAlert } from "@gear-js/react-hooks";
import { useSailsCalls } from "@/app/hooks";
import { web3FromSource } from "@polkadot/extension-dapp";
import { CONTRACT_DATA } from "@/app/consts";
import { useSailsConfig } from "@/app/hooks/useSailsConfig";
import { Proposals } from "./porpuesta";
/**
 * Servicios que utilizaremos.
 */
const services = [
  { label: "RegisterUser", params: ["name", "role", "gender", "country"] },
  {
    label: "SubmitProposal",
    params: [
      "wallet",
      "title",
      "description",
      "objectives",
      "plan",
      "budget",
      "impact",
    ],
  },
];

function SailsComponent() {
  const toast = useToast();

  // Control de modales
  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onClose: onRegisterClose,
  } = useDisclosure();

  const {
    isOpen: isProposalOpen,
    onOpen: onProposalOpen,
    onClose: onProposalClose,
  } = useDisclosure();

  // Guarda el tipo de servicio actual (RegisterUser o SubmitProposal)
  const [currentService, setCurrentService] = useState("");
  // Guarda los valores de los formularios
  const [formData, setFormData] = useState({});
  // Guarda la info de un blockhash
  const [blockhash, setBlockhash] = useState("");

  // Hooks de Polkadot.js + Sails
  const { account } = useAccount();
  const sails = useSailsCalls();
  const alert = useAlert();

  // Config del contrato
  const sailsConfig = {
    network: "wss://testnet.vara.network",
    contractId: CONTRACT_DATA.programId,
    idl: CONTRACT_DATA.idl,
  };
  useSailsConfig(sailsConfig);

  /**
   * Manejo de los inputs
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Ejecución de la transacción
   */
  const handleSubmit = async () => {
    if (!currentService) {
      toast({
        title: "Servicio no seleccionado",
        description: "Por favor, selecciona un servicio.",
        status: "error",
      });
      return;
    }

    const serviceDef = services.find((s) => s.label === currentService);
    if (!serviceDef) return;

    // Preparar argumentos
    const callArguments = serviceDef.params.map((param) => {
      if (param === "budget") {
        return Number(formData[param]) || 0;
      }
      return String(formData[param] || "");
    });

    toast({
      title: `Ejecutando ${currentService}`,
      description: `Parámetros: ${JSON.stringify(callArguments)}`,
      status: "info",
      duration: 4000,
      isClosable: true,
    });

    if (!sails) {
      alert.error("SailsCalls no está inicializado.");
      return;
    }

    if (!account) {
      alert.error("Cuenta no disponible.");
      return;
    }

    const { signer } = await web3FromSource(account.meta.source);

    try {
      await sails.query(
        `Service/${currentService}`,
        {
          userId: account.decodedAddress,
          
        }
      );
    } catch (e) {
      alert.error("Error al enviar la transacción");
      console.error(e);
    }
  };

  /**
   * Abre el modal de registro
   */
  const openRegisterModal = () => {
    setCurrentService("RegisterUser");
    setFormData({});
    onRegisterOpen();
  };

  /**
   * Abre el modal para subir propuestas
   */
  const openProposalModal = () => {
    setCurrentService("SubmitProposal");
    setFormData({ wallet: account?.decodedAddress || "" });
    onProposalOpen();
  };

  return (
    <Flex minH="100vh" bg="#2f3f3b" color="white">
      {/* SIDEBAR IZQUIERDO */}
      <Box bg="#1A1E1B" w="250px" p={4} display="flex" flexDir="column">
        <Box mb={8}>
          <Heading size="md" mb={2}>
            VaraDAO
          </Heading>
          <Text fontSize="sm" opacity={0.8}>
            Decentralizing Power
          </Text>
        </Box>

        {/* Menú de opciones */}
        <VStack align="stretch" spacing={4}>
          <HStack cursor="pointer">
            <FaHome />
            <Text>Home</Text>
          </HStack>

          <HStack cursor="pointer">
            <FaComments />
            <Text>Discussions</Text>
          </HStack>

          <HStack cursor="pointer">
            <FaGavel />
            <Text>Governanza</Text>
          </HStack>

          <HStack cursor="pointer">
            <FaVoteYea />
            <Text>Voting</Text>
          </HStack>

          <HStack cursor="pointer">
            <FaCoins />
            <Text>Treasury</Text>
          </HStack>
        </VStack>

        <Spacer />

        {/* Ranking de contribuciones */}
        <Box
          bg="#39B88B"
          p={3}
          borderRadius="md"
          textAlign="center"
          color="black"
        >
          <Heading size="xs">RANKING OF CONTRIBUTIONS</Heading>
          <Text fontSize="xs" mt={1}>
            What is contribution ranking?
          </Text>
          <Text fontSize="xs" fontWeight="bold" mt={1} cursor="pointer">
            &gt;&gt;&gt;
          </Text>
        </Box>
      </Box>

      {/* SECCIÓN CENTRAL */}
      <Box flex="1" p={6}>
        {/* Encabezado con botón "About us", etc. */}
        <HStack justifyContent="space-between">
          <Button
            bg="gray.600"
            color="white"
            _hover={{ bg: "gray.500" }}
            onClick={() => alert.info("Información de la DAO")}
          >
            About us
          </Button>

          {/* Botón para abrir modal de registro (ej. Iniciar Session / Registrar) */}
          <HStack spacing={4}>
            <Avatar
              size="sm"
              name="User avatar"
              src="https://bit.ly/broken-link"
            />
            <Button
              size="sm"
              bg="#39B88B"
              color="black"
              onClick={openRegisterModal}
            >
              Register
            </Button>
          </HStack>
        </HStack>

        <Divider my={4} />

        {/* Tarjeta Income & Spending */}
        <Flex bg="gray.800" p={4} borderRadius="md" align="center" mb={4}>
          <Heading size="md" flex="1">
            Income & Spending
          </Heading>
          <HStack spacing={4}>
            <Text color="green.300" fontWeight="bold">
              +$6,000
            </Text>
            <Text color="red.400" fontWeight="bold">
              -$2,000
            </Text>
          </HStack>
          <Button variant="ghost" color="whiteAlpha.700" ml={3}>
            ...
          </Button>
        </Flex>

        {/* MIS PROPUESTAS */}
        <Box bg="gray.800" p={4} borderRadius="md">
          <Heading size="md" mb={4}>
            My proposals
          </Heading>
          {/* Ejemplo de "última propuesta" o alguna data estática */}
          <Box>
            <Proposals/>
          

            <Button
              mt={3}
              size="sm"
              bg="#39B88B"
              color="black"
              _hover={{ bg: "#2f9c77" }}
              onClick={openProposalModal}
              leftIcon={<FaArrowCircleUp />}
            >
              Submit new proposal
            </Button>
          </Box>

          
        </Box>
      </Box>

      {/* SECCIÓN DERECHA (TREASURY, Approved proposals) */}
      <Box w="300px" p={4}>
        {/* Treasury Card */}
        <Box
          bg="#39B88B"
          borderRadius="md"
          p={4}
          mb={4}
          color="black"
          boxShadow="xl"
        >
          <Text fontWeight="bold" fontSize="lg">
            TREASURY
          </Text>
          <Text fontSize="3xl" fontWeight="bold">
            $3,000
          </Text>
          <Text>~$ 102,57 millones</Text>
          <Button variant="link" color="blue.800" mt={2}>
            Details
          </Button>
        </Box>

        {/* Approved proposals */}
        <Box
          bg="gray.800"
          borderRadius="md"
          p={4}
          color="white"
          boxShadow="xl"
        >
          <Heading size="sm" mb={2}>
            Approved proposals
          </Heading>
          <VStack align="start" spacing={2} fontSize="sm">
            <Text>Educación UNI - 14 dic 2024</Text>
            <Text>DeFi - 9 ene 2025</Text>
            <Text>Metaverse - 28 oct 2024</Text>
            <Text>Otro - 13 oct 2024</Text>
            <Text>Otro - 15 sep 2024</Text>
          </VStack>
          <Button variant="ghost" color="whiteAlpha.700" size="xs" mt={2}>
            ...
          </Button>
        </Box>
      </Box>

      {/** =================== MODAL REGISTER USER =================== */}
      <Modal isOpen={isRegisterOpen} onClose={onRegisterClose}>
        <ModalOverlay />
        <ModalContent bg="#2f3f3b" color="white">
          <ModalHeader>
            <HStack>
              <FaUserPlus />
              <Text>Crear cuenta</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Nombre</FormLabel>
              <Input
                placeholder="Ej: Jimena Martinez"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                bg="white"
                color="black"
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Rol</FormLabel>
              <Input
                placeholder="Ej: Dev / MKT / ..."
                name="role"
                value={formData.role || ""}
                onChange={handleInputChange}
                bg="white"
                color="black"
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Género</FormLabel>
              <Select
                placeholder="Seleccione género"
                name="gender"
                value={formData.gender || ""}
                onChange={handleInputChange}
                bg="white"
                color="black"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </Select>
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>País</FormLabel>
              <Select
                placeholder="Seleccione un país"
                name="country"
                value={formData.country || ""}
                onChange={handleInputChange}
                bg="white"
                color="black"
              >
                <option value="Mexico">México</option>
                <option value="Argentina">Argentina</option>
                <option value="Chile">Chile</option>
                <option value="España">España</option>
                <option value="EEUU">EEUU</option>
                <option value="Otro">Otro</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onRegisterClose}>
              Cancelar
            </Button>
            <Button
              bg="#39B88B"
              color="black"
              _hover={{ bg: "#2f9c77" }}
              onClick={handleSubmit}
            >
              Registrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/** =================== MODAL SUBMIT PROPOSAL =================== */}
      <Modal isOpen={isProposalOpen} onClose={onProposalClose}>
        <ModalOverlay />
        <ModalContent bg="#2f3f3b" color="white">
          <ModalHeader>
            <HStack>
              <FaArrowCircleUp />
              <Text>Subir tu propuesta</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Wallet</FormLabel>
              <Input
                name="wallet"
                value={formData.wallet || ""}
                onChange={handleInputChange}
                bg="white"
                color="black"
                readOnly
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Título</FormLabel>
              <Input
                placeholder="Ej: VaraDAO"
                name="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                bg="white"
                color="black"
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Descripción</FormLabel>
              <Input
                placeholder="Breve descripción"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                bg="white"
                color="black"
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Objetivos</FormLabel>
              <Input
                placeholder="Ej: Empoderar a personas..."
                name="objectives"
                value={formData.objectives || ""}
                onChange={handleInputChange}
                bg="white"
                color="black"
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Plan</FormLabel>
              <Input
                placeholder="Estrategia o pasos a seguir"
                name="plan"
                value={formData.plan || ""}
                onChange={handleInputChange}
                bg="white"
                color="black"
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Presupuesto</FormLabel>
              <Input
                placeholder="Ej: 2000"
                name="budget"
                value={formData.budget || ""}
                onChange={handleInputChange}
                bg="white"
                color="black"
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Impacto</FormLabel>
              <Input
                placeholder="Ej: Impacto social, tecnológico..."
                name="impact"
                value={formData.impact || ""}
                onChange={handleInputChange}
                bg="white"
                color="black"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onProposalClose}>
              Cancelar
            </Button>
            <Button
              bg="#39B88B"
              color="black"
              _hover={{ bg: "#2f9c77" }}
              onClick={handleSubmit}
            >
              Subir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );


}

export { SailsComponent };
