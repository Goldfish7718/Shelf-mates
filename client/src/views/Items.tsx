import { SimpleGrid } from "@chakra-ui/react"
import { useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import ItemCard from "../components/ItemCard"
import { API_URL } from "../App"
import axios from "axios"
import { useState, useEffect } from 'react'
import Loading from "../components/Loading"
import ErrorComponent from "../components/ErrorComponent"
import { ProductProps } from "./Product"

export type ItemData = {
    name: string;
    description: string;
    price: number;
    stock: number;
    stars: number;
    image: string;
    _id: string;
    category: string;
}

function Items () {

    const { category } = useParams()
    
    const [data, setData] = useState<ProductProps[]>([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)


    const fetchProducts = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${API_URL}/products/getByCat/${category}`)

            if (res.data.transformedProducts.length == 0) throw new Error

            setData(res.data.transformedProducts)
        } catch (err) {
            setError('An error occured while loading. Please try again later.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts();
    }, [])

    return (
        <>
            <Navbar />
            {loading &&
                <Loading />
            }
            {error && 
                <ErrorComponent error={error} />
            }
            {!error &&
                <SimpleGrid m={{ base: 3, md: 7, lg: 10 }} columns={{ base: 2, md: 3, lg: 4 }} spacing={{ base: 4, md: 6 }}>
                    {data.map(product => (
                            <ItemCard {...product} />
                        ))
                    }
                </SimpleGrid>
            }
        </>
    )
}

export default Items