import { DeleteIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Table, TableCaption, TableContainer, Tbody, Th, Thead, Tr, Td, IconButton, Badge, useToast } from "@chakra-ui/react";
import { TransformedProduct } from "../views/Dashboard";
import axios from "axios";
import { API_URL } from "../App";
import { useState } from "react";

interface ProductTableModalProps {
    isOpen: boolean;
    onClose: () => void;
    products: TransformedProduct[];
    onDelete: () => void;
    operation: string;
}

const ProductTableModal = ({ isOpen, onClose, products, onDelete, operation }: ProductTableModalProps) => {

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
            
            toast({
                title: 'An Error Occured',
                description: 'Please try again later',
                status: 'error',
                duration: 3000
            })

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
                        <Table variant='simple' size='sm'>
                            <TableCaption>Please select a product to delete</TableCaption>
                            <Thead>
                                <Tr>
                                    <Th>Product Name</Th>
                                    {operation === 'delete' && <Th>Delete:</Th>}
                                    {operation === 'stats' && <Th>Statistics:</Th>}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {products.map(product => (
                                    <Tr key={product.productId}>
                                        <Td>{product.name} <Badge colorScheme={renderBadge(product.category)}>{product.category}</Badge></Td>
                                        {operation === 'delete' ? <Td><IconButton isLoading={loading} onClick={() => requestDelete(product.productId)} size='sm' icon={<DeleteIcon />} aria-label="Delete Product" /></Td> : null}
                                        {operation === 'stats' ? <Td><IconButton icon={<ExternalLinkIcon />} aria-label="Statistic" onClick={() => window.location.href = `/statistics/${product.productId}`} /></Td>: null}
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

export default ProductTableModal