import React, {useState, useEffect} from 'react';
import {FormControl, MenuItem, Select, Card, CardContent } from  "@material-ui/core";
import './App.css';
import Map from "./Map";
import Table from "./Table";
import {sortData, prettyPrintStat} from "./utils";
import LineGraph from "./LineGraph";
import InfoBox from "./InfoBox";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');

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
          setMapCountries(data);
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
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    })
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
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
          <InfoBox title="Coronavirus Cases" active={casesType === "cases"} isRed onClick={(e) => setCasesType("cases")} cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}/>
          <InfoBox title="Recovered" active={casesType === "recovered"} isGreen onClick={(e) => setCasesType("recovered")} cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>
          <InfoBox title="Deaths" active={casesType === "deaths"} isDark onClick={(e) => setCasesType("deaths")} cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}/>
        </div>
        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom}/>
      </div>
      
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table casesType={casesType} countries={tableData}/>
          <h3>Worldwide New {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType}/>
        </CardContent>
      </Card>
      
    </div>
  );
}

export default App;
