// General caclulations
//---------------------
var scriptSize = 15

$("#paper2").click(function() {
  onRunFunction_paper2()
});

var onRunFunction_paper2 = function(){
// Removes element added in function if they exist
if (document.contains(document.getElementById("sliderBody1"))) {
    document.getElementById("sliderBody1").remove();
}
if (document.contains(document.getElementById("sliderBody2"))) {
    document.getElementById("sliderBody2").remove();
};
if (document.contains(document.getElementById("graphsubParent"))) {
    document.getElementById("graphColumn").remove();
    document.getElementById("textParent").remove();
    $("#graphsubParent").append('<div id="textParent"></div>');
    $("#graphsubParent").append('<div id="graphColumn"></div>');

};
$("#textParent").append(`<div> <h3> Strategic Technology Switching under Risk Aversion and Uncertainty </h3>
  <h6>
    Lars Sendstad & Michail Chronopoulos,
    <a class="text-primary"  href="https://ssrn.com/abstract=3035827">link  </a>
  </h6>
<p>
  Sequential investment opportunities or the presence of a rival typically hasten investment under risk neutrality.
  By contrast,  increasing economic uncertainty or risk aversion raise the incentive to postpone investment in the absence of competition.
  We analyse how economic and technological uncertainty, reflected in the random arrival of innovations,
  interact with attitudes towards risk to impact both the optimal technology adoption strategy and the optimal investment policy within each strategy,
  under a proprietary and a non-proprietary duopoly. Results indicate that technological uncertainty increases the follower's investment incentive
  yet delays the entry of the non-proprietary leader. Also, we show that  the proprietary leader's optimal investment policy is not affected by the
  likely arrival of an innovation, yet competition induces the proprietary leader  to adopt a new technology at a price
  threshold lower than in the case of monopoly.    Additionally, we show that the likely arrival of innovations decreases
  the relative loss in the value of the leader due to the follower's entry, while the corresponding impact of risk aversion is ambiguous.
  Interestingly, we also find that a higher first-mover advantage with respect to a new technology does not affect the leader's entry,
  and that technological uncertainty may turn a pre-emption game into a war of attrition, where the second-mover gets the higher payoff.
</p>

  <p>
  The graph below indicates the value functions under competition.
  Notice that, the follower and leader’s value functions meet at the follower's investment threshold.
  This is because, for high output prices, both companies will invest and they consequently share the market for higher output prices.
  Before the follower has entered the market, the leader enjoys monopoly profits (green line),
  and if the leader has proprietary rights over the technology, i.e. the follower cannot invest first, it is optimal for the leader to invest when her option value is equal to the project value.

  The sliders below the graph can be adjusted to investigate the impact of risk aversion and price uncertainty on the investment decision.
  A lower risk parameter implies higher risk aversion which reduces the attractiveness of the active project and leads to later investment. Also, greater price uncertainty
  increase the option value and the firm postpones the investment decision.
  </p>
    <p> The impact of the growth rate and the discount rate on the investment thresholds can be investigated via the 3d graph <a href="/competition" style="color: blue;">here</a>.</p>
</div>
`);
riskCompetitionFunction();
};

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



function riskCompetitionFunction() {

  $("#graphColumn").append('<div  id="sliderBody1">Risk parameter: <br /> </div>');
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
      var sigma = 0.2;
      var I1 = 500;
      var I2 = 1500;
      var rho = 0.08;
      var r = 0.08;
      var GAMMA = 1;
      var LAMBDA = 0.1;
      var Pt = [];
      // Create all the possible output prices
      for (var i = 0; i < 450; i++) {
          Pt.push(i / 10)
      }

      function fun_Phi1F12_follow(GAMMA, sigma) {
          var Phi2_follow = [];
          var F12_follow = [];

          var bb = (mu - 0.5 * sigma**2);
          var beta1 = (-bb + (bb ** 2 + 2 * sigma ** 2 * (rho)) ** 0.5) / (sigma ** 2);
          var beta2 = (-bb - (bb ** 2 + 2 * sigma ** 2 * (rho)) ** 0.5) / (sigma ** 2);
          var scriptA = (beta1 * beta2) / (rho * (beta1 - GAMMA) * (beta2 - GAMMA));

          var delta1 = ((-bb + (bb ** 2 + 2 * sigma ** 2 * (rho + LAMBDA)) ** 0.5) / (sigma ** 2));
          var delta2 = ((-bb - (bb ** 2 + 2 * sigma ** 2 * (rho + LAMBDA)) ** 0.5) / (sigma ** 2));
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

      function fun_Phi1F12_leader(sigma, GAMMA) {

          var Phi2_leader = []
          var F12_leader = []

          bb = (mu - 0.5 * sigma ** 2);
          beta1 = (-bb + (bb ** 2 + 2 * sigma ** 2 * (rho)) ** 0.5) / (sigma ** 2);
          beta2 = (-bb - (bb ** 2 + 2 * sigma ** 2 * (rho)) ** 0.5) / (sigma ** 2);
          scriptA = (beta1 * beta2) / (rho * (beta1 - GAMMA) * (beta2 - GAMMA));

          delta1 = ((-bb + (bb ** 2 + 2 * sigma ** 2 * (rho + LAMBDA)) ** 0.5) / (sigma ** 2));
          delta2 = ((-bb - (bb ** 2 + 2 * sigma ** 2 * (rho + LAMBDA)) ** 0.5) / (sigma ** 2));
          scriptB = scriptA / (scriptA * LAMBDA + 1)

          function U(p) {
              return p ** GAMMA / GAMMA; // The function returns the product of p1 and p2
          }

          [Phi2_follow, F12_follow] = fun_Phi1F12_follow(GAMMA, sigma)


          var A2_leader = (1 / this.eps12_follow) ** beta1 * (scriptA * U(this.eps12_follow) *
              (D2uBar ** GAMMA - D2lBar ** GAMMA))

          function vfun_Phi2_leader(p) {
              return (scriptA * U(p * D2lBar) - U(r * I1) / rho - U(r * I2) / rho + A2_leader * p ** beta1) // The function returns the product of p1 and p2
          }
          for (i = 0; i < Pt.length; i++) {
              Phi2_leader[i] = vfun_Phi2_leader(Pt[i]);
          }

          this.eps12_leader = r * I2 * ((beta2 - GAMMA) / (beta2 * (D2lBar ** GAMMA - D1uBar ** GAMMA))) ** (1 / GAMMA)
          var A12_leader = (1 / this.eps12_leader) ** beta1 * (scriptA * U(this.eps12_leader) * (D2lBar ** GAMMA - D1uBar ** GAMMA) - U(r * I2) / (rho) + A2_leader * this.eps12_leader ** beta1)

          function vfun_F12_leader(p) {
              return (scriptA * U(p * D1uBar) - U(r * I1) / rho + A12_leader * p ** beta1)
          }
          for (i = 0; i < Pt.length; i++) {
              F12_leader[i] = vfun_F12_leader(Pt[i]);
          }


          return [Phi2_follow, F12_follow, Phi2_leader, F12_leader]
      }


      // -------------------------------- PLOTTING ---------------------------------------------------------------//

      [Phi2_follow, F12_follow, Phi2_leader, Phi2_leader, F12_leader] = fun_Phi1F12_leader(1.0)

      htmlElementCompet = document.getElementById('graphColumn');
      var clientWidth = document.getElementById('graphColumn').clientWidth;

      var layout = {
          width: clientWidth*1.1,
          height: clientWidth * 0.75,
          paper_bgcolor: 'rgba(0,0,0,0.0)',
          plot_bgcolor: 'rgba(0,0,0,0.0)',
          xaxis: {
              title: 'Output price, E ',
              size: scriptSize
          },
          yaxis: {
              title: 'Project value',
              range: [-4000, 8000],
              size: scriptSize
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


      Plotly.newPlot(htmlElementCompet, [trace1, trace1, trace1, trace1, trace1], layout, {
          showLink: false, displayModeBar: false
      });

      function lessthan_eps12_follow(element) {
          return element > this.eps12_follow;
      }

      function lessthan_eps12_leader(element) {
          return element > this.eps12_leader;
      }

      async function sliderFunction_competition(sigma, GAMMA) {
          [Phi2_follow, F12_follow, Phi2_leader, F12_leader] = fun_Phi1F12_leader(sigma, GAMMA)
          var idx = Pt.findIndex(lessthan_eps12_follow);
          var idx_leader = Pt.findIndex(lessthan_eps12_leader);

          Plotly.deleteTraces(htmlElementCompet, [0, 1, 2, 3, 4]);
          Plotly.addTraces(htmlElementCompet, [{
                  x: Pt,
                  y: Phi2_follow,
                  name: "Follower, project value"
              },
              {
                  x: Pt,
                  y: F12_follow.slice(0, idx),
                  name: "Follower, option value"
              },
              {
                  x: Pt,
                  y: Phi2_leader.slice(0, idx),
                  name: "Leader, project value"
              },
              {
                  x: Pt,
                  y: F12_leader.slice(0, idx_leader),
                  name: "Leader, option value"
              },
              {
                  x: [Pt[idx], Pt[idx_leader]],
                  y: [F12_follow[idx], F12_leader[idx_leader]],
                  mode: 'markers+text',
                  name: 'Investment thresholds',
                  text: ['Follower', 'Leader'],
                  textposition: 'top left',
                  type: 'scatter'
              }
          ]);

      }

      // -------------------------------
      // Slider


      var initialValue = 1;

      var sliderTooltipPolicy = function(event, ui) {
          GAMMA = ui.value || GAMMA;
          $('#slider1Box').html(GAMMA);
          sliderFunction_competition(sigma, GAMMA);
      }

      var sliderTooltipVolatility = function(event, ui) {
          sigma = ui.value || sigma;;
          $('#slider2Box').html(sigma);
          sliderFunction_competition(sigma, GAMMA);
      }

      $("#slider1").slider({
          value: GAMMA,
          min: 0.8,
          max: 1.2,
          step: 0.01,
          create: sliderTooltipPolicy,
          slide: sliderTooltipPolicy
      });

      $("#slider2").slider({
          value: sigma,
          min: 0.1,
          max: 0.305,
          step: 0.01,
          create: sliderTooltipVolatility,
          slide: sliderTooltipVolatility
      });

      var idx = Pt.findIndex(lessthan_eps12_follow);
      var idx_leader = Pt.findIndex(lessthan_eps12_leader);

      // Plotly.newPlot(htmlElementCompet, [{
      //         x: Pt,
      //         y: Phi2_follow,
      //         name: "Follower state 2"
      //     },
      //     {
      //         x: Pt,
      //         y: F12_follow.slice(0, idx),
      //         name: "Follower state 12",
      //         visible: "legendonly"
      //     },
      //     {
      //         x: Pt,
      //         y: Phi2_leader.slice(0, idx),
      //         name: "Leader state 2",
      //         visible: "legendonly"
      //     },
      //     {
      //         x: Pt,
      //         y: F12_leader.slice(0, idx_leader),
      //         name: "Leader state 12",
      //         visible: "legendonly"
      //     },
      //     {
      //         x: [Pt[idx], Pt[idx_leader]],
      //         y: [F12_follow[idx], F12_leader[idx_leader]],
      //         mode: 'markers+text',
      //         name: 'Investment thresholds',
      //         text: ['Follower', 'Leader'],
      //         textposition: 'top left',
      //         type: 'scatter',
      //         visible: "legendonly"
      //     }
      // ], layout);

}
