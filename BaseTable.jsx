import { Box, Container, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { createColumn } from "../../general/helper";
import { Pagination } from "@material-ui/lab";

const useStyles = makeStyles({
	table: {
	  minWidth: 650,
	},
	tableRow:{
		"&:hover":{
			backgroundColor : "#f5f5f5"
		},
		cursor:"pointer"
	},
	pagination:{
		
		'& > *': {
			marginTop: 8,
		},
	}
  });

const BaseTable = (props) => {
    const{header, dataTable, onClickRow, pagination} = props;
	const classes = useStyles();
	const _onChangePage = (e, pageNum)=>{
		props.onChangePage(pageNum);
	}
  return (
    <Container disableGutters={true}>
      <Box>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
				  {
					  header.map((head, index)=>{
						  return (
							  <TableCell style={{...head.custom }} key={head.id}>{head.title}</TableCell>
						  )
					  })
				  }
              </TableRow>
            </TableHead>
            <TableBody>
              {dataTable && dataTable.map((row, index) => {
				  return (
					<TableRow className={classes.tableRow} key={index + row.id + row.nickName}>
						{
							header.map(h => {
								return (
									<TableCell key={h.id + row[h.nameMapColumn]} onClick={()=>onClickRow(row)} align="left">{row[h.nameMapColumn]}</TableCell>
								)
							})
						}
					</TableRow>
				  )
			  })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
	  <Box display="flex" justifyContent="flex-end" className={classes.pagination}>
		<Pagination count={pagination ? pagination.totalPage : 1} page={props.searchModel.CurrentPage} onChange={_onChangePage} color="primary" variant="outlined" shape="rounded" />
	  </Box>
    </Container>
  );
};

export default BaseTable;
BaseTable.propTypes ={
	header: PropTypes.arrayOf(createColumn),
	dataTable: PropTypes.array,
	onClickRow: PropTypes.func
}
BaseTable.defaultProps ={
	pagination : PropTypes.shape({
		totalPage: 1,
	}),
	dataTable : PropTypes.array
}
