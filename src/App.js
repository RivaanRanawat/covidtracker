import React, {useState, useEffect} from 'react';
import {FormControl, MenuItem, Select, Card, CardContent } from  "@material-ui/core";
import './App.css';
import Map from "./Map";
import Table from "./Table";
import {sortData} from "./utils";
import LineGraph from "./LineGraph";
import InfoBox from "./InfoBox";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((res) => res.json())
    .then((data) => {
      setCountryInfo(data)
    });
  }, [])

  useEffect(() => {
    const getCountriesData = async() => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((res) => res.json())
      .then((data) => {
        const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2
          }));
          const sortedData = sortData(data);
          setTableData(sortedData); 
        setCountries(countries);
      })
    }
    getCountriesData();
  }, [])

  const onCountryChange = async(event) => {
    const countryCode = event.target.value;

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all': `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(res=> res.json())
    .then(data=>{
      setCountry(countryCode);
      setCountryInfo(data);
    })
  }

  console.log(countryInfo);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app_header">
          <h1>Covid 19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__infoboxs">
          <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>
          <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
        </div>
        <Map />
      </div>
      
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}/>
          <h3>Worldwide New Cases</h3>
          <LineGraph />
        </CardContent>
      </Card>
      
    </div>
  );
}

export default App;
