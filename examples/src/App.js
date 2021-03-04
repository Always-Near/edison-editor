import React, { useState, createRef } from "react";
import { RichUtils, getDefaultKeyBinding } from "draft-js";
import EdisonEditor, { EdisonUtil } from "edison-editor";
import { FormattingMenu, EditorActionMap } from "./Controls";
import "./App.css";

function App() {
  const _draftEditorRef = createRef();
  const [editorState, setEditorState] = useState(EdisonUtil.htmlToState(""));
  const [placeholder] = useState("请编辑此处");

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return true;
    }
    return false;
  };

  const mapKeyToEditorCommand = (e) => {
    if (e.keyCode === 9) {
      // TAB
      if (e.shiftKey) {
        setEditorState(EdisonUtil.indentDecrease(editorState));
      } else {
        setEditorState(EdisonUtil.indentIncrease(editorState));
      }
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    return getDefaultKeyBinding(e);
  };

  const onDraftBaseAction = (option) => {
    if (!_draftEditorRef.current) {
      return;
    }
    const action = EditorActionMap[option];
    if (!action || !action.key) {
      return;
    }
    if (action.key === "CLEAR") {
      setEditorState(EdisonUtil.clearAllInlineStyle(editorState));
      return;
    }
    if (action.key === "indent-increase") {
      setEditorState(EdisonUtil.indentIncrease(editorState));
      return;
    }
    if (action.key === "indent-decrease") {
      setEditorState(EdisonUtil.indentDecrease(editorState));
      return;
    }
    if (action.isBlockType) {
      setEditorState(RichUtils.toggleBlockType(editorState, action.key));
    } else {
      setEditorState(RichUtils.toggleInlineStyle(editorState, action.key));
    }
  };

  return (
    <>
      <div className="App">
        <h3>EdisonEditor Test</h3>
        <div className="edisonEditorContainer">
          <FormattingMenu
            onPress={(style) => onDraftBaseAction(style)}
            activeFormats={editorState.getCurrentInlineStyle().toArray()}
          />
          <EdisonEditor
            ref={_draftEditorRef}
            editorState={editorState}
            onChange={setEditorState}
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={mapKeyToEditorCommand}
            placeholder={placeholder}
          />
        </div>
      </div>
    </>
  );
}

export default App;
