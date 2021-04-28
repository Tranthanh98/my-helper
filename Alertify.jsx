import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CloseIcon from '@material-ui/icons/Close';
import {clearAlert, removeAlert} from '../actions/alertify';
const useStyle = makeStyles({
    success: {
        backgroundColor: "#5cb860",
    },
    error: {
        backgroundColor: "#f55a4e",
    },
    warning: {
        backgroundColor: "#ffa21a",
    },
    root:{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        width: "fit-content",
        height: "fit-content",
        zIndex: 99999,
    },
    wrapper: {
        width: "250px",
        padding: "16px",
        marginTop: "8px",
        color: "#fff",
        borderRadius: "5px",
        // backgroundColor: "#aaa",
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        boxShadow:"-7px 7px 25px #000000"
      },
})

function Alertify(props){
    const classes = useStyle();
    const dispatch = useDispatch();
    const listAlert = useSelector(state => state.alertify);
    useEffect(()=>{
        let interval = setInterval(()=>{
            dispatch(clearAlert());
        }, 2000);
        if(listAlert.length == 0){
            clearInterval(interval);
        }
        return ()=>{
            clearInterval(interval);
        }
    }, [listAlert])
    
    return (
        <div className={`${classes.root}`}>
            {
                listAlert.map(i=>{
                    let classAlert;
                    if(i.status =="success"){
                        classAlert = classes.success;
                    }
                    else{
                        classAlert = classes.error;
                    }
                    return (
                        <div key={i.id} className={`${classes.wrapper} ${classAlert}`}>
                            <div style={{width:"90%"}}>
                                {i.title}
                            </div>
                            <div>
                                <CloseIcon onClick={()=>dispatch(removeAlert(i.id))}/>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
export default Alertify;