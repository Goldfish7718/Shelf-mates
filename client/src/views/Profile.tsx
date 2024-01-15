import { Avatar, Flex, Box, Button, FormControl, Input, FormErrorMessage, FormLabel, Text, Divider, Heading, HStack, useDisclosure, useToast, Tooltip } from "@chakra-ui/react"
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
import DeleteAddressAlert from "../components/DeleteAddressAlert";
import PasswordChangeInput from "../components/PasswordChangeInput";
import DeleteUserModal from "../components/DeleteUserModal";

const Profile = () => {

    const { decode, requestVerification } = useAuth()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    const {
        isOpen: isOpenDeleteAlert,
        onOpen: onOpenDeleteAlert,
        onClose: onCloseDeleteAlert
    } = useDisclosure()

    const {
        isOpen: isOpenPasswordChange,
        onOpen: onOpenPasswordChange,
        onClose: onClosePasswordChange
    } = useDisclosure()

    const {
        isOpen: isOpenAccountDelete,
        onOpen: onOpenAccountDelete,
        onClose: onCloseAccountDelete
    } = useDisclosure()

    const [fName, setFName] = useState(decode?.fName)
    const [lName, setLName] = useState(decode?.lName)
    const [username, setUsername] = useState(decode?.username)
    const [addresses, setAddresses] = useState<AddressBoxProps[]>([])
    const [addressEditable, setAddressEditable] = useState({} as any)
    const [idToBeDeleted, setIdToBeDeleted] = useState('')
    const [edit, setEdit] = useState(false)
    const [loading, setLoading] = useState(false)

    const error = !fName || !lName

    const fetchAddresses = async () => {
        try {
            const res = await axios.get(`${API_URL}/address/getaddresses/${decode?._id}`) 
            setAddresses(res.data.addresses)   
        } catch (err: any) {
            toast({
                title: err.response.data.message,
                status: 'error',
                duration: 3000
            })
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

    const requestUserUpdate = async () => {
        try {
            setLoading(true)
            const res = await axios.put(`${API_URL}/auth/update/${decode?._id}`, {
                newUser: {
                    fName,
                    lName,
                    username
                }
            })
            
            toast({
                title: res.data.message,
                status: 'success',
                duration: 3000
            })

            requestVerification()
        } catch (err: any) {
            toast({
                title: err.response.data.message,
                status: 'error',
                description: "Please Select another username",
                duration: 3000
            })

            setUsername(decode?.username)
        } finally {
            setLoading(false)
        }
    }

    const deleteClick = (_id: string) => {
        setIdToBeDeleted(_id)
        onOpenDeleteAlert()
    }

    const onAddressChange = () => {
        fetchAddresses();
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
            {addresses.length > 0 && addresses.map(address => (
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
                            <Button colorScheme="orange" onClick={() => deleteClick(address._id)}><MdDelete /></Button>
                        </HStack>
                    </Box>
                </Box>
            ))}
            {addresses.length === 0 && <Text fontSize='lg' fontWeight='md' color='gray.700'>No Address added</Text>}
            <Text mt={3} fontSize='2xl' fontWeight='medium' color='red'>Danger Zone:</Text>
            <Flex m={3} border='1px solid red' borderRadius='25px' p={5} direction='column' alignItems={{ base: 'center', md: 'flex-start' }}>
                <Button colorScheme='red' m={2} w={{ base: '100%', md: 'auto' }} onClick={onOpenPasswordChange}>Change Password</Button>
                <Button colorScheme='red' m={2} w={{ base: '100%', md: 'auto' }} onClick={onOpenAccountDelete}>Delete Account</Button>
            </Flex>

            <Tooltip label="You can add up to 5 addresses" hasArrow>
                <Button my={2} onClick={() => handleClick(false)}><FaPlus style={{ marginRight: '8px' }} />Add Address</Button>
            </Tooltip>
            <Button my={2} colorScheme="orange" onClick={() => requestUserUpdate()} isLoading={loading}>Save Changes</Button>

            <AddressInput isOpen={isOpen} onClose={onClose} edit={edit} {...addressEditable} onAddressChange={onAddressChange} />
            <DeleteAddressAlert isOpen={isOpenDeleteAlert} onClose={onCloseDeleteAlert} _id={idToBeDeleted} onAddressChange={onAddressChange} />
            <PasswordChangeInput isOpen={isOpenPasswordChange} onClose={onClosePasswordChange} />
            <DeleteUserModal isOpen={isOpenAccountDelete} onClose={onCloseAccountDelete} />
        </Flex>
    </>
  )
}

export default Profile