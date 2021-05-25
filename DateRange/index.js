import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Box, Button, Paper, Typography } from "@material-ui/core";
import { ErrorOutline as WarningIcon } from "@material-ui/icons";
import dayjs from "dayjs";
import DataTable from "components/DataTable";
import Resource from "lib/Resource";
import { applyOrdering, getComparer } from "lib/utils";
import reportService from "services/reportService";
import createSummaryRow from "./createSummaryRow";
import columnConfig from "./columnConfig";
import DateRangePicker from "components/DateRangePicker";
import stringFormat from "lib/stringFormat";
import formatter from "lib/formatter";
import useMountedState from "hooks/useMountedState";

const minDate = dayjs().subtract(2, "months");

export default function RevenueTab() {
  const [dateRange, setDateRange] = useState([dayjs().startOf("day"), dayjs()]);
  const [data, setData] = useMountedState([]);
  const [isLoading, setLoading] = useMountedState(false);
  const [sortOptions, setSortOptions] = useState({ sort: null, desc: false });

  useEffect(() => {
    handleFilterClick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const summaryRow = useMemo(() => createSummaryRow(data), [data]);

  const createSortComparer = useCallback(
    () => applyOrdering(getComparer(sortOptions.sort), sortOptions.desc),
    [sortOptions.desc, sortOptions.sort]
  );

  const sortedData = [...data];

  sortedData.sort(createSortComparer());

  const handleFilterClick = async () => {
    setLoading(true);
    try {
      const response = await reportService.listDailyRevenue({
        from: dateRange[0],
        to: dateRange[1],
      });

      setData(response ?? []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      component={Paper}
      elevation={0}
    >
      <Box padding={1} display="flex" alignItems="center" flexWrap="wrap">
        <DateRangePicker
          from={dateRange[0]}
          to={dateRange[1]}
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
            setDateRange([from, to]);
          }}
        />
        <Button
          onClick={handleFilterClick}
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
      <Box flex={1} height={400}>
        <DataTable
          isLoading={isLoading}
          columns={columnConfig}
          summary={summaryRow}
          summaryPosition="bottom"
          data={sortedData}
          sortable
          sortOptions={sortOptions}
          onSort={(sortOpts) => setSortOptions(sortOpts)}
        />
      </Box>
    </Box>
  );
}
