import React, { useState } from "react";
import TextEditor from "./components/Texteditor";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardVoiceOutlinedIcon from "@mui/icons-material/KeyboardVoiceOutlined";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import Divider from "@mui/material/Divider";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([
    {
      name: "",
    },
    {
      name: "",
    },
    {
      name: "",
    },
  ]);
  const [search, setSearch] = useState("");
  return (
    <>
      <div className="maincomponent">
        <header>
          <div className="left_header">
            <IconButton>
              {" "}
              <HomeOutlinedIcon></HomeOutlinedIcon>
            </IconButton>
            <IconButton>
              <ArrowBackIcon></ArrowBackIcon>
            </IconButton>
          </div>
          <div direction="row" className="middle_header">
            <Stack direction="row" className="search_notes_container">
              <SearchIcon></SearchIcon>
              <input
                value={search}
                onChange={(e) => {
                  e.preventDefault();
                  setSearch(e.target.value);
                }}
                type="text"
                placeholder="Search Notes"
              />
            </Stack>
            <IconButton
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                setNotes([
                  ...notes,
                  {
                    name: "",
                  },
                ]);
              }}
            >
              <EditNoteIcon />
            </IconButton>

            <IconButton aria-label="voice search">
              <KeyboardVoiceOutlinedIcon />
            </IconButton>
          </div>
          <div className="right_header">
            <IconButton>
              <HelpOutlineOutlinedIcon />
            </IconButton>
          </div>
        </header>
        <Divider style={{ borderColor: "white" }} />
        <div className="notes_container">
          {
            /* {search.length > 0
            ? notes
                .filter((note) =>
                  note.toLowerCase().startsWith(search.toLowerCase())
                )
                .map((note, index) => {
                  return (
                    <TextEditor
                      index={index}
                      notes={notes}
                      setNotes={setNotes}
                      key={index}
                      editorState={editorStates[index]}
                      handleEditorChange={handleEditorChange}
                    ></TextEditor>
                  );
                }) */
            notes?.map((note, index) => {
              return (
                <TextEditor
                  index={index}
                  notes={notes}
                  setNotes={setNotes}
                  key={index}
                ></TextEditor>
              );
            })
          }
        </div>
      </div>
    </>
  );
}

export default App;
