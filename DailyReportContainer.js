import dayjs from 'dayjs';
import React, { Component } from 'react';
import reportService from 'services/reportService';
import createSummaryRow from '../../components/createSummaryRow';
import ReportContext from '../../components/ReportContext';

class DailyReportContainer extends Component {
    state={
        dateRangeValue: [dayjs().startOf("day"), dayjs()],
        dataTable: [],
        isLoading:false,
        summaryTable: {},
        sortOptions: { sort: null, desc: false },
    }

    componentDidMount (){
        this._loadDataTable();
    }

    _setDateRange = (from, to)=>{
        this.setState({
            dateRangeValue : [from, to]
        });
    }
    
    _updateDataTable = (data, callback)=>{
        this.setState({dataTable : data}, callback);
    }
    _setLoading = (status)=>{
        this.setState({isLoading: status});
    }

    _createSummaryRow = () => {
        const { dataTable } = this.state;
        function calculateTotal(field) {
            if (!dataTable) return 0;
            return dataTable.reduce((acc, cur) => acc + cur[field], 0);
        }
        let data = createSummaryRow(dataTable);
        let newSumary = Object.assign({},
            { date: "Tổng hóa đơn: "+ calculateTotal("count") },
            data("subtotal"),
            data("surcharge"),
            data("discount"),
            data("grandTotal"),
            data("profit"),
            data("debtAmount"),
            data("paidAmount"),
        );
        this.setState({summaryTable: newSumary});
    }
    
    _loadDataTable = async () => {
        console.log("hereeeeee");
        const { dateRangeValue } = this.state;
        this._setLoading(true)
        try {
            const response = await reportService.listDailyRevenue({
                from: dateRangeValue[0],
                to: dateRangeValue[1],
            });

            this._updateDataTable(response ?? [], this._createSummaryRow);
        } finally {
            this._setLoading(false);
        }
    }

    _setSortOptions = (sortOptions) => {
        this.setState({ sortOptions });
    }

    render() {
        let provider = {
            ...this.state,
            onChangeDateRange : this._setDateRange,
            onFilterClick : this._loadDataTable,
            setSortOptions: this._setSortOptions
        }
        return (
            <ReportContext.Provider value={provider}>
                {this.props.children}
            </ReportContext.Provider>
        )
    }

}
export default DailyReportContainer;
