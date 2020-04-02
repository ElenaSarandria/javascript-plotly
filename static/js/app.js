function buildMetadata(id) {
    d3.json("data/samples.json").then((data) => {
        var metadata = data.metadata;
        var wfreq = metadata.map(d => d.wfreq);
        console.log(metadata);
        var result = metadata.filter(meta => meta.id.toString() === id)[0];
        var sample_metadata = d3.select("#sample-metadata");
        sample_metadata.html("");
        // Use `Object.entries` to add each key and value pair to the panel
        Object.entries(result).forEach((key) => {
            sample_metadata.append("h6").text(key[0].toUpperCase() + ": " + key[1] + "\n");
        })

        //Gauge Chart
        var data = [{
            domain: { x: [0, 1], y: [0, 1] },
            type: "indicator",
            mode: "gauge+number+delta",
            value: parseFloat(wfreq),
            title: { text: "Belly Button Weekly Washing Frequency", font: { size: 24 } },
            titlefont: { family: '"Palatino Linotype", "Book Antiqua", Palatino, serif' },
            delta: { reference: 0, increasing: { color: "RebeccaPurple" } },
            gauge: {
                axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
                bar: { color: "darkblue" },
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "gray",
                steps: [
                    { range: [0, 250], color: "cyan" },
                    { range: [250, 400], color: "royalblue" }
                ],
                threshold: {
                    line: { color: "red", width: 4 },
                    thickness: 0.75,
                    value: 9
                }
            }
        }];
        var layout = {
            width: 500,
            height: 400,
            margin: { t: 25, b: 25, l: 25, r: 25 },
            paper_bgcolor: "lavender",
            font: { color: "darkblue", family: "Arial" }
        };
        Plotly.newPlot("gauge", data, layout);
    });
}


//Bubble Chart
function buildCharts(sample) {
    d3.json("data/samples.json").then((data) => {
        var samples = data.samples;
        var filter = samples.filter(object => object.id.toString() === sample);
        var result = filter[0];
        var sample_values = result.sample_values;
        var ids = result.otu_ids;
        var labels = result.otu_labels;

        var trace1 = {
            x: ids,
            y: sample_values,
            text: labels,
            mode: 'markers',
            marker: {
                color: ids,
                size: sample_values,
                colorscale: "Electric"
            }
        };
        var data = [trace1];
        var layout = {
            title: 'Bacteria Cultures per Sample',
            showlegend: false,
            hovermode: 'closest',
            xaxis: { title: "OTU ID" + sample },
            margin: { t: 30 }
        };
        Plotly.newPlot("bubble", data, layout);

        //Bar Chart
        var trace1 = {
            x: sample_values.slice(0, 10).reverse(),
            y: ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            text: labels.slice(0, 10).reverse(),
            name: "Greek",
            type: "bar",
            orientation: "h"
        };
        var data = [trace1];
        var layout = {
            title: "Top 10 OTU for Individual<br> Test Subject ID№" + sample,
            margin: { l: 100, r: 100, t: 100, b: 100 }
        };
        Plotly.newPlot("bar", data, layout);

        //Pie Chart
        var trace1 = {
            labels: ids.slice(0, 10),
            values: sample_values.slice(0, 10),
            hovertext: labels.slice(0, 10),
            textinfo: "label+percent",
            type: "pie"
        };
        var data = [trace1];
        var layout = {
            autosize: false,
            height: 450,
            width: 450,
            margin: {
                t: 0,
                l: 0
            }
        };
        Plotly.newPlot("pie", data, layout);
    });
}



//Select the dropdown element
function init() {
    var selector = d3.select("#selDataset");
    d3.json("data/samples.json").then((data) => {
        var sampleNames = data.names;
        sampleNames.forEach((id) => {
            selector
                .append("option")
                .text(id)
                .property("value", id);
        });
        //Use the first sample from the list to build the initial plots
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}


function optionChanged(newSample) {
    buildCharts(newSample);
    buildMetadata(newSample);
}
init();