import { Box, Button, Container, makeStyles, TextField } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useInputNumber, useInputSelect, useInputText } from '../general/CustomHook';
import { formatDate, isStringEmpty } from '../general/helper';
import * as httpClient from '../general/HttpClient';
import SelectOption from './Base/SelectOption';
import * as Yup from 'yup';

const useStyles = makeStyles({
    formItem:{
        margin:"16px 0 16px 0"
    },
    btnSave:{
        display:"flex",
        justifyContent:"flex-end",
        margin:"16px 0 16px 0"
    }
})

const AddNewStaffComponent = (props) => {
    const classes = useStyles();
    
    const fullName = useInputText("", Yup.string().required());
    const address = useInputText("", Yup.string().required());
    const phone = useInputNumber(0, Yup.string().min(10).max(10).required());

    const birthday = useInputText(formatDate(new Date()));
    const jobTitle = useInputSelect("");
    const jobLevel = useInputSelect("");
    const joinDate = useInputText(formatDate(new Date()));
    
    const _saveNewStaff = async () => {
        let staffAdded = {
            address: address.value,
            fullName: fullName.value,
            jobLevelId: parseInt(jobLevel.value),
            jobTitleId: parseInt(jobTitle.value),
            joinedDate: joinDate.value,
            phone: phone.value,
            birthday: birthday.value
        };
        let response = await httpClient.sendPost("Staff/AddNewStaff", staffAdded);
        if(!response.data.isSuccess){
            alert(response.data.message)
        }
        else{
            props.getData();
            props.closePopover();
        }
    }
    const _getDefaultData = async () =>{
        let response = await httpClient.sendGet("Staff/GetDefaultDataForCreatingStaff");
        let d = response.data.data;
        jobLevel.setOptions(d.jobLevelOptions);
        jobTitle.setOptions(d.jobTitleOptions);
    }
    useEffect(()=>{
        async function getDefaultData(){
            await _getDefaultData();
        }
        getDefaultData();
    }, []);
    return (
        <Container>
            <Box minWidth="350px" padding="8px 0 8px 0">
                <Box className={classes.formItem} component="h3">New staff</Box>
                <Box className={classes.formItem}>
                    <TextField {...fullName} fullWidth variant="outlined" label="Full Name"/>
                </Box>
                <Box className={classes.formItem}>
                    <TextField {...address} fullWidth variant="outlined" label="Address"/>
                </Box>
                <Box className={classes.formItem}>
                    <TextField {...phone} fullWidth variant="outlined" label="Phone"/>
                </Box>
                <Box className={classes.formItem}>
                    <TextField
                        label="Birthday"
                        type="date"
                        fullWidth
                        {...birthday}
                        variant="outlined"
                    />
                </Box>
                <Box className={classes.formItem}>
                    <SelectOption {...jobTitle} fullWidth variant="outlined" label="Job title"/>
                </Box>
                <Box className={classes.formItem}>
                    <SelectOption {...jobLevel} fullWidth variant="outlined" label="Job level"/>
                </Box>
                <Box className={classes.formItem}>
                    <TextField {...joinDate} fullWidth variant="outlined" type="date" label="Join date"/>
                </Box>
                <Box className={classes.btnSave}>
                    <Button variant="outlined" onClick={_saveNewStaff}>Save</Button>
                </Box>
            </Box>
        </Container>
    );
};

export default AddNewStaffComponent;