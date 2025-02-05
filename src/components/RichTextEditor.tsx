import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Box } from "@chakra-ui/react";
import { useSpring, animated } from "@react-spring/web";
import { eventBus } from "../utils/eventBus";

const AnimatedBox = animated(Box);

const RichTextEditor = () => {
	const [editorContent, setEditorContent] = useState("");

	const editorSpring = useSpring({
		from: { rotateX: 90, opacity: 0 },
		to: { rotateX: 0, opacity: 1 },
		config: { mass: 5, tension: 200, friction: 35 }
	});

	const updatedContent = () => {
		const storedUserData = localStorage.getItem("userData");

		if (storedUserData) {
			const parsedData = JSON.parse(storedUserData);
			const formattedContent = `
				<h2>User Profile</h2>
				<p><strong>Name:</strong>${parsedData.name}</p>
				<p><strong>Email:</strong> ${parsedData.email}</p>
				<p><strong>Phone:</strong> ${parsedData.phone}</p>
        <p><strong>Address:</strong> ${parsedData.address}</p>
			`;
			setEditorContent(formattedContent);
		}
	}

	useEffect(() => {
		updatedContent();
		const unsubscribe = eventBus.subscribe('userDataUpdated', updatedContent);
		return () => unsubscribe();
	}, [])

	const handleChange = (value: string) => {
		setEditorContent(value);
	};

	return (
		<AnimatedBox style={editorSpring} minH="150px" display="flex" flexDirection="column">
			<ReactQuill
				value={editorContent}
				onChange={handleChange}
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
				}}
				placeholder="Type something or add user data from the form"
			/>
		</AnimatedBox>
	);
};

export default RichTextEditor;
