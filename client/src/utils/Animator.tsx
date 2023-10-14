import { ReactNode, useRef } from 'react'
import { useInView } from 'framer-motion'
import { Box, SystemStyleObject } from '@chakra-ui/react'

type AnimatorProps = {
    children: ReactNode
    animation_type: 'fade-in' | 'vertical'
    watch: boolean
}

function Animator ({ children, animation_type, watch }: AnimatorProps) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: watch, margin: "0px 0px -275px 0px" })

    const verticalFadeIn: SystemStyleObject = {
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(25px)' : '',
        transition: "all 0.6s",
    }

    const fadeIn: SystemStyleObject = {
        opacity: inView ? 1 : 0,
        transition: 'all 0.5s'
    }

    const baseStyles: SystemStyleObject = {
        height: "100%",
    };

    const constructStyles = (): SystemStyleObject => {
        switch (animation_type) {
            case 'fade-in':
                return fadeIn
            case 'vertical':
                return verticalFadeIn
            default:
                return {}
        }
    }

    const boxStyles: SystemStyleObject = {
        ...baseStyles,
        ...constructStyles()
    } 

    return (
        <Box ref={ref} minH="100%" sx={boxStyles}>
                {children}
        </Box>
    )
}

export default Animator