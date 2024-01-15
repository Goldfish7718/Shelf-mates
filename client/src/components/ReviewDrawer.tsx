import { Avatar, Button, Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, HStack, Text, VStack, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../App";
import { AiFillStar } from "react-icons/ai";
import { AddIcon } from "@chakra-ui/icons";

interface ReviewDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    _id: string;
}

interface Review {
    fName?: string,
    lName?: string,
    stars?: number,
    review?: string,
    userId?: string,
    _id: string;
}

const ReviewDrawer = ({ isOpen, onClose, _id }: ReviewDrawerProps) => {

    const [reviews, setReviews] = useState<Review[]>([])
    const [skip, setSkip] = useState(0)
    const [loading, setLoading] = useState(false)
    const [end, setEnd] = useState(false)

    const limit = 6
    const toast = useToast()

    const requestReviews = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${API_URL}/review/${_id}?limit=${limit}&skip=${skip}`)            
            const newReviews = res.data.transformedReviews

            setReviews(prevReviews => [...prevReviews, ...newReviews])
            setSkip(prevSkip => prevSkip + limit)
            setEnd(res.data.end)
        } catch (err) {
            toast({
                title: "An Error Occured",
                status: 'error',
                duration: 3000
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isOpen)
            requestReviews()
    }, [isOpen])


  return (
    <>
        <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement="right"    
        size='sm'
        >
            <DrawerOverlay>
                <DrawerContent>
                    <DrawerHeader>Product Reviews</DrawerHeader>
                    <DrawerCloseButton />

                    <DrawerBody>
                        {reviews.length > 0 && reviews.map((review, index) => (
                            <VStack key={index} p={3} boxShadow='md' borderRadius='md' alignItems='flex-start'>
                            <HStack>
                                <Avatar size='sm' name={`${review?.fName} ${review?.lName}`} />
                                <Text color='gray.600'>{review?.fName} {review?.lName}</Text>
                            </HStack>
                            <HStack spacing='none'>
                                {Array.from({ length: review?.stars || 1 }).map((_, index) => (
                                        <AiFillStar key={index} size={15} />
                                    ))
                                }
                                <Text fontSize='xs'>  | {review?.stars} stars</Text>
                            </HStack>
                            <Text fontSize='medium'>{review?.review}</Text>
                        </VStack>
                        ))

                        }
                        {!end && <Button isLoading={loading} m={2} my={4} w='full' size='lg' onClick={requestReviews} variant="outline" colorScheme="orange"><AddIcon /></Button>}
                        {end && 
                        <VStack textAlign='center'>
                            <Divider my={2} />
                            <Text fontSize='large'>End of results</Text>
                        </VStack>
                        }
                    </DrawerBody>
                </DrawerContent>
            </DrawerOverlay>
        </Drawer>
    </>
  )
}

export default ReviewDrawer