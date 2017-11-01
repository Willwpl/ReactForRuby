import React, { Component } from 'react';

export default class BidHistory extends Component {

    render() {
        return (
            <form>
                <h3>My Bid History</h3>
                <table className="retailer_fill">
                    <thead>
                        <tr><th colSpan="8" className="table_title">Bid Price</th></tr>
                        <tr>
                            <th>S/N</th>
                            <th>Time</th>
                            <th>LT(Off-Peak)</th>
                            <th>LT(Peak)</th>
                            <th>HTS(Off-Peak)</th>
                            <th>HTS(Peak)</th>
                            <th>HLT(Off-Peak)</th>
                            <th>HLT(Peak)</th>
                        </tr>
                        </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>10:00:00</td>
                            <td>$0.3333</td>
                            <td>$0.3333</td>
                            <td>$0.3333</td>
                            <td>$0.3333</td>
                            <td>$0.3333</td>
                            <td>$0.3333</td>
                        </tr>
                    </tbody>
                </table>
            </form>
        );
    }
}