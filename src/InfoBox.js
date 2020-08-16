import React from 'react'
import {Card, CardContent, Typography} from "@material-ui/core";
import "./InfoBox.css";

function InfoBox({title, cases, active, isGreen, isRed, isDark, total, ...props }) {
    return (
        <Card onClick={props.onClick} className={`infoBox ${active && "infoBox--selected"} ${
            isRed && "infoBox--red" 
          } ${
            isDark && "infoBox--dark" 
          }  ${
            isGreen && "infoBox--green" 
          }`}>
            <CardContent>
                <Typography className="infoBox__title" color="textSecondary">
                    {title}
                </Typography>

                <h2 className={`infoBox__cases ${!isRed && !isGreen && "infoBox__cases--dark"} ${!isRed && !isDark && "infoBox__cases--green"}`}>{cases}</h2>
                <Typography className="infoBox__total">{total}</Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
