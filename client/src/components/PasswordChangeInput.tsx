import { Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { API_URL } from "../App";
import { useAuth } from "../context/AuthContext";

interface PasswordChangeInputProps {
    isOpen: boolean;
    onClose: () => void;
}

const PasswordChangeInput = ({ isOpen, onClose }: PasswordChangeInputProps) => {

    const { decode } = useAuth()
    const toast = useToast()

    const [securityPassword, setSecurityPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [hasInteracted, setHasInteracted] = useState(false)
    const [loading, setLoading] = useState(false)

    const error = hasInteracted && (!securityPassword && !newPassword)
    const buttonDisabled = !securityPassword || !newPassword

    const handleOldPassWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSecurityPassword(e.target.value)
        setHasInteracted(true)
    }

    const handleNewPassWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value)
        setHasInteracted(true)
    }

    const requestPasswordChange = async () => {
        try {
            setLoading(true)
            const res = await axios.patch(`${API_URL}/auth/updatepassword/${decode?._id}`, {
                securityPassword,
                newPassword
            })          
            
            toast({
                title: res.data.message,
                description: 'Use this password to login the next time',
                status: 'success',
                duration: 3000
            })

            onClose()
        } catch (err: any) {
            setSecurityPassword('')
            setNewPassword('')

            toast({
                title: err.response.data.message,
                description: 'Please try again',
                status: 'error',
                duration: 3000
            })
        } finally {
            setLoading(false)
        }
    }

  return (
    <>
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay>
                <ModalContent>
                    <ModalHeader>Change Password</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <FormControl isRequired isInvalid={error}>
                            <FormLabel m={2}>Old Password:</FormLabel>
                            <Input onChange={handleOldPassWordChange} value={securityPassword} />
                            <FormHelperText>This will help us verify it's you</FormHelperText>

                            <FormLabel m={2}>New Password:</FormLabel>
                            <Input onChange={handleNewPassWordChange} value={newPassword} />

                            {error &&
                                <FormErrorMessage>Please fill these fields</FormErrorMessage>
                            }
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button isDisabled={buttonDisabled} onClick={requestPasswordChange} isLoading={loading} colorScheme="red">Change Password</Button>
                    </ModalFooter>
                </ModalContent>
            </ModalOverlay>
        </Modal>
    </>
  )
}

export default PasswordChangeInput