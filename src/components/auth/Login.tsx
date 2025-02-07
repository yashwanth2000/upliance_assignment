import { useState } from 'react';
import {
	Button,
	Card,
	Icon,
	Input,
	Stack,
	Text,
	VStack
} from "@chakra-ui/react";
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Field } from "../ui/field";
import { PasswordInput, } from "../ui/password-input"
import { Toaster, toaster } from "../ui/toaster";
import { InputGroup } from '../ui/input-group';
import { BiUser } from 'react-icons/bi';
import { MdEmail } from 'react-icons/md';
import { MdLock } from 'react-icons/md';
import { FaGoogle } from 'react-icons/fa';

interface FormErrors {
	email?: string;
	password?: string;
	name?: string;
}
interface FormData {
	email: string;
	password: string;
	name: string;
}

const Login = () => {
	const [isLogin, setIsLogin] = useState(true);
	const [formData, setFormData] = useState<FormData>({
		email: '',
		password: '',
		name: ''
	});
	const [errors, setErrors] = useState<FormErrors>({});

	const { loginWithGoogle, loginWithMock, signupWithMock } = useAuth();
	const navigate = useNavigate();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));

		if (errors[name as keyof FormErrors]) {
			setErrors(prev => ({
				...prev,
				[name]: undefined,
			}));
		}
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			newErrors.email = "Valid email is required";
		}

		if (!formData.password.trim()) {
			newErrors.password = "Password is required";
		}

		if (!isLogin && !formData.name.trim()) {
			newErrors.name = "Name is required";
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return false;
		}

		setErrors({});
		return true;
	};

	const handleMockAuth = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) {
			toaster.create({
				type: "error",
				description: "Please fix the form errors",
				duration: 2000
			});
			return;
		}

		try {
			if (isLogin) {
				await loginWithMock(formData.email, formData.password);
			} else {
				await signupWithMock(formData.email, formData.password, formData.name);
			}
			navigate('/home');
			toaster.create({
				type: "success",
				description: `Successfully ${isLogin ? 'logged in' : 'signed up'}`,
				duration: 2000
			});
		} catch (error) {
			toaster.create({
				type: "error",
				description: error instanceof Error ? error.message : 'Authentication failed',
				duration: 2000
			});
		}
	};

	const handleGoogleLogin = async () => {
		try {
			await loginWithGoogle();
			navigate('/home');
			toaster.create({
				type: "success",
				description: "Successfully logged in with Google",
				duration: 2000
			});
		} catch (error) {
			console.error('Error signing in with Google:', error);
			toaster.create({
				type: "error",
				description: "Google authentication failed",
				duration: 2000
			});
		}
	};

	return (
		<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
			<Card.Root display="flex" justifyContent="center" alignItems="center" w="md">
				<Card.Header>
					<Text fontSize="xl" fontWeight="bold" textAlign="center">{isLogin ? 'Login' : 'Sign Up'}</Text>
					<Text fontSize="sm">{isLogin ? 'Enter your email and password to login' : 'Enter your email, password and name to sign up'}</Text>
				</Card.Header>
				<Card.Body>
					<VStack gap={6}>
						<Button width="full" onClick={handleGoogleLogin}>
							<Icon size="sm">
								<FaGoogle />
							</Icon>
							Sign in with Google
						</Button>
						<Text>OR</Text>
						<form onSubmit={handleMockAuth}>
							<Stack gap="4">
								{!isLogin && (
									<Field label="Name" required >
										<InputGroup flex="1" startElement={<BiUser />} width="100%">
											<Input name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" _hover={{ borderColor: "blue.400" }} />
										</InputGroup>
										{errors.name && <span style={{ color: "red", fontSize: "15px" }}>{errors.name}</span>}
									</Field>
								)}
								<Field label="Email" required>
									<InputGroup startElement={<MdEmail />} width="100%">
										<Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" _hover={{ borderColor: "blue.400" }} />
									</InputGroup>
									{errors.email && <span style={{ color: "red", fontSize: "15px" }}>{errors.email}</span>}
								</Field>
								<Field label="Password" required>
									<InputGroup startElement={<MdLock />} width="100%">
										<PasswordInput name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" _hover={{ borderColor: "blue.400" }} />
									</InputGroup>
									{errors.password && <span style={{ color: "red", fontSize: "15px" }}>{errors.password}</span>}
								</Field>
							</Stack>
							<Card.Footer justifyContent="flex-end" mt="6">
								<Button variant="outline" mr="2" onClick={() => setIsLogin(!isLogin)}>
									{isLogin ? 'Need an account?' : 'Have an account?'}
								</Button>
								<Button variant="solid" colorScheme="blue" type="submit">{isLogin ? 'Login' : 'Sign Up'}</Button>
							</Card.Footer>
						</form>
					</VStack>
				</Card.Body>
				<Toaster />
			</Card.Root>
		</div>
	);
};

export default Login;