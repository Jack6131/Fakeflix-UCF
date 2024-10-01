import "./inputField.scss"


/**Component For streamlined input maker that will when built if something was wrong with input displays error message under it
 * 
 * @param type is asking for type of input usually written as a string
 * @param placeholder is an optional string component for what will initially display in input
 * @param name of input value
 * @param additionalClass
 * @param valadationMessage string used to communicate on validation if invalid
 * @param validation a field used to check if a specific input is valid for what is being asked can be used through regrex
 * @param errors seems to hold errors for response that fail cant tell if its just for api or just input validation
 * @param disabled a boolean to check if you can be entering data in the input form
*/
const InputField = ({
    type,
    placeholder,
    name,
    additionalClass,
    validationMessage,
    validation,
    errors,
    disabled
}) => {
    return (
        <>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                className={`InputField
                    ${errors?.[name] && "Input--error"}
                    ${additionalClass && additionalClass}
                `}
                ref={validation}
                disabled={disabled}
            />
            {errors?.[name] && (
                <p className="InputField__label">{validationMessage}</p>
            )}
        </>
    )
}

export default InputField
