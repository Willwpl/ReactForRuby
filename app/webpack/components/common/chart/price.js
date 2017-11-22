import React, {Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';

export default class Price extends Component {

    constructor(props) {
        super(props);
        this.state = {option: getTemplate(this.props)};
        this.onyAxisMouseOver = this.onyAxisMouseOver.bind(this);
    }

    getChartOption() {
        let option = getTemplate(this.props);
        this.props.data.forEach(element => {
            let tmp = {
                type: 'line',
                data: [],
                itemStyle: {
                    normal: {
                        color: element.color,
                        lineStyle: {
                            color: element.color
                        }
                    }
                }
            };
            element.data.forEach((timePrice) => {
                // console.log('timePrice.is_bidder', timePrice.is_bidder)
                let d = timePrice.is_bidder && timePrice.flag !== null ? {
                    symbol: 'triangle',
                    symbolSize: 15,
                    showSymbol: true,
                    value: []
                } : {
                    symbol: 'circle',
                    symbolSize: 8,
                    showSymbol: true,
                    value: []
                };
                // d.value = [].concat(timePrice.time).concat(timePrice.price);
                if (element.data.length === 1) {
                    d.value = [].concat(0)
                        .concat(parseFloat(timePrice.average_price).toFixed(4));
                } else {
                    d.value = [].concat(moment(timePrice.bid_time).format('YYYY-DD-MM HH:mm:ss'))
                        .concat(parseFloat(timePrice.average_price).toFixed(4));
                }

                tmp.data.push(d);
            });
            option.series.push(tmp);
        });
        return option;
    }

    onyAxisMouseOver(params) {
        if (params.componentType && params.componentType.toLowerCase() === 'yaxis' && this.charts_instance) {
            let instance = this.charts_instance.getEchartsInstance();
            if (instance) {
                let option = instance.getOption();
                if (option.dataZoom && option.dataZoom.hasOwnProperty(1)) {
                    option.dataZoom[1].show = !option.dataZoom[1].show;
                    instance.setOption(option);
                }
            }
        }
    }

    render() {
        return (
            <ReactEcharts
                ref={instance => this.charts_instance = instance}
                option={this.getChartOption()}
                notMerge={true}
                style={{minHeight: '310px', width: '100%'}}
                className='react_for_echarts' />
        );
    }
}

Price.defaultProps = {
    data: []
}

function getTemplate(props) {
    if (props.data.every(element => {
            return element.data.length === 1;
        })) {
        return {
            calculable: true,
            grid: {
                top: '5%',
                left: '10%',
                right: '7%',
                bottom: '20%',
                containLabel: true
            },
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove|click',
                backgroundColor: 'transparent',
                position: (point, params, dom, rect, size) => {
                    let xPosition = point[0] - dom.scrollWidth / 2;
                    let yPosition = point[1] - dom.scrollHeight - 16;
                    if (xPosition < 0) {
                        xPosition = point[0] + 5;
                        yPosition = point[1] - (dom.scrollHeight + 16) / 2;
                        let divs = dom.getElementsByTagName('div');
                        if (divs.length > 1) {
                            divs[1].className = '';
                        }
                    }
                    return [xPosition, yPosition];
                    // return [point[0] - dom.scrollWidth / 2, point[1] - dom.scrollHeight - 16];
                },
                formatter: (params) => {
                    let content = `<div>${params.value[1]}</div>`;
                    if (props && params.seriesIndex < props.data.length) {
                        let template;
                        let serObj = props.data[params.seriesIndex];
                        if (serObj && serObj.data) {
                            let d = serObj.data[params.dataIndex];
                            if (d && d.template_price) { //<div>${d.template_price.hts}</div>
                                template = `<strong>${d.template_price.company_price}</strong>
                                    <div>${d.template_price.lt}</div>
                                    <div>${d.template_price.htl}</div>`;
                            }
                        }
                        if (template) {
                            content = template;
                        }
                    }
                    let result = `<div class="tooltip top">
                                <div class="tooltip-arrow" style="border-top-color:${params.color}"></div>
                                <div class="tooltip-inner" style="background-color:${params.color};color:black">
                                    ${content}
                                </div>
                            </div>`;
                    return result;
                }
            },
            xAxis: {
                splitLine: {show: false},
                show: true,
                type: 'value',
                boundaryGap: false,
                axisLabel: {
                    formatter: (value, index) => {
                        if (index === 0) {
                            if (props.data.length > 0 && props.data[0].data.length > 0) {
                                return moment(props.data[0].data[0].bid_time).format('HH:mm:ss');
                            }
                        }
                        return '';
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: 'white'
                    }
                }
            },
            yAxis: {
                splitLine: {show: false},
                type: 'value',
                name: '$/kWh',
                nameLocation: 'middle',
                nameGap: 50,
                nameRotate: 89.99999999,
                axisTick: {
                    show: false
                },
                // max: function (value) {
                //     return 1;
                // },
                // min: yAxisMin,
                axisLine: {
                    lineStyle: {
                        color: 'white'
                    }
                }
            },
            series: []
        }
    }
    let yAxisMin = 0;
    // if (props.data.length > 0) {
    //     let tmp = 1;
    //     props.data.forEach(element => {
    //         let result =  Math.min.apply(null, element.data.map(el => {
    //             return Number(el.average_price);
    //         }));
    //         if (result < tmp) {
    //             tmp = result;
    //         }
    //     })
    //     if (tmp < 1) {
    //         if (tmp > 0.2) {
    //             yAxisMin = parseFloat(tmp - 0.1).toFixed(1);
    //         }
    //     }
    // }
    return {
        calculable: true,
        dataZoom: [{
            type:'slider',
            show: true,
            realtime: true,
            label: {
                show: false
            },
            showDetail: false,
            bottom: '10%',
            fillerColor: 'rgba(6, 178 ,180 , 0.1)',
            borderColor: '#06b2b3',
            handleColor: '#06b2b3',
            xAxisIndex: 0
        },{
            type:'slider',
            show: true,
            realtime: true,
            label: {
                show: false
            },
            showDetail: false,
            fillerColor: 'rgba(6, 178 ,180 , 0.1)',
            borderColor: '#06b2b3',
            handleColor: '#06b2b3',
            left: '5%',
            yAxisIndex: 0
        }],
        grid: {
            top: '5%',
            left: '15%',
            right: '7%',
            bottom: '20%',
            containLabel: true
        },
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove|click',
            backgroundColor: 'transparent',
            position: (point, params, dom, rect, size) => {
                let xPosition = point[0] - dom.scrollWidth / 2;
                let yPosition = point[1] - dom.scrollHeight - 16;
                if (xPosition < 0) {
                    xPosition = point[0] + 5;
                    yPosition = point[1] - (dom.scrollHeight + 16) / 2;
                    let divs = dom.getElementsByTagName('div');
                    if (divs.length > 1) {
                        divs[1].className = '';
                    }
                }
                return [xPosition, yPosition];
                // return [point[0] - dom.scrollWidth / 2, point[1] - dom.scrollHeight - 16];
            },
            formatter: (params) => {
                let content = `<div>${params.value[1]}</div>`;
                if (props && params.seriesIndex < props.data.length) {
                    let template;
                    let serObj = props.data[params.seriesIndex];
                    if (serObj && serObj.data) {
                        let d = serObj.data[params.dataIndex];
                        if (d && d.template_price) { //<div>${d.template_price.hts}</div>
                            template = `<strong>${d.template_price.company_price}</strong>
                                    <div>${d.template_price.lt}</div>
                                    <div>${d.template_price.htl}</div>`;
                        }
                    }
                    if (template) {
                        content = template;
                    }
                }
                let result = `<div class="tooltip top">
                                <div class="tooltip-arrow" style="border-top-color:${params.color}"></div>
                                <div class="tooltip-inner" style="background-color:${params.color};color:black">
                                    ${content}
                                </div>
                            </div>`;
                return result;
            }
        },
        xAxis: {
            splitLine: {show: false},
            show: true,
            type: 'time',
            boundaryGap: false,
            axisLabel: {
                formatter: (value, index) => {
                    return moment(value).format('HH:mm:ss');
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: 'white'
                }
            }
        },
        yAxis: {
            splitLine: {show: false},
            type: 'value',
            name: '$/kWh',
            nameLocation: 'middle',
            nameGap: 70,
            nameRotate: 89.99999999,
            axisTick: {
                show: false
            },
            // max: function (value) {
            //     return 1;
            // },
            // min: yAxisMin,
            axisLabel: {
                formatter: (value, index) => {
                    if (typeof value === 'number') {
                        return parseFloat(value).toFixed(4);
                    }
                    return value;
                }
            },
            axisLine: {
                lineStyle: {
                    color: 'white'
                }
            },
            triggerEvent: true
        },
        series: []
    }
}