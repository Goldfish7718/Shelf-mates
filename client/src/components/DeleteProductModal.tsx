import { DeleteIcon } from "@chakra-ui/icons";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Table, TableCaption, TableContainer, Tbody, Th, Thead, Tr, Td, IconButton, Badge, useToast } from "@chakra-ui/react";
import { TransformedProduct } from "../views/Dashboard";
import axios from "axios";
import { API_URL } from "../App";
import { useState } from "react";

interface DeleteProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    products: TransformedProduct[];
    onDelete: () => void;
}

const DeleteProductModal = ({ isOpen, onClose, products, onDelete }: DeleteProductModalProps) => {

    const toast = useToast()

    const [loading, setLoading] = useState(false)
    
    const renderBadge = (category: string) => {
        switch (category) {
            case 'fruits':
                return "blue"

            case 'vegetables':
                return "green"

            case 'spices':
                return "red"

            case 'millets':
                return "purple"
        }
    }

    const requestDelete = async (productId: string) => {
        try {
            setLoading(true)
            const res = await axios.delete(`${API_URL}/products/deleteProduct/${productId}`)
            
            toast({
                title: res.data.message,
                status: 'success',
                duration: 3000
            })

            onDelete()
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
            onClose()
        }
    }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
            <ModalContent>
                <ModalHeader>Delete Product</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <TableContainer overflowY='scroll' h='70%'>
                        <Table variant='simple'>
                            <TableCaption>Please select a product to delete</TableCaption>
                            <Thead>
                                <Tr>
                                    <Th>Product Name</Th>
                                    <Th>Delete:</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {products.map(product => (
                                    <Tr key={product.productId}>
                                        <Td>{product.name} <Badge colorScheme={renderBadge(product.category)}>{product.category}</Badge></Td>
                                        <Td><IconButton isLoading={loading} onClick={() => requestDelete(product.productId)} size='sm' icon={<DeleteIcon />} aria-label="Delete Product" /></Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </ModalBody>
            </ModalContent>
        </ModalOverlay>
    </Modal>
  )
}

export default DeleteProductModal