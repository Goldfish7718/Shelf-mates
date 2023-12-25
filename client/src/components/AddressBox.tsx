import { Box, Checkbox, Divider, HStack, Heading, Text } from "@chakra-ui/react"
import { IoHomeSharp } from "react-icons/io5";
import { useOrder } from "../context/OrderContext";
import { HiOfficeBuilding } from "react-icons/hi";

export type AddressBoxProps = {
    addressLine1: string;
    landmark: string;
    city: string;
    state: string;
    type: string;
    _id: string;
    toSelect: boolean;
}

const AddressBox = ({ addressLine1, landmark, city, state, _id, type, toSelect }: AddressBoxProps) => {

    const { setAddress, address } = useOrder()

  return (
    <>
        <Box p={5} boxShadow='base' borderRadius={4} h='100%'>
            <HStack w='100%' my={2}>
                {type === 'Home' ? <IoHomeSharp /> : <HiOfficeBuilding />}
                <Heading fontSize='md'>{type}</Heading>
            </HStack>
            <Divider borderColor='gray.200' />
            <Text mt={2}>{addressLine1}</Text>
            <Text>{landmark}</Text>
            <Text>{city}, {state}</Text>

            {toSelect && 
                <Checkbox mt={5} colorScheme="orange" onChange={() => setAddress(_id)} isChecked={_id === address}>
                    Deliver here
                </Checkbox>
            }
        </Box>
    </>
  )
}

export default AddressBox