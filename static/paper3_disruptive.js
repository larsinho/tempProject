// General caclulations
//---------------------

$("#paper3").click(function() {
    // Removes element added in function if they exist
    if (document.contains(document.getElementById("sliderBody1"))) {
        document.getElementById("sliderBody1").remove();
    }
    if (document.contains(document.getElementById("sliderBody2"))) {
        document.getElementById("sliderBody2").remove();
    }
    if (document.contains(document.getElementById("graphsubParent"))) {
        document.getElementById("graphColumn").remove();
        document.getElementById("textParent").remove();
        $("#graphsubParent").append('<div id="textParent"></div>');
        $("#graphsubParent").append('<div id="graphColumn"></div>');

    }
    $("#textParent").append(`<div> <h3> Optimal Risk Adoption and Capacity Investment in Disruptive Innovations </h3>
      <h6> Lars Sendstad & Michail Chronopoulos</h6>
    <p> Disruptive innovations often formulate new market regimes and create incentives to abandon existing, less attractive ones. However, the decision to abandon an established market regime depends not only on market factors, such as economic and technological uncertainty, but also on attitudes towards risk. Although risk aversion typically raises the incentive to postpone (accelerate) investment (abandonment) by decreasing the expected utility of a project, the impact of risk aversion becomes more complex when a firm has discretion over both the time of investment and the size of a project within a regime-switching economic environment. Taking into account attitudes towards risk and the random arrival of innovations, we develop a utility-based, regime-switching framework for analysing  how a private firm may choose to initially invest in an existing market-regime and subsequently abandon it in order to enter a new one, when it has discretion over  investment timing and project scale.  Results indicate that increasing risk aversion and technological uncertainty hasten investment by decreasing the amount of installed capacity, and that the likely arrival of innovations may in fact reduce the relative loss in project value in the absence of managerial discretion over project scale. Also, we  show how the incentive to abandon an existing (new) regime may increase (decrease) depending on the sensitivity of a demand function to capacity expansion.
    </p>
    </div>
    `);
    //riskAverisonFunction(); // this function has nothing to do with this paper
});
// $('.list-group-item').on('click', function() {
//     var $this = $(this);
//     var $alias = $this.data('alias');
//
//     $('.active').removeClass('active');
//     $this.toggleClass('active')
//
// })

// Getting width of plotly column
var clientWidth = document.getElementById('graphColumn').clientWidth;



function riskAverisonFunction(GAMMA, Sigma) {

  $("#graphColumn").append('<div  id="sliderBody1">Risk aversion: <br /> </div>');
  $("#sliderBody1").append('<div class="sliders" id="slider1"></div>');
  $("#sliderBody1").append('<div class="valueBox" id="slider1Box"></div>');

  $("#graphColumn").append('<div " id="sliderBody2">Price uncertainty:  <br /> </div>');
  $("#sliderBody2").append('<div class="sliders" id="slider2"></div>');
  $("#sliderBody2").append('<div class="valueBox" id="slider2Box"></div>');

  var D1uBar = 7;
  var D2uBar = 13;
  var D1lBar = 9;
  var D2lBar = 20;
  var mu = 0.01;
  var Sigma = 0.2;
  var I1 = 500;
  var I2 = 1500;
  var rho = 0.08;
  var r = 0.08;
  var GAMMA = 0.8;
  var LAMBDA = 0.1;
  var Pt = [];
  // Create all the possible output prices
  for (var i = 0; i < 5000; i++) {
      Pt.push(i / 100);
  }
  var scriptSize = 17;


  // follower 12
  //---------------------

  function fun_Phi1F12_follow(GAMMA, Sigma) {
      var Phi2_follow = [];
      var F12_follow = [];

      var bb = (mu - 0.5 * Sigma ** 2);
      var beta1 = (-bb + (bb ** 2 + 2 * Sigma ** 2 * (rho)) ** 0.5) / (Sigma ** 2);
      var beta2 = (-bb - (bb ** 2 + 2 * Sigma ** 2 * (rho)) ** 0.5) / (Sigma ** 2);
      var scriptA = (beta1 * beta2) / (rho * (beta1 - GAMMA) * (beta2 - GAMMA));

      var delta1 = ((-bb + (bb ** 2 + 2 * Sigma ** 2 * (rho + LAMBDA)) ** 0.5) / (Sigma ** 2));
      var delta2 = ((-bb - (bb ** 2 + 2 * Sigma ** 2 * (rho + LAMBDA)) ** 0.5) / (Sigma ** 2));
      var scriptB = scriptA / (scriptA * LAMBDA + 1)

      function U(p) {
          return p ** GAMMA / GAMMA; // The function returns the product of p1 and p2
      }

      this.eps12_follow = r * I2 * ((beta2 - GAMMA) / (beta2 * (D2uBar ** GAMMA - D1uBar ** GAMMA))) ** (1 / GAMMA)
      A12_follow = (1 / this.eps12_follow) ** beta1 * (scriptA * U(this.eps12_follow) *
          (D2uBar ** GAMMA - D1uBar ** GAMMA) - U(r * I2) / (rho));


      function vfun_Phi2_follow(p) {
          return (scriptA * U(p * D2uBar) - U(r * I1) / rho - U(r * I2) / rho) // Value funciton follower after investment
      }

      function vfun_F12_follow(p) {
          return (scriptA * U(p * D1uBar) - U(r * I1) / rho + A12_follow * p ** beta1) //
      }

      for (i = 0; i < Pt.length; i++) {
          Phi2_follow[i] = vfun_Phi2_follow(Pt[i]);
      }
      for (i = 0; i < Pt.length; i++) {
          F12_follow[i] = vfun_F12_follow(Pt[i]);
      }
      return [Phi2_follow, F12_follow]
  }


  // ------------------------- Slider--------------------------//

  [Phi2_follow, F12_follow] = fun_Phi1F12_follow(1.0, 0.2)
  // My Plotly graph
  htmlElementAversion = document.getElementById('graphColumn');
  var layout = {
      width: clientWidth*1.1,
      height: clientWidth*1.2,
      paper_bgcolor: 'rgba(0,0,0,0.0)',
      plot_bgcolor: 'rgba(0,0,0,0.0)',
      xaxis: {
          title: 'Output price, E',
          size: scriptSize,
      },
      yaxis: {
          title: 'Project value',
          range: [-4000, 8000],
          size: scriptSize
      },
      font: {
          size: scriptSize,
          color: '#000000'
      },
      showlegend: true,
      legend: {
        orientation: 'h',
        traceorder: 'reversed',
        xanchor: 'center',
        y: 1.2
      },
      }

  var trace1 = {
      x: Pt,
      y: Phi2_follow,
  };


  Plotly.newPlot(htmlElementAversion, [trace1, trace1, trace1], layout, {
      showLink: false, displayModeBar: false
  });

  function lessthan_eps12_follow(element) {
      return element > this.eps12_follow;
  }

  async function sliderFunction(gamma, Sigma) {
      [Phi2_follow, F12_follow] = fun_Phi1F12_follow(gamma, Sigma)
      var idx = Pt.findIndex(lessthan_eps12_follow);

      Plotly.deleteTraces(htmlElementAversion, [0, 1, 2]);
      Plotly.addTraces(htmlElementAversion, [{
              x: Pt,
              y: Phi2_follow,
              name: "Project value",
              mode: 'lines',
              marker: {
                color: '#00bfff',
                size: 15
              },
          },
          {
              x: Pt,
              y: F12_follow.slice(0, idx),
              name: "Option value",
          },
          {
              x: [Pt[idx]],
              y: [F12_follow[idx]],
              mode: 'markers+text',
              marker: {
                color: 'rgb(255,255,0)',
                size: 8
              },
              name: 'Invest',
              text: ['Threshold', 'Leader'],
              textposition: 'top left',
              type: 'scatter'
          }
      ]);
      // My Plotly graph
  }

  // -------------------------------
  // Slider


  var initialValueAversion = 1;
  var initialValueVolatility = 0.2;

  var sliderTooltipAversion = function(event, ui) {
      var curValueAversion = ui.value || initialValueAversion;
      var vol = Number($('#slider2Box').text());
      $('#slider1Box').html(curValueAversion);
      sliderFunction(curValueAversion, vol);
  }

  var sliderTooltipVolatility = function(event, ui) {
      var curValueVolatility = ui.value || initialValueVolatility;;
      var aversion = Number($('#slider1Box').text());
      $('#slider2Box').html(curValueVolatility);
      sliderFunction(aversion, curValueVolatility);
  }

  $("#slider1").slider({
      value: initialValueAversion,
      min: 0.8,
      max: 1.2,
      step: 0.02,
      create: sliderTooltipAversion,
      slide: sliderTooltipAversion
  });

  $("#slider2").slider({
      value: initialValueVolatility,
      min: 0.1,
      max: 0.3,
      step: 0.02,
      create: sliderTooltipVolatility,
      slide: sliderTooltipVolatility
  });


  var idx = Pt.findIndex(lessthan_eps12_follow);



  Plotly.newPlot(htmlElementAversion, [{
              x: Pt,
              y: Phi2_follow,
              name: "Project value",
              mode: 'lines',
              marker: {
                color: '#00bfff',
                size: 15
              },
          },
          {
              x: Pt,
              y: F12_follow.slice(0, idx),
              name: "Option value"
          },
          {
              x: [Pt[idx]],
              y: [F12_follow[idx]],
              mode: 'markers+text',
              marker: {
                color: 'rgb(255,255,0)',
                size: 8
              },
              name: 'Investment',
              text: ['Investment threshold', 'Leader'],
              textposition: 'top left',
              type: 'scatter'
          }
      ],
      layout);
}
