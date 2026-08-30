import { HStack, Image, Text, Input, InputGroup } from '@chakra-ui/react'
import { useRef } from 'react'
import { BsSearch } from 'react-icons/bs'
import logo from '../assets/logo.webp'
import { ColorSwitchButton } from './ColorSwitchButton'

interface Props {
  onSearch: (searchText: string) => void
}

// ponytail: submit-on-enter, add debounce if live search needed
const NavBar = ({ onSearch }: Props) => {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <HStack w="100%" gap={4}>
      <Image src={logo} alt="logo" boxSize="60px" />
      <Text whiteSpace="nowrap">My App</Text>
      <form
        style={{ flex: 1 }}
        onSubmit={(e) => {
          e.preventDefault()
          if (ref.current) onSearch(ref.current.value)
        }}
      >
        <InputGroup startElement={<BsSearch />}>
          <Input ref={ref} placeholder="Search games..." borderRadius={20} variant="subtle" bg={{ _light: "gray.100", _dark: "whiteAlpha.100" }} borderWidth="0" />
        </InputGroup>
      </form>
      <ColorSwitchButton />
    </HStack>
  )
}

export default NavBar
