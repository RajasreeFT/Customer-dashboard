import React, { useEffect, useState } from "react";
import Select from "react-select";
import "../components/countrypicker.css";

const CountryCodePicker = () => {
  const [countryOptions, setCountryOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();

        // Map country data to select options with flag, code, and first two letters
        const options = data.map((country) => ({
          value: `+${country.idd?.root?.replace("+", "") || ""}${
            country.idd?.suffixes ? country.idd.suffixes[0] : ""
          }`,
          label: `${country.name.common} (${`+${
            country.idd?.root?.replace("+", "") || ""
          }${country.idd?.suffixes ? country.idd.suffixes[0] : ""}`})`,
          flag: country.flags.png,
        }));

        // Set the options and default selection (India)
        setCountryOptions(options);

        const defaultCountry = options.find((option) =>
          option.label.includes("India")
        );
        setSelectedCountry(defaultCountry || null);
      } catch (error) {
        console.error("Error fetching country data:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
  };

  // Custom renderer for single selected value
  const customSingleValue = ({ data }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <img
        src={data.flag}
        alt="flag"
        style={{ width: "20px", height: "15px", marginRight: "10px" }}
      />
      {data.label}
    </div>
  );

  // Custom renderer for options in dropdown
  const customOption = (props) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div
        ref={innerRef}
        {...innerProps}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          cursor: "pointer",
        }}
      >
        <img
          src={data.flag}
          alt="flag"
          style={{ width: "20px", height: "15px", marginRight: "10px" }}
        />
        {data.label}
      </div>
    );
  };

  return (
    <div className="country_code">
      <Select
        options={countryOptions}
        value={selectedCountry}
        onChange={handleCountryChange}
        className="country-picker"
        isSearchable
        placeholder="Select a country"
        components={{
          SingleValue: customSingleValue,
          Option: customOption,
        }}
      />
    </div>
  );
};

export default CountryCodePicker;
