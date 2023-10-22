import { useDisclosure } from '@chakra-ui/react';
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
}

const CartContext = createContext<CartContextType | null>(null)
export const useCart = (): CartContextType => {return useContext(CartContext) as CartContextType}

function CartProvider({ children }: CartContextProps) {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef<HTMLButtonElement | null>(null)
    const { decode, verificationDone } = useAuth()
    
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [error, setError] = useState('')

    const getCart = async () => {
        try {
            const res = await axios.get(`${API_URL}/cart/getCart/${decode?._id}`)
            setCartItems(res.data.transformedCart)
        } catch (err: any) {
            setError(err.response.data.message)
        }
    }

    const addToCart = async (productId: string) => {
        try {
            await axios.post(`${API_URL}/cart/add/${decode?._id}/${productId}`)
            getCart()
        } catch (err: any) {
            setError(err.response.data.message)
        }
    }

    const decrement = async (productId: string) => {
        try {
            await axios.post(`${API_URL}/cart/decrement/${decode?._id}/${productId}`, {
                operation: 'decrement'
            })
            getCart()
        } catch (err) {
            console.log(err);
        }
    }

    const deleteProduct = async (productId: string) => {
        try {
            await axios.post(`${API_URL}/cart/delete/${decode?._id}/${productId}`)
            getCart()
        } catch (err) {
            console.log(err);
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
        deleteProduct
    }

    useEffect(() => {
        if (verificationDone) getCart()
    }, [verificationDone])

    return (
        <CartContext.Provider value={value}>
            {children}
            <Cart />
        </CartContext.Provider>
    )
}

export default CartProvider