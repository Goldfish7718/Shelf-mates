import { useAuth } from "../context/AuthContext"

function Categories () {

    const { decode } = useAuth()

    return (
        <>
            Hi {decode?.fName}
        </>
    )
}

export default Categories