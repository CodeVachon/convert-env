import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Index.scss";

const Col = (props) => {
    return (
        <div className="col">
            { props.children }
        </div>
    );
}; // close Col

const Toolbar = ({
    active = true,
    onClick = (action) => { alert(action); }
}) => {
    return (
        <nav className="toolbar">
            <button className="btn" onClick={ () => onClick("convertToENV") } title="Convert ENV contents to JSON" disabled={ !active }><FontAwesomeIcon icon="arrow-left" /></button>
            <button className="btn" onClick={ () => onClick("convertToJSON") } title="Convert JSON contents to ENV" disabled={ !active }><FontAwesomeIcon icon="arrow-right" /></button>
            <button className="btn" onClick={ () => onClick("clearBoth") } title="Clear Both" disabled={ !active }><FontAwesomeIcon icon="dumpster" /></button>
        </nav>
    )
}; // close Toolbar

const Editor = ({
    title = "Editor",
    value = "",
    state = "",
    onChange = (value) => { console.info(value) },
    onClear = () => { console.info("Clear Request") }
}) => {
    const textAreaRef = useRef(null);

    const _handleChange = (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();

            onChange(event.target.value);
        }
    }; // close _handleChange

    const _onCopyClick = (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        textAreaRef.current.select();
        document.execCommand('copy');
        event.target.focus();
    }; // close _onCopyClick

    const _onClearClick = () => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        onClear();
    }; // close _onClearClick

    return (
        <div className="editor">
            <h2>{ title }</h2>
            <div className="textarea-container">
                <textarea
                    className={ state }
                    ref={ textAreaRef }
                    value={ value }
                    onChange={ _handleChange }
                    resize="false"
                />
            </div>
            <div>
                <button className="btn" onClick={ _onCopyClick } title="Copy"><FontAwesomeIcon icon="copy" /></button>
                <button className="btn" onClick={ _onClearClick } title="Clear"><FontAwesomeIcon icon="trash-alt" /></button>
            </div>
        </div>
    );
}; // close Editor


const convertJSONContentToENVFormat = (data) => {
    let returnContent = "";

    const newLine = "\r\n";

    data = JSON.parse(data);
    Object.keys(data).forEach(key => {
        returnContent += `${key}=${String(data[key]).trim()}` + newLine;
    });

    return returnContent;
}; // close convertJSONContentToENVFormat

const convertENVContentToJSONFormat = (data) => {
    let returnContent = {};

    const newLine = "\r\n";
    data.split(/[\r\n]{1,}/).forEach(line => {
        const cleanLine = line.trim();
        if (
            (cleanLine.length > 0) &&
            (cleanLine[0] !== "#")
        ) {
            const splitChar = "=";
            const kvp = cleanLine.split(splitChar);
            let value = kvp.slice(1).join(splitChar).trim();

            if (new RegExp("^(true|false)$", "i").test(value)) {
                value = (value == "true");
            }
            if (new RegExp("^[0-9]{1,}(.[0-9]{1,})?$", "i").test(value)) {
                value = Number(value);
            }

            returnContent[kvp[0]] = value;
        }
    });

    return JSON.stringify(returnContent, null, " ".repeat(4));
}; // close convertJSONContentToENVFormat

const Application = () => {
    const [ envContent, setEnvContent ] = useState("");
    const [ jsonContent, setJSONContent ] = useState("");
    const [ isJSONContentValid, setIsJSONContentValid ] = useState(true);

    const _handleClick = (action) => {
        if (action === "convertToENV") {
            setEnvContent(convertJSONContentToENVFormat(jsonContent));
        } else if (action === "convertToJSON") {
            validateAndSetJSONContent(convertENVContentToJSONFormat(envContent));
        } else if (action === "clearBoth") {
            setEnvContent("");
            validateAndSetJSONContent("");
        }
    }; // close _handleClick

    const validateAndSetJSONContent = (value) => {
        setJSONContent(value);

        if (value.length > 0) {
            try {
                const parsed = JSON.parse(value);
                setIsJSONContentValid(true);
            } catch (error) {
                setIsJSONContentValid(false);
            }
        } else {
            setIsJSONContentValid(true);
        }
    }; // close validateAndSetJSONContent

    return (
        <section id="app">
            <Col>
                <Editor
                    title="ENV Contents"
                    value={ envContent }
                    onChange={ (value) => setEnvContent(value) }
                    onClear={ () => setEnvContent("") }
                />
            </Col>
            <Toolbar
                active={ isJSONContentValid }
                onClick={ _handleClick }
            />
            <Col>
                <Editor
                    title="JSON Contents"
                    value={ jsonContent }
                    state={ ((isJSONContentValid)?"":"error") }
                    onChange={ (value) => validateAndSetJSONContent(value) }
                    onClear={ () => validateAndSetJSONContent("") }
                />
            </Col>
        </section>
    );
}; // close Application

export default Application;
