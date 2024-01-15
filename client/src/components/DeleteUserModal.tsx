import { WarningTwoIcon } from "@chakra-ui/icons";
import { Alert, AlertDescription, AlertIcon, AlertTitle, Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, List, ListIcon, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { API_URL } from "../App";

interface DeleteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DeleteUserModal = ({ isOpen, onClose }: DeleteUserModalProps) => {

    const [securityPassword, setSecurityPassword] = useState('')
    const [hasIntercated, sethasIntercated] = useState(false)
    const [loading, setLoading] = useState(false)

    const { decode, requestLogout } = useAuth()
    const toast = useToast()

    const error = hasIntercated && !securityPassword

    const handlePassWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSecurityPassword(e.target.value)
        sethasIntercated(true)
    }

    const requestAccountDeletion = async () => {
        try {
            setLoading(true)
            const res = await axios.delete(`${API_URL}/auth/delete/${decode?._id}`, {
                data: {
                    securityPassword
                }
            })            

            toast({
                title: res.data.message,
                description: 'Sorry to see you go!',
                status: 'success',
                duration: 3000
            })

            requestLogout()
        } catch (err: any) {
            toast({
                title: err.response.data.message,
                description: 'Please try again',
                status: 'error',
                duration: 3000
            })

            setSecurityPassword('')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'lg', md: '2xl' }}>
                <ModalOverlay>
                    <ModalContent>
                        <ModalHeader>Permanently Delete Account</ModalHeader>
                        <ModalCloseButton />

                        <ModalBody>
                            <Alert status='warning' variant='top-accent' borderRadius='15px'>
                                <AlertIcon />
                                <AlertTitle>Permanent Account Deletion</AlertTitle>
                                <AlertDescription>You are about to permanently delete your account. Once deleted, your account cannot be recovered. Please proceed with caution.</AlertDescription>
                            </Alert>

                            <Text mt={5} fontSize='xl' fontWeight='medium' color='gray.600'>We will delete the following information from our servers:</Text>
                            <List m={3}>
                                <ListItem fontSize='md' m={1}>
                                    <ListIcon as={WarningTwoIcon} color='red.500' fontSize='md' />
                                    All account information including, passwords and username
                                </ListItem>
                                <ListItem fontSize='md' m={1}>
                                    <ListIcon as={WarningTwoIcon} color='red.500' fontSize='md' />
                                    All cart and cart items
                                </ListItem>
                                <ListItem fontSize='md' m={1}> 
                                    <ListIcon as={WarningTwoIcon} color='red.500' fontSize='md' />
                                    All reviews
                                </ListItem>
                                <ListItem fontSize='md' m={1}>
                                    <ListIcon as={WarningTwoIcon} color='red.500' fontSize='md' />
                                    All previous orders and order history
                                </ListItem>
                                <ListItem fontSize='md' m={1}>
                                    <ListIcon as={WarningTwoIcon} color='red.500' fontSize='md' />
                                    All saved addresses
                                </ListItem>
                                <ListItem fontSize='md' m={1}>
                                    <ListIcon as={WarningTwoIcon} color='red.500' fontSize='md' />
                                    All payment information
                                </ListItem>
                            </List>

                            <FormControl m={1} isRequired isInvalid={error}>
                                <FormLabel m={2}>Old Password:</FormLabel>
                                <Input onChange={handlePassWordChange} value={securityPassword} />
                                <FormHelperText>This will help us verify it's you</FormHelperText>

                                {error &&
                                    <FormErrorMessage>Please fill this field</FormErrorMessage>
                                }
                            </FormControl>

                            <Alert status='error' variant='subtle' borderRadius='15px' my={4}>
                                <AlertIcon />
                                <AlertTitle textAlign='center'>This action once done cannot be undone</AlertTitle>
                            </Alert>
                            <Button w='full' colorScheme="red" isDisabled={!hasIntercated || !securityPassword} isLoading={loading} onClick={requestAccountDeletion}>Delete My Account</Button>
                        </ModalBody>
                    </ModalContent>
                </ModalOverlay>
            </Modal>
        </>
    )
}

export default DeleteUserModal