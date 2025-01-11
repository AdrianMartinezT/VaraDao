import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Image,
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
} from "@chakra-ui/react";
import { FaUserPlus, FaArrowCircleUp } from "react-icons/fa";
import { useAccount, useAlert } from "@gear-js/react-hooks";
import { useSailsCalls } from "@/app/hooks";
import { web3FromSource } from "@polkadot/extension-dapp";
import { CONTRACT_DATA } from "@/app/consts";
import { useSailsConfig } from "@/app/hooks/useSailsConfig";

/**
 * Servicios que utilizaremos.
 * Cada objeto indica el "label" del servicio y los parámetros que va a requerir.
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

function Landing() {
  const toast = useToast();

  // Para controlar los formularios en Modal:
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

  // Guarda el tipo de servicio que se está llamando (RegisterUser o SubmitProposal)
  const [currentService, setCurrentService] = useState("");
  // Guarda los valores de los campos del formulario
  const [formData, setFormData] = useState({});

  // Estado para mostrar información de la llamada
  const [blockhash, setBlockhash] = useState("");

  // Hooks para la cuenta de Polkadot.js y para “Sails”
  const { account } = useAccount();
  const sails = useSailsCalls();
  const alert = useAlert();

  // Configuración del contrato
  const sailsConfig = {
    network: "wss://testnet.vara.network",
    contractId: CONTRACT_DATA.programId,
    idl: CONTRACT_DATA.idl,
  };
  useSailsConfig(sailsConfig);

  /**
   * Maneja cambios en los inputs de los formularios
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Envía la transacción al contrato usando sails.command()
   */
  const handleSubmit = async () => {
    if (!currentService) {
      toast({
        title: "Servicio no seleccionado.",
        description: "Por favor, selecciona un servicio.",
        status: "error",
      });
      return;
    }

    // Filtra el servicio actual y obtiene los parámetros que requiere
    const serviceDef = services.find((s) => s.label === currentService);
    if (!serviceDef) return;

    // Preparamos los argumentos del call basándonos en la definición
    const callArguments = serviceDef.params.map((param) => {
      // Para el campo 'budget', convertimos a número
      if (param === "budget") {
        return Number(formData[param]) || 0;
      }
      // En caso contrario lo devolvemos como string
      return String(formData[param] || "");
    });

    // Mostramos un toast con info
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
      await sails.command(
        `Service/${currentService}`,
        {
          userAddress: account.decodedAddress,
          signer,
        },
        {
          callArguments,
          callbacks: {
            onBlock: (blockHash) => {
              setBlockhash(blockHash);
            },
            onSuccess: () => {
              toast({
                title: "Operación exitosa",
                status: "success",
                duration: 4000,
                isClosable: true,
              });
              // Cierra el modal correspondiente
              currentService === "RegisterUser"
                ? onRegisterClose()
                : onProposalClose();
              // Limpia el formulario
              setFormData({});
            },
            onError: () => {
              alert.error("Ocurrió un error en la transacción.");
            },
          },
        }
      );
    } catch (e) {
      alert.error("Error al enviar la transacción");
      console.error(e);
    }
  };

  /**
   * Abre el modal de "Crear cuenta"
   */
  const openRegisterModal = () => {
    setCurrentService("RegisterUser");
    setFormData({});
    onRegisterOpen();
  };

  /**
   * Abre el modal de "Subir propuesta"
   */
  const openProposalModal = () => {
    setCurrentService("SubmitProposal");
    // El campo "wallet" podría ser la dirección actual, si lo deseas
    setFormData({ wallet: account?.decodedAddress || "" });
    onProposalOpen();
  };

  return (
    <Box bgGradient="linear(to-b, #1c3b5f, #2a3f3b)" minH="100vh">
      {/** Barra de navegación superior */}
      <Flex
        as="nav"
        bg="rgba(0,0,0,0.2)"
        py={4}
        px={8}
        justify="space-between"
        align="center"
      >
        <HStack spacing={8}>
          <Image
            src="https://www.sanidadexpress.com/v2.png"
            alt="VaraDAO logo"
            boxSize="40px"
            objectFit="cover"
          />
          <Heading size="lg" color="white">
            VaraDAO
          </Heading>
        </HStack>
        <HStack spacing={6} color="gray.100">
          <Text cursor="pointer">HOME</Text>
          <Text cursor="pointer">ABOUT</Text>
          <Text cursor="pointer"><b style={{color: "#f7a800"}}>100 gVARA</b></Text>
          <Button
            color="white"
            bg="green.400"
            _hover={{ bg: "green.300" }}
            onClick={openRegisterModal}
          >
            Register
          </Button>
        </HStack>
      </Flex>

      {/** Sección principal (hero) */}
      <VStack spacing={6} py={10} px={8} textAlign="center">
        <Heading size="2xl" color="white">
          Decentralizing Power, Empowering Communities
        </Heading>
        <Text color="white" maxW="600px">
        Welcome to the community management and proposal platform. Explore, register your account and submit your ideas to drive technological change.
        </Text>

        {/** Aquí podrías colocar imágenes alusivas a "Proposals" y "Leaders" */}
        <HStack spacing={6} mt={8}>
          <Box
            w="200px"
            h="250px"
            bg="white"
            borderRadius="md"
            boxShadow="lg"
            overflow="hidden"
            textAlign="center"
            cursor="pointer"
            onClick={openProposalModal}
          >
            <Image
              src="https://www.sanidadexpress.com/img1.jpeg"
              alt="Proposals"
              objectFit="cover"
              w="100%"
              h="70%"
            />
            <Text fontWeight="bold" p={2}>
              PROPOSALS
            </Text>
          </Box>
          <Box
            w="200px"
            h="250px"
            bg="white"
            borderRadius="md"
            boxShadow="lg"
            overflow="hidden"
            textAlign="center"
            cursor="pointer"
            onClick={openProposalModal}
          >
            <Image
              src="https://www.sanidadexpress.com/img1.jpeg"
              alt="Proposals"
              objectFit="cover"
              w="100%"
              h="70%"
            />
            <Text fontWeight="bold" p={2}>
              MY PROPOSALS
            </Text>
          </Box>
          <Box
            w="200px"
            h="250px"
            bg="white"
            borderRadius="md"
            boxShadow="lg"
            overflow="hidden"
            textAlign="center"
          >
            <Image
              src="https://www.sanidadexpress.com/img2.jpeg"
              alt="Leaders"
              objectFit="cover"
              w="100%"
              h="70%"
            />
            <Text fontWeight="bold" p={2}>
              LEADERS
            </Text>
          </Box>
          
        </HStack>
      </VStack>

      {/**
       * ======================================
       * MODAL para "RegisterUser"
       * ======================================
       */}
      <Modal isOpen={isRegisterOpen} onClose={onRegisterClose}>
        <ModalOverlay />
        <ModalContent>
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
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Rol</FormLabel>
              <Input
                placeholder="Ej: Dev / MKT / Proj Manager / ..."
                name="role"
                value={formData.role || ""}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Género</FormLabel>
              <Select
                placeholder="Seleccione género"
                name="gender"
                value={formData.gender || ""}
                onChange={handleInputChange}
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
            <Button variant="ghost" mr={3} onClick={onRegisterClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="teal"
              onClick={handleSubmit}
            >
              Registrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/**
       * ======================================
       * MODAL para "SubmitProposal"
       * ======================================
       */}
      <Modal isOpen={isProposalOpen} onClose={onProposalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <FaArrowCircleUp />
              <Text>Subir tu propuesta</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/** Si deseas que el usuario ingrese la wallet manual, quita el "readOnly" */}
            <FormControl mb={3}>
              <FormLabel>Wallet</FormLabel>
              <Input
                name="wallet"
                value={formData.wallet || ""}
                onChange={handleInputChange}
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
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Descripción</FormLabel>
              <Input
                placeholder="Descripción corta de la propuesta"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Objetivos</FormLabel>
              <Input
                placeholder="Ej: Empoderar a personas..."
                name="objectives"
                value={formData.objectives || ""}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Plan</FormLabel>
              <Input
                placeholder="Estrategia o pasos a seguir"
                name="plan"
                value={formData.plan || ""}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Presupuesto</FormLabel>
              <Input
                placeholder="Ej: 2000"
                name="budget"
                value={formData.budget || ""}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Impacto</FormLabel>
              <Input
                placeholder="Ej: Impacto social, tecnológico..."
                name="impact"
                value={formData.impact || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onProposalClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="teal"
              onClick={handleSubmit}
            >
              Subir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export { Landing };
