function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var personData = data.samples;
     
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var matchResult = personData.filter(person => person.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = matchResult.sort((a,b) => b.sample_values - a.sample_values);
    
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
   
    var otuIds = result[0].otu_ids.slice(0,10);
    var otuText = "OTU"
    
    var otuidString = [];
  
    otuIds.forEach(addString);

    function addString(value, index) {
    otuidString[index] =  "OTU " + value;
        }
   
    var otuLabels = result[0].otu_labels.slice(0,10); 
        
    var sampleValues = result[0].sample_values.slice(0,10);
 
    var sortdsampleValues =  sampleValues.sort((a,b) => a - b);
   

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    
    var yticks = [otuidString];
   

    // 8. Create the trace for the bar chart. 
    var barData = [{type: 'bar', 
                    x: sortdsampleValues,
                    y: otuidString,
                    text: otuLabels,
                    orientation: 'h'
                  }];
                 
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100},
        yticks: yticks
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot(bar, barData,barLayout);

    // 1. Create the trace for the bubble chart.
    var bubblesampleValues = matchResult[0].sample_values;
    var bubbleotuIds = matchResult[0].otu_ids;
    var bubbleotuLabels = matchResult[0].otu_labels;
    
    var colorSize = [];
    bubbleotuIds.forEach(intString);
    function intString(value, index){
      colorSize[index] = bubbleotuIds[index].toString();
    }
  
  
    var bubbleData = [{type: 'bubble', 
                      x: matchResult[0].otu_ids,
                      y: matchResult[0].sample_values,
                      text: otuLabels,
                      mode: 'markers',
                      marker: {
                        size: matchResult[0].sample_values,
                        color: bubbleotuIds, 
                         colorscale: "Earth",
                      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Culture Per Sample',
      hovermode: 'closest',
      xaxis: {
        title: 'OTU ID',
        gridcolor: 'green',
        gridwidth: 1,
      },
  
      yaxis: {
          title: ' ',
          gridcolor: 'green',
          gridwidth: 1,
         }
       };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot(bubble, bubbleData,bubbleLayout);
  
  //     // 4. Create the trace for the gauge chart.
  
      var mData = data.metadata;
     
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var mtchResult = mData.filter(person => person.id == sample);   
    

      var gaugeData = [{
        domain: { x: [0, 1], y: [0, 1] },
        value: mtchResult[0].wfreq,
        title: { text: "Scrubs Per Week"},
        type: "indicator",
        mode: "gauge+number",
        gauge:{axis:{range:[0,10]},
        },
      }];
      
      // 5. Create the layout for the gauge chart.
      var gaugeLayout = { title: 
        "<b><br>Belly Button Washing Frequency</b>",
        width: 500, height: 500, margin: { t: 0, b: 0 }
      };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot(gauge, gaugeData,gaugeLayout);
  

  
  });
}  