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
            navigate(`/success?orderId=${res.data.encodedOrderDetails}`)
        } catch (err: any) {
            toast({
                title: err.response.data.message,
                status: 'error',
                duration: 3000
            })
        }
    };

    useEffect(() => {
        requestOrderConfirmation();
    }, [])

    return (
        <>
            <Loading />
        </>
    )
}

export default Confirmation