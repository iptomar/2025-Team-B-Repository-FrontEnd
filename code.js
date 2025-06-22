let countries = ["es", "pt-pt", "pt-br", "en-US", "en-UK", 'jp', 'ch', 'ge', 'de', 'pl']
countries.forEach(country => {
    let valor = 31000.25.toLocaleString(country, {currency: "EUR", minimumFractionDigits: 2});

    console.log(country + ":\t" + valor + "€")
});
