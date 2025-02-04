import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Box } from "@chakra-ui/react";

const RichTextEditor = () => {
  const [editorContent, setEditorContent] = useState("");

  const handleChange = (value: string) => {
    setEditorContent(value);
  };

  return (
    <Box minH="300px" display="flex" flexDirection="column">
      <ReactQuill 
        value={editorContent} 
        onChange={handleChange}
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
				placeholder="Write something..."
      />
    </Box>
  );
};

export default RichTextEditor;
