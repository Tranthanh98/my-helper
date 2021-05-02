import { useState } from "react"
import { isNumeric } from "./helper";

/* 
example:
    const name = useInputText("", yup.string().required("Trường này là bắt buộc"));
    <TextField {...name} fullWidth variant="outlined" label="Họ tên" />
*/

export const useInputText = (initValue, validate = null, isNumber = false)=>{
    const [value, setValue] = useState(initValue);
    const [err, setErr] = useState({
        error: false,
        helperText : null
    });
    function onChange(e){
        var val = e.target.value;
        
        if(validate){
            if(isNumber){
                if(isNumeric(val)){
                    setValue(val);
                }
            }
            else{
                setValue(val);
            }
            validate.validate(val)
                .then(v => {
                    
                    setErr({error: false, helperText: null})
                })
            .catch(e => {
                setErr({error: true, helperText: String(e.errors)});
            });
        }
        else{
            if(isNumber){
                if(isNumeric(val)){
                    setValue(val);
                }
            }
            else{
                setValue(e.target.value);
            }
        }
    }
    return {
        value,
        onChange,
        ...err,
        setValue
    }
}
