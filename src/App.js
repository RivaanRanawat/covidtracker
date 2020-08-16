import React, {useState, useEffect} from 'react';
import {FormControl, MenuItem, Select } from  "@material-ui/core";
import './App.css';

function App() {
  const [countries, setCountries] = useState([])

  useEffect(() => {
    {/* getting all the countries*/}
    const getCountriesData = async() => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((res) => res.json())
      .then((data) => {
        const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2
          }))
        setCountries(countries);
      })
    }
    getCountriesData();
  }, [])
  return (
    <div>
      <div className="app_header">
      <h1>Covid 19 Tracker</h1>
        <FormControl className="app__dropdown">
          <Select variant="outlined" value="PUT">
            {countries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      
    </div>
  );
}

export default App;
