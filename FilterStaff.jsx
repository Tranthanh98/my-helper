
import { Box, Button, Chip, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useInputNumber, useInputText, useInputTextNotTarget } from '../general/CustomHook';
import * as Yup from 'yup';
const useStyles = makeStyles({
    textFieldMargin:{
        margin : "0 8px"
    },
    chipMargin:{
        margin:"0 4px"
    }
})

function TagFilter(props){
    const classes = useStyles();
    return(
        <Box>
            {
                props.listFilter.map((filter, index)=>{
                    return (
                            <Chip
                                key={index}
                                label={`${filter.type} : ${filter.value}`}
                                onDelete={filter.onDelete}
                                variant="outlined"
                                className={classes.chipMargin}
                            />
                    )
                })
            }
        </Box>
    )

}
const FilterStaff = (props) => {
    const classes = useStyles();
    
    const searchName= useInputTextNotTarget("");
    const ageFrom= useInputTextNotTarget(0, Yup.number().min(0));
    const ageTo= useInputTextNotTarget(0, Yup.number().max(100));
    const nickName= useInputTextNotTarget("");
    const phone= useInputTextNotTarget("");

    const _search= ()=>{
        let filterObj = {
            searchName: searchName.value,
            ageFrom: ageFrom.value,
            ageTo: ageTo.value,
            nickName: nickName.value,
            phone: phone.value
        };
        props.onChangeSearch(filterObj);
    }
    const createListFilterTag = ()=>{
        let filterTags = [];
        if(searchName.value.length > 0){
            filterTags.push({type: "Name", value: searchName.value, onDelete: ()=> searchName.onChange("")});
        }
        if(ageFrom.value > 0 && ageTo.value > 0){
            filterTags.push({type: "Age", value: `from : ${ageFrom.value} - to : ${ageTo.value}`, onDelete: ()=> { ageFrom.onChange(0); ageTo.onChange(0);}});
        }
        if(nickName.value.length > 0){
            filterTags.push({type: "Nick Name", value: nickName.value, onDelete: ()=> nickName.onChange("")});
        }
        if(phone.value.length > 0){
            filterTags.push({type: "phone", value: phone.value, onDelete:()=> phone.onChange("")});
        }
        return filterTags;
    }
    return (
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Grid container spacing={1}>
                        <Grid item xs={2}>
                            <Typography>Name</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField value={searchName.value} onChange={(e)=> searchName.onChange(e.target.value)} fullWidth size="small" variant="outlined"/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Grid container spacing={1}>
                        <Grid item xs={2}>
                            <Typography>Age</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Box display="flex">
                                <TextField value={ageFrom.value} onChange={(e)=> ageFrom.onChange(e.target.value)} classes={{root: classes.textFieldMargin}} size="small" variant="outlined" label="from"/>
                                <TextField value={ageTo.value} onChange={(e)=> ageTo.onChange(e.target.value)} classes={{root: classes.textFieldMargin}}  size="small" variant="outlined" label="to"/>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Grid container spacing={1}>
                        <Grid item xs={2}>
                            <Typography>Nick Name</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField value={nickName.value} onChange={(e)=> nickName.onChange(e.target.value)} fullWidth size="small" variant="outlined"/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Grid container spacing={1}>
                        <Grid item xs={2}>
                            <Typography>Phone</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField value={phone.value} onChange={(e)=> phone.onChange(e.target.value)} fullWidth size="small" variant="outlined"/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <TagFilter listFilter={createListFilterTag()}/>
                </Grid>
                <Grid item xs>
                    <Button variant="contained" onClick={_search}>Search</Button>
                </Grid>
            </Grid>
    );
};

export default FilterStaff;