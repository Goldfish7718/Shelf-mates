import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, useToast } from "@chakra-ui/react"
import axios from "axios";
import { API_URL } from "../App";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

interface AddressInput {
    isOpen: boolean;
    onClose: () => void;
    onAddressChange: () => void;
    edit: boolean;
    addressLine1: string;
    type: string | "";
    landmark: string;
    city: string;
    state: string;
    _id: string;
}

const AddressInput = ({ isOpen, onClose, edit, addressLine1, type, landmark, city, state, _id, onAddressChange }: AddressInput) => {

    const { decode } = useAuth()
    const toast = useToast()

    const [addressLine1New, setAddressLine1New] = useState("")
    const [typeNew, setTypeNew] = useState("")
    const [landmarkNew, setLandmarkNew] = useState("")
    const [cityNew, setCityNew] = useState("")
    const [stateNew, setStateNew] = useState("")

    const setInputs = () => {
        setAddressLine1New(addressLine1)
        setTypeNew(type)
        setLandmarkNew(landmark)
        setCityNew(city)
        setStateNew(state)
    }

    const requestAddAddress = async () => {
        try {
            await axios.post(`${API_URL}/address/addaddress/${decode?._id}`, {
                addressLine1: addressLine1New,
                type: typeNew,
                landmark: landmarkNew,
                city: cityNew,
                state: stateNew
            })

            toast({
                title: "Address Posted Succesfully",
                status: "success",
                duration: 3000
            })

            onAddressChange()
        } catch (err) {
            toast({
                title: "Sorry an error occured",
                description: "Please try again later",
                status: "error",
                duration: 3000
            })
        } finally {
            onClose()
        }
    }

    const requestUpdateAddress = async () => {
        try {
            await axios.put(`${API_URL}/address/updateaddress`, {
                address: {
                    addressLine1: addressLine1New,
                    type: typeNew,
                    landmark: landmarkNew,
                    city: cityNew,
                    state: stateNew,
                    _id
                }
            })

            toast({
                title: "Address Updated Succesfully",
                status: "success",
                duration: 3000
            })            

            onAddressChange();
        } catch (err) {
            toast({
                title: "Sorry an error occured",
                description: "Please try again later",
                status: "error",
                duration: 3000
            })
        } finally {
            clearAndClose()
        }
    }

    const clearAndClose = () => {
        setAddressLine1New("")
        setTypeNew("")
        setLandmarkNew("")
        setCityNew("")
        setStateNew("")

        onClose()
    }

    const callFunction = () => {
        if (edit) requestUpdateAddress()
        else requestAddAddress()
    }

    useEffect(() => {
        setInputs()
    }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={clearAndClose}>
        <ModalOverlay>
            <ModalContent>
                <ModalHeader>Add/Edit Address</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <FormControl isRequired>
                        <FormLabel>Address Type:</FormLabel>
                        <RadioGroup onChange={e => setTypeNew(e)} value={typeNew}>
                            <Radio mx={2} value="Home">Home</Radio>
                            <Radio mx={2} value="Work">Work</Radio>
                        </RadioGroup>

                        <FormLabel mt={3}>Address:</FormLabel>
                        {/* <Input m={2} placeholder="Address Line 1" value={addressLine1} onChange={e => setAddressLine1New(e.target.value)} />
                        <Input m={2} placeholder="Landmark" value={landmark} onChange={e => setLandmarkNew(e.target.value)} />
                        <Input m={2} placeholder="City" value={city} onChange={e => setCityNew(e.target.value)} />
                        <Input m={2} placeholder="State" value={state} onChange={e => setStateNew(e.target.value)} /> */}

                        <Input m={2} placeholder="Address Line 1" value={addressLine1New} onChange={e => setAddressLine1New(e.target.value)} />
                        <Input m={2} placeholder="Landmark" value={landmarkNew} onChange={e => setLandmarkNew(e.target.value)} />
                        <Input m={2} placeholder="City" value={cityNew} onChange={e => setCityNew(e.target.value)} />
                        <Input m={2} placeholder="State" value={stateNew} onChange={e => setStateNew(e.target.value)} />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button m={2} colorScheme="orange" onClick={callFunction}>Save</Button>
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    </Modal>
  )
}

export default AddressInput