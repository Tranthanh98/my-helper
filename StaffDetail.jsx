import { Box, Button, Container, Grid, TextField } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { OpenConfirmModal } from '../actions/confirm';
import { closeDrawer } from '../actions/drawer';
import { updateJobLevel, updateJobTitle } from '../actions/staff';
import { useInputNumber, useInputText } from '../general/CustomHook';
import { formatDate } from '../general/helper';
import * as httpClient from '../general/HttpClient';
import SelectOption from './Base/SelectOption';


function StaffDetail(props){
    const dispatch = useDispatch();
    const detail = useSelector(state => state.updateStaffDetail);
    const _save = async ()=>{
        let update = {...detail, 
                    fullName : fullName.value, 
                    address : address.value, 
                    phone : phone.value, 
                    joinedDate : joinDate.value,
                    birthday: date.value,
                    
                }
        let response = await httpClient.sendPost("Staff/UpdateStaff", update);

        if(response.data.isSuccess === false){
            alert(response.message);
        }
        else{
            dispatch(closeDrawer());
            await props.getData();
        }
        
    }
    const _handleDelete = ()=>{
        let payload = {
            title : "Delete this staff",
            callbackCancel: null,
            callbackConfirm : _delete,
            content: "The staff will be deleted ?"
        }
        dispatch(OpenConfirmModal(payload));
    }
    const _delete = async ()=>{
        let response = await httpClient.sendDelete("Staff/DeleteStaff/"+detail.id);
        if(response.data.isSuccess === false){
            alert(response.message);
        }
        else{
            dispatch(closeDrawer());
            await props.getData();
        }
    }
    let d = detail;

    const fullName = useInputText(d.fullName, Yup.string().required());
    const address = useInputText(d.address, Yup.string().required());
    const phone = useInputNumber(d.phone, Yup.string().min(10).max(10));

    const date = useInputText(formatDate(d.birthday));
    const joinDate = useInputText(formatDate(d.joinDate));
    return (
        <Container>
            <Box component="h3">Staff Detail</Box>
            <Box border="1px solid #dddddd" borderRadius="8px" padding="16px">
                <Grid container spacing={2}>
                    <Grid item sm={12} md={6}>
                        <Box display="flex">
                            <Box width="20%" margin="0 8px" textAlign="center" display="flex" alignItems="center">
                                Full Name
                            </Box>
                            <Box width="80%">
                                <TextField {...fullName} fullWidth variant="outlined" />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item sm={12} md={6}>
                        <Box display="flex">
                            <Box width="20%" margin="0 8px" textAlign="center" display="flex" alignItems="center">
                                Address
                            </Box>
                            <Box width="80%">
                                <TextField {...address} fullWidth variant="outlined" />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item sm={12} md={6}>
                        <Box display="flex">
                            <Box width="20%" margin="0 8px" textAlign="center" display="flex" alignItems="center">
                                Phone
                            </Box>
                            <Box width="80%">
                                <TextField {...phone} fullWidth variant="outlined" />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item sm={12} md={6}>
                        <Box display="flex">
                            <Box width="20%" margin="0 8px" textAlign="center" display="flex" alignItems="center">
                                Birthday
                            </Box>
                            <Box width="80%">
                                <TextField {...date} type="date" fullWidth variant="outlined" />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item sm={12} md={6}>
                        <Box display="flex">
                            <Box width="20%" margin="0 8px" textAlign="center" display="flex" alignItems="center">
                                Job Title
                            </Box>
                            <Box width="80%">
                                {/* <TextField {...jobTitle} fullWidth variant="outlined" /> */}
                                <SelectOption
                                    value={d.jobTitleId}
                                    onChange={(e)=> dispatch(updateJobTitle(e.target.value))}
                                    options={props.jobTitleOptions}
                                />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item sm={12} md={6}>
                        <Box display="flex">
                            <Box width="20%" margin="0 8px" textAlign="center" display="flex" alignItems="center">
                                Job Level
                            </Box>
                            <Box width="80%">
                                {/* <TextField {...jobLevel} fullWidth variant="outlined" /> */}
                                <SelectOption
                                    value={d.jobLevelId}
                                    onChange={(e)=> dispatch(updateJobLevel(e.target.value))}
                                    options={props.jobLevelOptions}
                                />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item sm={12} md={6}>
                        <Box display="flex">
                            <Box width="20%" margin="0 8px" textAlign="center" display="flex" alignItems="center">
                                Joined Date
                            </Box>
                            <Box width="80%">
                                <TextField {...joinDate} type="date" fullWidth variant="outlined" />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Box margin="8px" display="flex" justifyContent="space-between">
                <Button onClick={_handleDelete} variant="outlined">Delete</Button>
                <Button onClick={_save} variant="outlined">Save</Button>
            </Box>
        </Container>
    )
}
export default StaffDetail;