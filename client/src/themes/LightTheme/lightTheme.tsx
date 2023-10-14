import { extendTheme } from "@chakra-ui/react";
import inputTheme from "./Input";

const lightTheme = extendTheme({
    components: {
        Input: inputTheme,
    }
})

export default lightTheme