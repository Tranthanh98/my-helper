import { Card, CardContent, makeStyles } from '@material-ui/core';
import React from 'react';
import CommonHeader from './Base/CommonHeader';

const useStyles = makeStyles({
    titleLogin:{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        padding:20,
        fontWeight:"bold",
        fontSize:20
    },
    formSignIn:{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        margin:"12px 0 12px 0"
    },
    rootLogin:{
        backgroundColor:"#f8f9fd",
        height:"100vh"
    },
    cardWrapper:{
        minHeight:300,
        minWidth: 350
    },
    footer:{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        margin:"24px 0 24px 0"
    }
})
function SignUpSignIn(props){
    const classes = useStyles();
    return (
        <div className={classes.rootLogin}>
            <CommonHeader
                customComponent={props.customHeader}
            />
            <div className={classes.titleLogin}>
                {props.title}
            </div>
            <div className={classes.formSignIn}>
                <Card className={classes.cardWrapper}>
                    <CardContent>
                        {props.customComponent}
                    </CardContent>
                    
                </Card>
            </div>
            <div className={classes.footer}>
                {props.customFooter}
            </div>
        </div>
    )
}
export default SignUpSignIn;