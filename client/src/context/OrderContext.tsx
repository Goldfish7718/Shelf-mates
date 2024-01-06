import { createContext, useContext, useState } from "react";
import axios from "axios";
import { API_URL } from "../App";
import { useAuth } from "./AuthContext";
import { useSteps, useToast } from "@chakra-ui/react";

type OrderContextProps = {
    children: React.ReactNode;
}

type Step = {
    title: string;
    description: string;
}

type OrderContextType = {
    loading: boolean;
    paymentMethod: string;
    setPaymentMethod: Function;
    address: string;
    setAddress: Function;
    requestCheckout: React.MouseEventHandler<HTMLButtonElement>;
    activeStep: number;
    setActiveStep: Function;
    steps: Step[];
}

const OrderContext = createContext<OrderContextType | null>(null)
export const useOrder = (): OrderContextType => {return useContext(OrderContext) as OrderContextType}

function OrderProvider({ children }: OrderContextProps) {

    const { decode } = useAuth();
    const toast = useToast();
    
    const [loading, setLoading] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState('')
    const [address, setAddress] = useState('')

    const steps = [
        { title: "Select Address", description: "Select or add shipping address." },
        { title: "Payment Method", description: "Select payment method." },
        { title: "Place Order", description: "Pay and place your order" },
    ]

    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: steps.length,
    })

    const validateOrder = () => {
        if (!address) {
            setActiveStep(0)
            toast({
                description: "Please Select an Address",
                status: "error",
                duration: 3000
            })

            return true;
        }

        if (!paymentMethod) {
            setActiveStep(1)
            toast({
                description: "Please Select a Payment Method",
                status: "error",
                duration: 3000
            })

            return true;
        }
    }

    const requestCheckout = async () => {
        try {
          setLoading(true)
          const error = validateOrder()

          if (error) return;

          const res = await axios.post(`${API_URL}/order/checkout/${decode?._id}`, {
            address,
            paymentMethod
          })
          window.location.href = res.data.url
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false)
        }
    }

    const value = {
        loading,
        paymentMethod,
        setPaymentMethod,
        address,
        setAddress,
        requestCheckout,
        activeStep,
        setActiveStep,
        steps,
    }

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    )
}

export default OrderProvider