import { useDisclosure, useToast } from '@chakra-ui/react';
import { createContext, useContext, useRef, useState } from 'react'
import Cart from '../components/Cart';
import axios from 'axios';
import { API_URL } from '../App';
import { useAuth } from './AuthContext';
import { useEffect } from 'react'

type CartContextProps = {
    children: React.ReactNode;
}

type CartItem = {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

type CartContextType = {
    cartItems: CartItem[];
    setCartItems: Function;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    btnRef: React.RefObject<HTMLButtonElement>;
    error: string;
    addToCart: Function;
    decrement: Function;
    deleteProduct: Function;
    productExists: Function;
}

const CartContext = createContext<CartContextType | null>(null)
export const useCart = (): CartContextType => {return useContext(CartContext) as CartContextType}

function CartProvider({ children }: CartContextProps) {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef<HTMLButtonElement | null>(null)
    const { decode, verificationDone } = useAuth()
    
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [error, setError] = useState('')
    const toast = useToast()

    const getCart = async () => {
        try {
            const res = await axios.get(`${API_URL}/cart/getCart/${decode?._id}`)
            setCartItems(res.data.transformedCart)
        } catch (err: any) {
            setError(err.response.data.message)
        }
    }

    const productExists = (productId: string) => {
        const item = cartItems.find(product => product.productId == productId)
        if (item) {
            const result = {
                exists: true,
                item
            }

            return result
        }
        else {
            const result = {
                exists: false,
            }

            return result
        }
    }

    const addToCart = async (productId: string) => {
        try {
            const res = await axios.post(`${API_URL}/cart/add/${decode?._id}/${productId}`)
            
            if (res.data.productExists.quantity == 1) 
            toast({
                    status: 'success',
                    description: res.data.message,
                    duration: 3000
                })
                
            getCart()
        } catch (err: any) {
            setError(err.response.data.message)

            if (error)
                toast({
                    status: 'error',
                    description: error,
                    duration: 3000
                })
        }
    }

    const decrement = async (productId: string) => {
        try {
            const res = await axios.post(`${API_URL}/cart/decrement/${decode?._id}/${productId}`, {
                operation: 'decrement'
            })

            if (res.data.productExists.quantity == 0)
                toast({
                    status: 'success',
                    description: res.data.message,
                    duration: 3000
                })

            getCart()
        } catch (err: any) {
            setError(err.response.data.message)
        }
    }

    const deleteProduct = async (productId: string) => {
        try {
            const res = await axios.post(`${API_URL}/cart/delete/${decode?._id}/${productId}`)
            getCart()

            toast({
                status: 'success',
                description: res.data.message,
                duration: 3000
            })
        } catch (err: any) {
            setError(err.response.data.message)
        }
    }

    const value = {
        cartItems,
        setCartItems,
        isOpen,
        onOpen,
        onClose,
        btnRef,
        error,
        addToCart,
        decrement,
        deleteProduct,
        productExists
    }

    useEffect(() => {
        if (verificationDone) getCart()
    }, [verificationDone, decode])

    return (
        <CartContext.Provider value={value}>
            {children}
            <Cart />
        </CartContext.Provider>
    )
}

export default CartProvider