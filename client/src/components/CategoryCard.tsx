import { Button, ButtonGroup, Card, CardBody, CardHeader, Divider, Heading, Image, Stack, Text } from "@chakra-ui/react";

type CardProps = {
    title: string;
    image: string;
    description: string;
    key: number;
}

function CategoryCard ({ title, image, description }: CardProps) {
    return (
        <Card>
            <CardHeader backgroundColor="orange.400">
                <Heading color="white">{title}</Heading>
            </CardHeader>
            <Divider borderColor='gray.400' />
            <CardBody>
                <Stack spacing={4}>
                    <Image src={image} w='100%' h='300px' objectFit='cover' width="100%" />
                    <Text>{description}</Text>
                    <Divider borderColor='gray.300' />
                    <ButtonGroup>
                        <Button colorScheme="orange" onClick={() => window.location.href = `/categories/${title.toLowerCase()}`}>Explore</Button>
                        <Button colorScheme="orange" variant='ghost'>Learn More</Button>
                    </ButtonGroup>
                </Stack>
            </CardBody>
        </Card>
    )
}

export default CategoryCard