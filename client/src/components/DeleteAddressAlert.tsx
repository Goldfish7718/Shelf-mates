import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
    Button,
    useToast,
} from '@chakra-ui/react'
import axios from 'axios';
import { useRef } from 'react';
import { API_URL } from '../App';

interface DeleteAddressAlertProps {
    isOpen: boolean;
    onClose: () => void;
    _id: string;
    onAddressChange: () => void;
}

const DeleteAddressAlert = ({ isOpen, onClose, _id, onAddressChange }: DeleteAddressAlertProps) => {

    const cancelRef = useRef<HTMLButtonElement | null>(null)
    const toast = useToast()

    const requestAddressDelete = async () => {
        try {
            const res = await axios.delete(`${API_URL}/address/deleteaddress/${_id}`)
            
            toast({
                title: res.data.message,
                status: 'success',
                duration: 3000
            })

            onClose()
            onAddressChange()
        } catch (err) {
            console.log(err);
        }
    }

  return (
    // @ts-ignore
    <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef} isCentered motionPreset='slideInTop'>
        <AlertDialogOverlay>
            <AlertDialogContent>
                <AlertDialogHeader>Delete Address</AlertDialogHeader>
                <AlertDialogCloseButton />

                <AlertDialogBody>
                    Are you sure you want to delete this address?
                </AlertDialogBody>

                <AlertDialogFooter>
                    <Button mx={1} ref={cancelRef} onClick={onClose}>Cancel</Button>
                    <Button mx={1} colorScheme='red' onClick={requestAddressDelete}>Delete</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default DeleteAddressAlert