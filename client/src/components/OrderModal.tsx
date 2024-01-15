import { Box, Divider, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spacer, Text, useToast } from "@chakra-ui/react";
import AddressBox, { AddressBoxProps } from "./AddressBox";
import { useEffect, useState } from "react";
import { Order } from "../views/Dashboard";
import axios from "axios";
import { API_URL } from "../App";

export interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
}

const OrderModal = ({ orderId, isOpen, onClose }: OrderModalProps) => {

    const [order, setOrder] = useState<Order | null>(null)
    const toast = useToast()

    const requestOrder = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/data/order/${orderId}`)
            setOrder(res.data.orderObject)            
        } catch (err) {
            toast({
                title: 'An Error Occured',
                description: 'Please Try again Later',
                status: 'error',
                duration: 3000,
            })
        }
    }

    useEffect(() => {
        if (isOpen)
            requestOrder()
    }, [orderId, isOpen])

  return (
    <>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay>
                <ModalContent>
                    <ModalHeader>
                        Order #{orderId}
                        <Text fontWeight='light'>{order?.date}</Text>
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <Text fontSize='2xl' fontWeight='bold'>To: {order?.fName} {order?.lName}</Text>
                        <HStack mb={2}>
                            <Text fontSize='lg' fontWeight='light'>@{order?.username}</Text>
                            <Spacer />
                            <Text fontSize='lg' fontWeight='light'>#{order?.userId}</Text>
                        </HStack>
                        <AddressBox {...order?.address as AddressBoxProps} toSelect={false} />

                        <Box m={3} p={2}>
                            <Text fontSize='xl' fontWeight='bold'>Order Breakdown:</Text>
                            {order?.items.map(item => (
                                <HStack>
                                    <Text>{item.name} x{item.quantity}</Text>
                                    <Spacer />
                                    <Text>&#8377;{item.totalPrice}</Text>
                                </HStack>
                            ))}
                            <Divider my={2} borderColor='gray.300' />
                            <HStack>
                                <Text fontSize='xl' fontWeight='bold'>Subtotal:</Text>
                                <Spacer />
                                <Text>&#8377;{order?.subtotal}</Text>
                            </HStack>
                        </Box>
                        <Box p={3} m={3} boxShadow='md'>
                            <HStack>
                                <Text fontWeight='bold' fontSize='large'>Payment Method:</Text>
                                <Spacer />
                                <Text fontWeight='medium' fontSize='large'>{order?.paymentMethod}</Text>
                            </HStack>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </ModalOverlay>
        </Modal>
    </>
  )
}

export default OrderModal