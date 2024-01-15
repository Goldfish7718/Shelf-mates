import { Box, Button, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Textarea, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { API_URL } from "../App";

interface ProductInputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: () => void;
}

const ProductInputModal = ({ isOpen, onClose, onAdd }: ProductInputModalProps) => {

    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [stock, setStock] = useState('')
    const [category, setCategory] = useState('')
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)

    const toast = useToast()

    const error = !name || !price || !description || !stock || !category || !image

    const requestAddProduct = async () => {
        try {
            setLoading(true)

            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price);
            formData.append('description', description);
            formData.append('stock', stock);
            formData.append('category', category);
            formData.append('image', image!); 

            await axios.post(`${API_URL}/products/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast({
                title: `${name} successfully added`,
                status: 'success',
                duration: 3000
            })

            onAdd()
        } catch (err: any) {
            toast({
                title: err.response.data.message,
                status: 'error',
                duration: 3000
            })
        } finally {
            setLoading(false)
            onClose()
        }
    }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay>
            <ModalContent>
                <ModalHeader>Add Product</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <FormControl isRequired>
                        <Flex>
                            <Box m={2}>
                                <FormLabel>Product Name:</FormLabel>
                                <Input onChange={e => setName(e.target.value)} />
                            </Box>
                            <Box m={2}>
                                <FormLabel>Product Price:</FormLabel>
                                <Input type="number" onChange={e => setPrice(e.target.value)} />
                            </Box>
                        </Flex>
                        <FormLabel>Description:</FormLabel>
                        <Textarea resize='vertical' onChange={e => setDescription(e.target.value)} />

                        <FormLabel mt={2}>Stock:</FormLabel>
                        <Input type="number" onChange={e => setStock(e.target.value)} />

                        <FormLabel mt={4}>Product Category:</FormLabel>
                        <Select placeholder="Category" onChange={e => setCategory(e.target.value)}>
                            <option value='fruits'>Fruits</option>
                            <option value='vegetables'>Vegetables</option>
                            <option value='spices'>Spices</option>
                            <option value='millets'>Millets</option>
                        </Select>

                        <FormLabel mt={4}>Product Image</FormLabel>
                        {/* @ts-ignore */}
                        <Input type="file" multiple={false} onChange={e => setImage(e.target.files[0])} />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button isLoading={loading} colorScheme="orange" w='full' isDisabled={error} onClick={requestAddProduct}>Add Product</Button>
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    </Modal>
  )
}

export default ProductInputModal