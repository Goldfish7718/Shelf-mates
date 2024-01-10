import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useToast } from "@chakra-ui/react"
import axios from "axios";
import { useRef, useState } from "react"
import { API_URL } from "../App";

interface DeleteReviewAlertProps {
    isOpen: boolean;
    onClose: () => void;
    _id: string;
    onReviewChange: () => void;
}

const DeleteReviewAlert = ({ isOpen, onClose, _id, onReviewChange }: DeleteReviewAlertProps) => {

    const cancelRef = useRef<HTMLButtonElement | null>(null)
    const toast = useToast()

    const [loading, setLoading] = useState(false)

    const requestReviewDeletion = async () => {
        try {
            setLoading(true)
            const res = await axios.delete(`${API_URL}/review/delete/${_id}`)

            toast({
                title: res.data.message,
                status: 'success',
                duration: 3000
            })
            
            onReviewChange()
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
            onClose()
        }
    }

  return (
    // @ts-ignore
    <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef} isCentered motionPreset='slideInTop'>
        <AlertDialogOverlay>
            <AlertDialogContent>
                <AlertDialogHeader>Delete Review</AlertDialogHeader>
                <AlertDialogCloseButton />

                <AlertDialogBody>
                    Are you sure you want to delete this review?
                </AlertDialogBody>

                <AlertDialogFooter>
                    <Button mx={1} ref={cancelRef} onClick={onClose}>Cancel</Button>
                    <Button mx={1} colorScheme='red' onClick={requestReviewDeletion} isLoading={loading}>Delete</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default DeleteReviewAlert