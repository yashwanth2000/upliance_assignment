import React from 'react';
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

const Header: React.FC = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const username =
		(user as any)?.name ||
		(user as any)?.displayName ||
		user?.email?.split('@')[0] ||
		'User';

	const handleLogout = async () => {
		await logout();
		navigate('/login');
	};

	return (
		<Box p="4" as='header'>
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