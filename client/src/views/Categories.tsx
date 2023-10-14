import Navbar from "../components/Navbar"
import { useAuth } from "../context/AuthContext"

function Categories () {

    const { decode } = useAuth()

    return (
        <>
            <Navbar username={decode?.username} />
        </>
    )
}

export default Categories