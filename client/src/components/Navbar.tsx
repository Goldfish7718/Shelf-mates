import {
    Flex,
    Text,
    Button,
    Spacer,
    ButtonGroup,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    MenuGroup,
    IconButton,
    useBreakpointValue,
    Link,
    Icon
} from "@chakra-ui/react"
import { BsBoxArrowRight, BsCart2, BsDiscord } from 'react-icons/bs'
import { FaXTwitter, FaInstagram, FaThreads } from 'react-icons/fa6'
import { GiHamburgerMenu } from 'react-icons/gi'
import { AiOutlineHome, AiOutlineUser } from 'react-icons/ai'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { AiOutlineMail } from 'react-icons/ai'
import { BiLogIn } from 'react-icons/bi'
import { AiOutlineUserAdd } from 'react-icons/ai'
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import { SettingsIcon } from "@chakra-ui/icons"

function Navbar () {

    const isBelowMd = useBreakpointValue({ base: true, md: false })
    const { requestLogout, decode } = useAuth()

    const { btnRef, onOpen  } = useCart()

    const handleLogOut = () => {
        requestLogout()
    }

    return (
        <Flex bgColor="orange.400" px={5} py={2} alignItems="center">
            <Text fontSize={{base: 20, md: 32}} _hover={{ cursor: 'pointer' }} fontWeight="700" color="white" onClick={() => window.location.href = '/'}>Shelf-mates</Text>
            <ButtonGroup display={{base: "none", md: "block" }} isAttached mx={5} >
                <Button><BsDiscord size={18} /></Button>
                <Button><FaXTwitter size={18} /></Button>
                <Button><FaInstagram size={18} /></Button>
                <Button><FaThreads size={18} /></Button>
            </ButtonGroup>
            <Spacer />
            <Menu>
                <MenuButton variant="solid" colorScheme="orange.100" p={{base: 2, md: 4 }} _hover={{ bgColor: "whiteAlpha.300" }} _active={{ bgColor:"orange.400" }} as={IconButton} icon={<GiHamburgerMenu color="white" size={18} />} />
                <MenuList>
                    {isBelowMd ?  
                    <>
                        <MenuGroup title="Social">
                            <MenuItem>Discord <BsDiscord size={18} style={{ marginLeft: "8px" }} /></MenuItem>
                            <MenuItem>X (Twitter) <FaXTwitter size={18} style={{ marginLeft: "8px" }} /></MenuItem>
                            <MenuItem>Instagram <FaInstagram size={18} style={{ marginLeft: "8px" }} /></MenuItem>
                            <MenuItem>Threads <FaThreads size={18} style={{ marginLeft: "8px" }} /></MenuItem>
                        </MenuGroup> 
                        <MenuDivider borderColor="gray.400" />
                    </> : null
                    }
                    {isBelowMd ? 
                    <>
                        <MenuGroup title="Navigation">
                            <MenuItem as={Link} href="/">Home <AiOutlineHome size={18} style={{ marginLeft: "8px" }} /></MenuItem>
                            <MenuItem as={Link} href="/about">About <AiOutlineInfoCircle size={18} style={{ marginLeft: "8px" }} /></MenuItem>
                            <MenuItem as={Link} href="/contact">Contact <AiOutlineMail size={18} style={{ marginLeft: "8px" }} /></MenuItem>
                        </MenuGroup>
                        <MenuDivider borderColor="gray.400" />
                    </> : <>
                        <MenuItem as={Link} href="/">Home <AiOutlineHome size={18} style={{ marginLeft: "8px" }} /></MenuItem>
                        <MenuItem as={Link} href="/about">About <AiOutlineInfoCircle size={18} style={{ marginLeft: "8px" }} /></MenuItem>
                        <MenuItem as={Link} href="/contact">Contact <AiOutlineMail size={18} style={{ marginLeft: "8px" }} /></MenuItem>
                        <MenuDivider borderColor="gray.400" />
                    </>
                    }
                    {isBelowMd ? 
                    <>
                        <MenuGroup title="Profile">
                            {decode?.username ?
                                <>
                                    <MenuItem ref={btnRef} onClick={onOpen}>My Cart <BsCart2 style={{ marginLeft: "8px" }} /></MenuItem>
                                    <MenuItem onClick={() => window.location.href = '/profile'}>{decode.username} <AiOutlineUser size={18} style={{ marginLeft: "8px" }} /></MenuItem>
                                    <MenuItem onClick={handleLogOut}>Log Out <BsBoxArrowRight size={18} style={{ marginLeft: "8px" }} /></MenuItem>
                                </>
                                : <>
                                    <MenuItem as={Link} href="/login">Login <BiLogIn size={18} style={{ marginLeft: "8px" }} /></MenuItem>
                                    <MenuItem as={Link} href="/signup">Sign Up<AiOutlineUserAdd size={18} style={{ marginLeft: "8px" }} /></MenuItem>
                                </>
                            }
                        </MenuGroup>
                    </> : <>
                        {decode?.username ? 
                            <>
                                <MenuItem ref={btnRef} onClick={onOpen}>My Cart <BsCart2 style={{ marginLeft: "8px" }} /></MenuItem>
                                <MenuDivider borderColor='gray.400' />
                                <MenuItem as={Link} href="/profile">{decode.username} <AiOutlineUser size={18} style={{ marginLeft: "8px" }} /></MenuItem>
                                <MenuItem onClick={handleLogOut}>Log Out <BsBoxArrowRight size={18} style={{ marginLeft: "8px" }} /></MenuItem>
                                {/* <MenuDivider borderColor='gray.400' /> */}
                            </>
                            : <>
                            <MenuItem as={Link} href="/login">Login <BiLogIn size={18} style={{ marginLeft: "8px" }} /></MenuItem>
                            <MenuItem as={Link} href="/signup">Sign Up<AiOutlineUserAdd size={18} style={{ marginLeft: "8px" }} /></MenuItem>
                        </>
                        }
                    </>
                    }
                    {decode?.isAdmin ?
                        <>
                            {isBelowMd ?
                                <>
                                <MenuDivider borderColor='gray.400' />
                                <MenuGroup title="Admin">
                                    <MenuItem as={Link} href="/admin/dashboard">Admin Panel <Icon as={SettingsIcon} ml={2} /></MenuItem>
                                </MenuGroup>
                                </> : <>
                                <MenuDivider borderColor='gray.400' />
                                <MenuItem as={Link} href="/admin/dashboard">Admin Panel <Icon as={SettingsIcon} ml={2} /></MenuItem>
                                </>
                            }
                        </> : null
                    }
                </MenuList>
            </Menu>
        </Flex>
    )
}

export default Navbar