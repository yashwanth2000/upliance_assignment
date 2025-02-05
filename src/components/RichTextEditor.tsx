import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Box } from "@chakra-ui/react";
import { useSpring, animated } from "@react-spring/web";
import { eventBus } from "../utils/eventBus";

const AnimatedBox = animated(Box);

const RichTextEditor = () => {
	const [editorContent, setEditorContent] = useState("");

	const slideIn = useSpring({
		from: { transform: 'translateY(50px)', opacity: 0 },
		to: { transform: 'transaletY(0)', opacity: 1 },
		config: { mass: 4, tension: 80, friction: 15 }
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
		<AnimatedBox style={slideIn} minH="150px" display="flex" flexDirection="column">
			<ReactQuill
				value={editorContent}
				onChange={handleChange}
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
				}}
			/>
		</AnimatedBox>
	);
};

export default RichTextEditor;
