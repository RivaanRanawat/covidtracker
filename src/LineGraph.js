import React,{useState, useEffect} from 'react';
import {Line} from "react-chartjs-2";
import numeral from "numeral";

function LineGraph({casesType='cases'}) {
    const [data, setData] = useState({});

    const options = {
        legend: {
          display: false,
        },
        elements: {
          point: {
            radius: 0,
          },
        },
        maintainAspectRatio: false,
        tooltips: {
          mode: "index",
          intersect: false,
          callbacks: {
            label: function (tooltipItem, data) {
              return numeral(tooltipItem.value).format("+0,0");
            },
          },
        },
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                format: "MM/DD/YY",
                tooltipFormat: "ll",
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: false,
              },
              ticks: {
                // Include a dollar sign in the ticks
                callback: function (value, index, values) {
                  return numeral(value).format("0a");
                },
              },
            },
          ],
        },
      };
      

    const buildChartData = (data, casesType='cases') => {
        const chartData = [];
        let lastPointData;
        for(let date in data.cases) {
            if(lastPointData) {
                const newPointData = {
                    x: date,
                    y: data[casesType][date] - lastPointData
                }
                chartData.push(newPointData);
            }
            lastPointData = data[casesType][date];
        }
        return chartData;
    }

    useEffect(() => {
        fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
        .then(res => res.json())
        .then((data) => {
            const chartData = buildChartData(data);
            setData(chartData);
        })
    }, [])

    
    return (
        <div>
            {data?.length>0 &&(
                <Line options={options} data={{datasets:[{
                backgroundColor: "rgba(204,16,52,0.5)",
                borderColor: "#CC1034",
                data: data
                }]}}/>
            )}
            
        </div>
    )
}

export default LineGraph
