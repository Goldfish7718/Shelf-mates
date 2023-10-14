import { createMultiStyleConfigHelpers } from "@chakra-ui/react";
import { inputAnatomy } from '@chakra-ui/anatomy'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(inputAnatomy.keys)

const baseStyle = definePartsStyle({
    field: {
        _focus: {
            border: '2px solid orange !important',
            boxShadow: 'none !important'
        }
    }
})

const inputTheme = defineMultiStyleConfig({
    baseStyle
})

export default inputTheme