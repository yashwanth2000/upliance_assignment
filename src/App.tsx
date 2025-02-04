import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Container, Grid, GridItem, Box, Flex } from "@chakra-ui/react"
import Counter from "./components/Counter"
import UserForm from "./components/UserForm"
import RichTextEditor from "./components/RichTextEditor"

const MainLayout = () => {
	return (
		<Container maxW="container.xl" padding="8">
			<Grid templateColumns={["1fr", "1fr", "repeat(2, 1fr)"]} gap="6">
				<GridItem
					w="100%"
					p="6"
					border="1px solid"
					borderColor="gray.200"
					borderRadius="lg"
					boxShadow="sm"
				>
					<Flex height="100%" alignItems="center" justifyContent="center">
						<Counter />
					</Flex>
				</GridItem>
				<GridItem
					w="100%"
					p="6"
					border="1px solid"
					borderColor="gray.200"
					borderRadius="lg"
					boxShadow="sm"
				>
					<Flex height="100%" alignItems="center" justifyContent="center">
						<UserForm />
					</Flex>
				</GridItem>
			</Grid>

			<Box
				mt="8"
				p="6"
				border="1px solid"
				borderColor="gray.200"
				borderRadius="lg"
				boxShadow="sm"
				width="100%"
				height="100%"
			>
				<RichTextEditor />
			</Box>
		</Container>
	)
}
function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<MainLayout />} />
			</Routes>
		</Router>
	)
}

export default App
