import { Avatar, Flex, Box, Button, FormControl, Input, FormErrorMessage, FormLabel, Text, Divider, Heading, HStack, useDisclosure } from "@chakra-ui/react"
import Navbar from "../components/Navbar"
import { useEffect, useState } from "react";
import { AddressBoxProps } from "../components/AddressBox";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { API_URL } from "../App";
import { FaPlus } from "react-icons/fa6";
import { IoHomeSharp } from "react-icons/io5";
import { HiOfficeBuilding } from "react-icons/hi";
import { MdDelete, MdEdit } from "react-icons/md";
import AddressInput from "../components/AddressInput";

const Profile = () => {

    const { decode } = useAuth()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [fName, setFName] = useState(decode?.fName)
    const [lName, setLName] = useState(decode?.lName)
    const [username, setUsername] = useState(decode?.username)
    const [addresses, setAddresses] = useState<AddressBoxProps[]>([])
    const [addressEditable, setAddressEditable] = useState({} as any)
    const [edit, setEdit] = useState(false)

    const error = !fName || !lName

    const fetchAddresses = async () => {
        try {
            const res = await axios.get(`${API_URL}/address/getaddresses/${decode?._id}`) 
            setAddresses(res.data.addresses)   
        } catch (err) {
            console.log(err);
        }
    }

    const handleClick = (toedit: boolean, _id?: string) => {
        setEdit(toedit)

        if (toedit) {
            const address = addresses.find(address => address._id === _id)

            setAddressEditable({
                addressLine1: address?.addressLine1,
                type: address?.type,
                landmark: address?.landmark,
                city: address?.city,
                state: address?.state,
                _id: address?._id
            })

        } else {
            setAddressEditable({
                addressLine1: "",
                type: "",
                landmark: "",
                city: "",
                state: "",
                _id: ""
            })
        }

        onOpen()
    }

    useEffect(() => {
        fetchAddresses()
    }, [])

  return (
    <>
        <Navbar />
        <Flex w={{ base: '90%', md: '70%' }} p={{ base: 5, md: 10 }} justifyContent='center' direction='column' mx='auto'>
            <Avatar size='xl' name={`${fName} ${lName}`} mx={4} />
            <FormControl isRequired isInvalid={error} mt={3}>
                <FormLabel>First Name:</FormLabel>
                <Input my={1} placeholder="First Name:" value={fName} onChange={e => setFName(e.target.value)} />

                <FormLabel>Last Name:</FormLabel>
                <Input my={1} placeholder="Last Name:" value={lName} onChange={e => setLName(e.target.value)} />

                <FormLabel>Username:</FormLabel>
                <Input my={1} placeholder="Username:" value={username} onChange={e => setUsername(e.target.value)} />

                {error &&
                    <FormErrorMessage>All Fields are required</FormErrorMessage>
                }
            </FormControl>
            <Text fontSize='2xl' fontWeight='bold' my={2}>
                Addresses:
            </Text>
            {addresses.map(address => (
                <Box my={2} key={address._id}>
                    <Box p={5} boxShadow='base' borderRadius={4} h='100%' w='100%'>
                        <HStack w='100%' my={2}>
                            {address.type === 'Home' ? <IoHomeSharp /> : <HiOfficeBuilding />}
                            <Heading fontSize='md'>{address.type}</Heading>
                        </HStack>
                        <Divider borderColor='gray.200' />
                        <Text mt={2}>{address.addressLine1}</Text>
                        <Text>{address.landmark}</Text>
                        <Text>{address.city}, {address.state}</Text>
                        <HStack mt={4}>
                            <Button onClick={() => handleClick(true, address._id)}><MdEdit /></Button>
                            <Button colorScheme="orange"><MdDelete /></Button>
                        </HStack>
                    </Box>
                </Box>
            ))}
            <Button my={2} onClick={() => handleClick(false)}><FaPlus style={{ marginRight: '8px' }} />Add Address</Button>
            <Button my={2} colorScheme="orange">Save Changes</Button>
            <AddressInput isOpen={isOpen} onClose={onClose} edit={edit} {...addressEditable} />
        </Flex>
    </>
  )
}

export default Profile