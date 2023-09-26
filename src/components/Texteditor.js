import React, { useState, useRef, useMemo, useEffect } from "react";
import { EditorState, Modifier, SelectionState } from "draft-js";
import Editor from "@draft-js-plugins/editor";
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from "@draft-js-plugins/mention";
import "draft-js/dist/Draft.css";
import "@draft-js-plugins/mention/lib/plugin.css";
import Divider from "@mui/material/Divider";

const TextEditor = ({ notes, setNotes, index }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [value, setValue] = useState("");
  const mentionPlugin = useMemo(
    () =>
      createMentionPlugin({
        notes,
        entityMutability: "IMMUTABLE",
        mentionComponent: (mentionProps) => (
          <span style={{ color: "blue" }}>{mentionProps.children}</span>
        ),
        mentionTrigger: ["<>"],
        mentionPrefix: "<>",
        supportWhitespace: false,
      }),
    []
  );
  const { MentionSuggestions } = mentionPlugin;
  const plugins = [mentionPlugin];
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  // Draft-JS editor configuration
  //
  const [open, setOpen] = useState(false);
  const editor = useRef(null);

  // Check editor text for mentions
  const onSearchChange = ({ value }) => {
    setValue(value);
  };

  // A function that returns the block key and the start and end offsets of an entity
  const findEntityRange = (contentState, entityKey) => {
    // Loop through all the blocks
    const blocks = contentState.getBlocksAsArray();
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      // Loop through all the characters
      const chars = block.getCharacterList();
      for (let j = 0; j < chars.size; j++) {
        const char = chars.get(j);
        // Check if the character has the entity key
        if (char.getEntity() === entityKey) {
          // Find the start and end offsets of the entity range
          let start = j;
          let end = j;
          while (start > 0 && chars.get(start - 1).getEntity() === entityKey) {
            start--;
          }
          while (
            end < chars.size - 1 &&
            chars.get(end + 1).getEntity() === entityKey
          ) {
            end++;
          }
          // Return the block key and the offsets
          return {
            blockKey: block.getKey(),
            start,
            end,
          };
        }
      }
    }
    // Return null if no entity range is found
    return null;
  };

  function handleBackspace() {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    if (!selection.isCollapsed()) {
      // If there's a selection, remove the selected content.
      const newContentState = Modifier.removeRange(
        contentState,
        selection,
        "backward"
      );
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "remove-range"
      );
      return EditorState.forceSelection(
        newEditorState,
        newContentState.getSelectionAfter()
      );
    }
    const blockWithEntityAtCursor = contentState.getBlockForKey(
      selection.getStartKey()
    );
    const entityKey = blockWithEntityAtCursor.getEntityAt(
      selection.getStartOffset() - 1
    );

    if (entityKey) {
      const entityRange = findEntityRange(contentState, entityKey);
      // Check if the entity range is not null
      if (entityRange) {
        // Create a selection state with the entity range
        const { blockKey, start, end } = entityRange;
        const selectionState = SelectionState.createEmpty(blockKey).merge({
          anchorOffset: start,
          focusOffset: end + 1,
        });
        // Set the editor state with the new selection state

        return EditorState.forceSelection(editorState, selectionState);
      }
    }
  }

  function handleKeyCommand(command) {
    if (command === "backspace") {
      const newEditorState = handleBackspace();
      if (newEditorState) {
        setEditorState(newEditorState);
        return "handled";
      } else return "not-handled";
    }
  }
  useEffect(() => {
    setMentionSuggestions(defaultSuggestionsFilter(value, notes));
  }, [notes, value]);

  return (
    <div className="each_note">
      <Editor
        editorState={editorState}
        plugins={plugins}
        onChange={(editorState) => {
          const updatedNotes = [...notes];
          // Update the value at the specified index
          updatedNotes[index] = {
            name: editorState.getCurrentContent().getPlainText("\u0001"),
          };

          // Set the state with the updated array
          setNotes(updatedNotes);
          setEditorState(editorState);
        }}
        handleKeyCommand={handleKeyCommand}
        placeholder={"Type here..."}
        ref={editor}
      />
      <MentionSuggestions
        open={open}
        onOpenChange={setOpen}
        onSearchChange={onSearchChange}
        suggestions={mentionSuggestions.filter(
          (note) =>
            note.name.length > 0 &&
            note.name != editorState.getCurrentContent().getPlainText("\u0001")
        )}
      />
      <Divider
        style={{ borderColor: "white", marginTop: "15px" }}
        variant="middle"
      />
    </div>
  );
};

export default TextEditor;
