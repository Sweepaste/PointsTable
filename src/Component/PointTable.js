import React,{ useEffect, useState } from 'react';
import { mockAPI } from '../API/mockAPI';
import './PointTable.css'
const PointTable = () => {
    const [transactions, setTransactions] = useState([]);
    const [tablehead, setTablehead] = useState([]);
    const [pointdata, setPointdata] = useState([]);

    useEffect(() => {
        mockAPI().then((res) => setTransactions(res));
    }, []);

    useEffect(() => {
        const monthes = {};
        const data = {};
        transactions.forEach((transaction) => {
            const epoch = new Date(transaction.date).getTime();
            const month = new Date(transaction.date).toLocaleString("en", { month: "short" });
            const name = transaction.name;
            if(!(month in monthes)){
                monthes[month] = epoch;
            }
            if (!(name in data)) {
                data[name] = {};
            }
        });
        const sortedMonth = Object.entries(monthes).sort((e1, e2) => {
            return e1[1] - e2[1];
        }).map(item => item[0]);
        
        //build data hashmap to calculate the points for each user
        for (let key in data) {
            data[key] = { ...monthes,total:0 };
            for (let month in data[key]) {
                data[key][month] = 0;
            }
        }
       
        transactions.forEach((transaction) => {
            const name = transaction.name;
            const month = new Date(transaction.date).toLocaleString("en", { month: "short" });
            const amount = transaction.amount;
            const point = (amount > 50 ? (amount - 50) : 0) + (amount > 100 ? (amount - 100) * 2 : 0);
            data[name][month] += point;
            data[name]['total'] += point;
        })
        //build an array of data object including name,points of each month,total points
        const tableData = new Array(Object.keys(data).length).fill({});
        let idx = 0;
        for (let key in data) {
            tableData[idx] = { name: key, ...data[key] };
            idx++;
        }
        console.log(tableData);
        setTablehead(sortedMonth);
        setPointdata(tableData);

    }, [transactions])
    
    return (
        <div className='pointTable'>
            <table>
                <thead>
                    <tr>
                        <th>UserName</th>
                        {tablehead.map((val, index) => {
                            return <th>{ val}</th>
                        })}
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        pointdata.map((val, index) => {
                            return <tr key={index}>
                                <td>{val.name}</td>
                                <td>{val[tablehead[0]]}</td>
                                <td>{val[tablehead[1]]}</td>
                                <td>{val[tablehead[2]]}</td>
                                <td>{val.total}</td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    )

}
export default PointTable