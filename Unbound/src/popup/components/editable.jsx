import React, { useState, useEffect, useRef } from 'react';
import { Input, Toast } from '@douyinfe/semi-ui';

/**
 * EditableInput component allows for inline editing of text.
 * Double-click to enable edit mode and click outside to save changes.
 *
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.initialValue - Initial value of the input
 * @returns {JSX.Element}
 */
const EditableInput = ({ bookmarkId, initialValue }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef(null);

    /**
     * Handles the double-click event to enable edit mode.
     */
    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    /**
     * Handles the change event of the input element.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
     */
    const handleChange = (value, e) => {
        setValue(value);
    };

    const handleSave = async () => {
        try {
            await chrome.bookmarks.update(bookmarkId, { title: value });
            setIsEditing(false);
            Toast.success('Bookmark title updated!');
        } catch (error) {
            Toast.error(`Error: ${error.message}, bookmarkId=${bookmarkId}`);
            setValue(initialValue);
        }
    };

    /**
     * Handles the keydown event to save changes on Enter key press.
     *
     * @param {React.KeyboardEvent<HTMLInputElement>} e - The keyboard event.
     */
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
            handleSave();
        }
    };

    /**
     * Handles clicks outside the input to save changes.
     *
     * @param {MouseEvent} e - The mouse event.
     */
    const handleClickOutside = (e) => {
        if (inputRef.current && !inputRef.current.contains(e.target)) {
            setIsEditing(false);
            handleSave();
        }
    };

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        if (isEditing) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isEditing, initialValue]);

    // console.log('EditableInput::', { bookmarkId, initialValue })
    return (
        <div onDoubleClick={handleDoubleClick} style={{ width: '100%' }}>
            {isEditing ? (
                <Input
                    ref={inputRef}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    style={{ width: '100%' }}
                />
            ) : (
                <span style={{ width: '100%', display: 'block' }}>{value}</span>
            )}
        </div>
    );
};

export default EditableInput;