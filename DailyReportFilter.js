import { Box, Button, Typography } from '@material-ui/core';
import { ErrorOutline as WarningIcon } from "@material-ui/icons";
import DateRangePicker from 'components/DateRangePicker';
import dayjs from 'dayjs';
import formatter from 'lib/formatter';
import Resource from 'lib/Resource';
import stringFormat from 'lib/stringFormat';
import React from 'react';
import { connectToContext } from '../../components/ReportContext';
import PropTypes from 'prop-types';

const minDate = dayjs().subtract(2, "months");

function DailyReportFilter(props) {
    const {
        onChangeDateRange,
        dateRangeValue,
        onFilterClick,
    } = props;
    return (
        <>
            <Box padding={1} display="flex" alignItems="center" flexWrap="wrap">
                <DateRangePicker
                    from={dateRangeValue[0]}
                    to={dateRangeValue[1]}
                    TextFieldProps={{
                        variant: "outlined",
                        size: "small",
                        fullWidth: true,
                    }}
                    BoxProps={{
                        width: "230px",
                        paddingRight: 1,
                    }}
                    disableFuture
                    maxRangeLength={31}
                    minDate={minDate}
                    onChange={(from, to) => {
                        onChangeDateRange(from, to);
                    }}
                />
                <Button
                    onClick={onFilterClick}
                    variant="contained"
                    color="primary"
                    disableElevation
                >
                    Đồng ý
                </Button>
            </Box>
            <Box display="flex" alignItems="center" paddingX={1} paddingBottom={1}>
                <WarningIcon fontSize="small" color="primary" />
                <Typography
                    variant="body2"
                    color="primary"
                    component={Box}
                    paddingLeft={0.5}
                >
                    {stringFormat(
                        Resource.REPORT_NOTE,
                        formatter.toDate(dayjs().subtract(2, "month")),
                        31
                    )}
                </Typography>
            </Box>
        </>
    )
}

DailyReportFilter.propTypes = {
    dateRangeValue: PropTypes.arrayOf(Date),
    onChangeDateRange :PropTypes.func,
    onFilterClick: PropTypes.func
}

const mapContextToProps = (context)=>({
    dateRangeValue: context.dateRangeValue,
    onChangeDateRange: context.onChangeDateRange,
    onFilterClick: context.onFilterClick,
})

export default connectToContext(mapContextToProps)(DailyReportFilter)

