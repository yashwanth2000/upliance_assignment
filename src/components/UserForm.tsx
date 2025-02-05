import React, { useEffect, useState } from "react";
import { Button, Card, Input, Stack, Textarea, Text } from "@chakra-ui/react";
import { useSpring, animated } from "@react-spring/web";
import { Field } from "./ui/field";
import { Toaster, toaster } from "./ui/toaster"
import { v4 as uuidv4 } from "uuid";
import { eventBus } from "../utils/eventBus";

const AnimatedCard = animated(Card.Root);

interface FormData {
	id: string,
	name: string,
	email: string,
	phone: string,
	address: string
}

interface Errors {
	name?: string;
	email?: string;
	phone?: string;
	address?: string;
}

const UserForm = () => {
	const [formData, setFormData] = useState<FormData>({
		id: uuidv4(),
		name: "",
		email: "",
		phone: "",
		address: "",
	});
	const [errors, setErrors] = useState<Errors>({});
	const [initialFormData, setInitialFormData] = useState<FormData>(formData);
	const [isSaved, setIsSaved] = useState(false);

	const fadeIn = useSpring({
		from: { opacity: 0, transform: "scale(0.95)" },
		to: { opacity: 1, transform: "scale(1)" },
		config: { tension: 220, friction: 22 },
	});

	useEffect(() => {
		const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialFormData);
		setIsSaved(!hasChanges);

		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (hasChanges) {
				e.preventDefault();
				e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
				return e.returnValue;
			}
		}

		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => window.removeEventListener('beforeunload', handleBeforeUnload);
	}, [formData, initialFormData]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (errors[name as keyof Errors]) {
			setErrors(prev => ({
				...prev,
				[name]: undefined,
			}))
		}
	};

	const validateForm = () => {
		const newErrors: Partial<FormData> = {};

		if (!formData.name.trim()) {
			newErrors.name = "Name is required";
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!formData.email.trim() || !emailRegex.test(formData.email)) {
			newErrors.email = "Valid Email is required";
		}

		const phoneRegex = /^\d{10}$/;
		if (!formData.phone.trim() || !phoneRegex.test(formData.phone)) {
			newErrors.phone = "Valid 10-digit phone number is required";
		}

		if (formData.address.length <= 5) {
			newErrors.address = "Address must be at least 5 characters long";
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return false;
		}

		setErrors({});
		return true;
	}

	const handleSubmit = () => {
		if (validateForm()) {
			localStorage.setItem("userData", JSON.stringify(formData));
			setInitialFormData(formData);
			setIsSaved(true);
			eventBus.emit('userDataUpdated');
			toaster.create({
				type: "success",
				description: "User data saved successfully",
				duration: 1000
			})
		} else {
			toaster.create({
				type: "error",
				description: "Error in saving the form",
				duration: 1000
			})
		}
	};

	const handleCancel = () => {
		setFormData(initialFormData);
		setErrors({});
		setIsSaved(true);
		toaster.create({
			type: "info",
			description: "Changes discarded",
			duration: 1000
		})
	}

	return (
		<AnimatedCard style={fadeIn} w="md">
			<Card.Header>
				<Text fontSize="xl" fontWeight="bold">User Form</Text>
			</Card.Header>
			<Card.Body>
				<Stack gap="4">
					<Field label="Name" required>
						<Input
							name="name"
							value={formData.name}
							placeholder="Enter your name"
							onChange={handleChange}
							_hover={{ borderColor: "blue.400" }}
						/>
						{errors.name && (
							<span style={{ "color": "red", "fontSize": "15px" }}>
								{errors.name}
							</span>
						)}
					</Field>
					<Field label="Email" required>
						<Input
							name="email"
							type="email"
							value={formData.email}
							onChange={handleChange}
							placeholder="Enter your email"
							_hover={{ borderColor: "blue.400" }}
						/>
						{errors.email && (
							<span style={{ "color": "red", "fontSize": "15px" }}>
								{errors.email}
							</span>
						)}
					</Field>
					<Field label="Phone Number" required>
						<Input
							name="phone"
							type="tel"
							value={formData.phone}
							onChange={handleChange}
							placeholder="Enter your phone number"
							_hover={{ borderColor: "blue.400" }}
						/>
						{errors.phone && (
							<span style={{ "color": "red", "fontSize": "15px" }}>
								{errors.phone}
							</span>
						)}
					</Field>

					<Field label="Address" required>
						<Textarea
							name="address"
							value={formData.address}
							onChange={handleChange}
							placeholder="Enter your address"
							_hover={{ borderColor: "blue.400" }}
						/>
						{errors.address && (
							<span style={{ "color": "red", "fontSize": "15px" }}>{errors.address}</span>
						)}
					</Field>
				</Stack>
				<Card.Footer justifyContent="flex-end" mt="4">
					<Button variant="outline" mr="2" onClick={handleCancel}>
						Cancel
					</Button>
					<Button
						variant="solid"
						colorScheme="blue"
						onClick={handleSubmit}
						disabled={isSaved}
					>
						Save
					</Button>
				</Card.Footer>
			</Card.Body>
			<Toaster />
		</AnimatedCard>
	);
};

export default UserForm;