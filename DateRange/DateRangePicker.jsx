import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
  Box,
  Button,
  ClickAwayListener,
  createStyles,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Paper,
  Popper,
  TextField,
  withStyles,
  withTheme,
} from "@material-ui/core";
import { Clear as ClearIcon } from "@material-ui/icons";
import { DatePicker } from "@material-ui/pickers";
import dayjs from "dayjs";

class DateRangePicker extends PureComponent {
  state = {
    from: null,
    anchorEl: null,
    inputFocusing: false,
  };

  static propTypes = {
    onChange: PropTypes.func,
    from: PropTypes.object,
    to: PropTypes.object,
    minDate: PropTypes.object,
    maxDate: PropTypes.object,
    maxRangeLength: PropTypes.number,
    disableFuture: PropTypes.bool,
    TextFieldProps: PropTypes.object,
    BoxProps: PropTypes.object,
    clearable: PropTypes.bool,
    autoClose: PropTypes.bool,
    endAdornmentWhenClearable: PropTypes.element,
    locale: PropTypes.shape({
      today: PropTypes.string,
      yesterday: PropTypes.string,
      thisWeek: PropTypes.string,
      lastWeek: PropTypes.string,
      thisMonth: PropTypes.string,
      lastMonth: PropTypes.string,
      reset: PropTypes.string,
    }),
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  };

  static defaultProps = {
    locale: {
      today: "Hôm nay",
      yesterday: "Hôm qua",
      thisWeek: "Tuần này",
      lastWeek: "Tuần trước",
      thisMonth: "Tháng này",
      lastMonth: "Tháng trước",
      to: "đến",
      reset: "Đặt lại",
    },
  };

  render() {
    const {
      BoxProps,
      TextFieldProps,
      from,
      to,
      clearable,
      endAdornmentWhenClearable,
      locale,
    } = this.props;
    const { anchorEl, from: _from, inputFocusing } = this.state;
    const [minDate, maxDate] = this._getSelectableRange();
    const now = dayjs();
    const [, maxLimitDate] = this._getRange();
    const value =
      _from ??
      to ??
      from ??
      (now.isBefore(maxLimitDate, "day") ? now : maxLimitDate);

    let overrideProps = null;

    if (clearable && (from || to)) {
      overrideProps = {
        InputProps: {
          ...TextFieldProps?.InputProps,
          endAdornment: (
            <InputAdornment position="end">
              {endAdornmentWhenClearable}
              <IconButton onClick={() => this._raiseOnChange()} edge="end">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        },
      };
    }

    return (
      <Box {...BoxProps}>
        <TextField
          {...TextFieldProps}
          readOnly
          value={this._getDisplayText()}
          onFocus={this._handleTextFieldFocus}
          onBlur={this._handleTextFieldBlur}
          {...overrideProps}
        />
        <Popper
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          placement="bottom-start"
        >
          <ClickAwayListener
            onClickAway={() => !inputFocusing && this._close()}
          >
            <Box
              display="flex"
              flexDirection="column"
              component={Paper}
              variant="outlined"
            >
              <Box display="flex">
                <Box>{this._renderQuickPickList()}</Box>
                <Divider flexItem orientation="vertical" />
                <Box>
                  <DatePicker
                    variant="static"
                    label="picker"
                    disableToolbar
                    value={value}
                    minDate={minDate ?? undefined}
                    maxDate={maxDate ?? undefined}
                    renderDay={this._renderDay}
                    onChange={this._handleDatePickerChange}
                  />
                </Box>
              </Box>
              <Divider />
              <Box display="flex" padding={1}>
                <Box flexGrow={1} />
                <Box>
                  <Button
                    fullWidth
                    disabled={!_from}
                    onClick={this._handleReset}
                  >
                    {locale.reset}
                  </Button>
                </Box>
              </Box>
            </Box>
          </ClickAwayListener>
        </Popper>
      </Box>
    );
  }

  _renderDay = (day, selectedDate, dayInCurrentMonth, dayComponent) => {
    const { classes, theme, from: fromInProps, to: toInProps } = this.props;
    const { from: fromInState } = this.state;
    const selected = Boolean(fromInState);
    const from = selected ? fromInState : fromInProps;
    const to = selected ? null : toInProps;
    const isInRange = from && to && day.isBetween(from, to, "day", "[]");

    if (isInRange) {
      const isFrom = day.isSame(from, "day");
      const isTo = day.isSame(to, "day");
      const isBound = isFrom || isTo;
      const isOneDay = from && to && from.isSame(to, "day");
      const wrapperClassName = clsx({
        [classes.bgPrimaryLight]: !isBound,
      });
      const iconClassName = clsx(classes.day, {
        [classes.bgPrimary]: isBound,
        [classes.primaryText]: isInRange,
      });
      const backgroundClassName = isOneDay
        ? null
        : clsx({
            [classes.bgFrom]: isFrom,
            [classes.bgTo]: isTo,
            [classes.bg]: isFrom || isTo,
          });

      return (
        <Box className={wrapperClassName} position="relative">
          <Box className={backgroundClassName} />
          <Box
            component={IconButton}
            className={iconClassName}
            fontSize={theme.typography.subtitle2.fontSize}
            width={theme.spacing(4.5)}
            height={theme.spacing(4.5)}
            marginX="2px"
          >
            {day.format("D")}
          </Box>
        </Box>
      );
    }

    return dayComponent;
  };

  _renderQuickPickList = () => {
    const { locale, maxRangeLength } = this.props;
    const [minDate, maxDate] = this._getRange();
    const now = dayjs();
    const yesterday = now.subtract(1, "day");
    const dayInLastWeek = now.subtract(1, "week");
    const dayInLastMonth = now.subtract(1, "month");

    function isInRange(day) {
      if (!minDate && !maxDate) {
        return true;
      }

      if (minDate && maxDate) {
        return day.isBetween(minDate, maxDate, "day", "[]");
      }

      if (minDate) {
        return !day.isBefore(minDate, "day");
      } else {
        return !day.isAfter(maxDate, "day");
      }
    }

    const showToday = isInRange(now);
    const showYesterday = isInRange(yesterday);

    const showWeek = !maxRangeLength || maxRangeLength > 6;
    const showThisWeek =
      showWeek &&
      (isInRange(now.startOf("week")) || isInRange(now.endOf("week")));
    const showLastWeek =
      showWeek &&
      (isInRange(dayInLastWeek.startOf("week")) ||
        isInRange(dayInLastWeek.endOf("week")));

    const showThisMonth =
      (!maxRangeLength || maxRangeLength >= now.daysInMonth()) &&
      (isInRange(now.startOf("month")) || isInRange(now.endOf("month")));
    const showLastMonth =
      (!maxRangeLength || maxRangeLength >= dayInLastMonth.daysInMonth()) &&
      (dayInLastMonth.startOf("month") || dayInLastMonth.endOf("month"));

    return (
      <List>
        {showToday && (
          <ListItem button onClick={this._handleSetToday}>
            <ListItemText primary={locale.today} />
          </ListItem>
        )}
        {showYesterday && (
          <ListItem button onClick={this._handleSetYesterday}>
            <ListItemText primary={locale.yesterday} />
          </ListItem>
        )}
        {showThisWeek && (
          <ListItem button onClick={this._handleSetThisWeek}>
            <ListItemText primary={locale.thisWeek} />
          </ListItem>
        )}
        {showLastWeek && (
          <ListItem button onClick={this._handleSetLastWeek}>
            <ListItemText primary={locale.lastWeek} />
          </ListItem>
        )}
        {showThisMonth && (
          <ListItem button onClick={this._handleSetThisMonth}>
            <ListItemText primary={locale.thisMonth} />
          </ListItem>
        )}
        {showLastMonth && (
          <ListItem button onClick={this._handleSetLastMonth}>
            <ListItemText primary={locale.lastMonth} />
          </ListItem>
        )}
      </List>
    );
  };

  _getRange = () => {
    const now = dayjs();
    const { minDate, maxDate: maxDateInProps, disableFuture } = this.props;
    let maxDate = maxDateInProps;

    if (disableFuture) {
      maxDate = maxDateInProps ? dayjs.min(maxDateInProps, now) : now;
    }

    return [minDate, maxDate];
  };

  _getSelectableRange = () => {
    const { maxRangeLength } = this.props;
    const { from } = this.state;
    const [lowerBound, upperBound] = this._getRange();

    if (maxRangeLength && from) {
      const finalMin = dayjs.max(
        [from.subtract(maxRangeLength - 1, "days"), lowerBound].filter(Boolean)
      );
      const finalMax = dayjs.min(
        [from.add(maxRangeLength - 1, "days"), upperBound].filter(Boolean)
      );

      return [finalMin, finalMax];
    }

    return [lowerBound, upperBound];
  };

  _getDisplayText = () => {
    const { from: fromInProps, to: toInProps, locale } = this.props;
    const isSingleDay = fromInProps?.isSame(toInProps, "day");
    const fromText = fromInProps?.format("L") ?? "";
    const toText = toInProps?.format("L") ?? "";

    if (fromInProps && toInProps) {
      if (isSingleDay) {
        return fromText;
      }

      return `${fromText} ${locale.to} ${toText}`;
    }

    if (fromInProps) {
      return fromText;
    }

    if (toInProps) {
      return toText;
    }

    return "";
  };

  _close = () => {
    this.setState({ from: null, anchorEl: null });
  };

  _handleReset = () => {
    this.setState({ from: null });
  };

  _raiseOnChange = (fromValue, toValue) => {
    const { onChange, autoClose } = this.props;

    if (autoClose) {
      this._close();
    }

    if (!onChange) {
      return;
    }

    const [minDate, maxDate] = this._getRange();
    let from, to;

    if (fromValue) {
      from = minDate && fromValue.isBefore(minDate) ? minDate : fromValue;
    }
    if (toValue) {
      to = maxDate && toValue.isAfter(maxDate) ? maxDate : toValue;
    }

    onChange(from?.startOf("day"), to?.endOf("day") ?? from?.endOf("day"));

    if (fromValue && toValue) {
      this.setState({ from: null });
    }
  };

  _handleDatePickerChange = (value) => {
    const { from } = this.state;

    if (!from) {
      this.setState({ from: value });
      this._raiseOnChange(value);
      return;
    }

    const { from: fromInProps, to: toInProps } = this.props;

    if (
      from.isSame(fromInProps) === false ||
      value.isSame(toInProps) === false
    ) {
      if (from.isAfter(value)) {
        this._raiseOnChange(value, from);
      } else {
        this._raiseOnChange(from, value);
      }
    }
  };

  _handleTextFieldFocus = (e) => {
    this.setState({
      from: null,
      anchorEl: e.currentTarget,
      inputFocusing: true,
    });
  };

  _handleTextFieldBlur = (e) => {
    this.setState({ inputFocusing: false });
  };

  _handleSetToday = () => {
    const now = dayjs();
    this._raiseOnChange(now, now);
  };
  _handleSetYesterday = () => {
    const yesterday = dayjs().subtract(1, "day");
    this._raiseOnChange(yesterday, yesterday);
  };
  _handleSetThisWeek = () => {
    const now = dayjs();
    this._raiseOnChange(now.startOf("week"), now.endOf("week"));
  };
  _handleSetLastWeek = () => {
    const dayInLastWeek = dayjs().subtract(1, "week");
    this._raiseOnChange(
      dayInLastWeek.startOf("week"),
      dayInLastWeek.endOf("week")
    );
  };
  _handleSetThisMonth = () => {
    const now = dayjs();
    this._raiseOnChange(now.startOf("month"), now.endOf("month"));
  };
  _handleSetLastMonth = () => {
    const dayInLastMonth = dayjs().subtract(1, "month");
    this._raiseOnChange(
      dayInLastMonth.startOf("month"),
      dayInLastMonth.endOf("month")
    );
  };
}

const styles = createStyles((theme) => ({
  primaryText: {
    color: theme.palette.primary.contrastText,
  },
  bgPrimaryLight: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.light,
  },
  bgPrimary: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
  },
  day: {
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },
  bg: {
    width: "50%",
    height: "100%",
    position: "absolute",
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.light,
  },
  bgFrom: {
    right: 0,
  },
  bgTo: {
    left: 0,
  },
}));

export default withStyles(styles)(withTheme(DateRangePicker));
