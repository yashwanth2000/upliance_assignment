import {
	Box,
	Button,
	Flex,
	Text
} from '@chakra-ui/react';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ColorModeButton } from './ui/color-mode';

const Header = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const username = user
		? user.authType === 'mock'
			? user.name
			: user.displayName || user.email?.split('@')[0]
		: 'User';

	const handleLogout = async () => {
		await logout();
		navigate('/login');
	};

	return (
		<Box
			p="4"
			as='header'
			backdropFilter="blur(10px)"
			borderBottom="1px solid"
			borderColor="gray.200"
			position="sticky"
			top="0"
			zIndex="1000"
		>
			<Flex justify="space-between" align="center">
				<Text fontSize="xl" fontWeight="bold">
					Welcome, {username}
				</Text>

				<Flex align="center">
					<ColorModeButton mr="4" />
					<Button onClick={handleLogout}>
						<FiLogOut /> Logout
					</Button>
				</Flex>
			</Flex>
		</Box>
	);
};

export default Header;