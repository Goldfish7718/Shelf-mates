import axios from "axios"
import { API_URL } from "../App"
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Loading from "../components/Loading";
import { useToast } from "@chakra-ui/react";

function Confirmation () {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const orderId = searchParams.get('orderId');
    const navigate = useNavigate()
    const toast = useToast()
      
    const requestOrderConfirmation = async () => {
        try {
            const res = await axios.post(`${API_URL}/order/confirmorder/${orderId}`)
            
            if (!res.data.orderObject.confirmed) {
                // Order is still pending confirmation (webhook hasn't fired yet). Check again in 2 seconds.
                setTimeout(requestOrderConfirmation, 2000);
                return;
            }

            // Once confirmed, navigate to the success page with the order ID
            navigate(`/success?orderId=${orderId}`)
        } catch (err: any) {
            toast({
                title: err.response?.data?.message || "Error confirming order",
                status: 'error',
                duration: 3000
            })
        }
    };

    useEffect(() => {
        if (orderId) {
            requestOrderConfirmation();
        }
    }, [orderId])

    return (
        <>
            <Loading />
        </>
    )
}

export default Confirmation