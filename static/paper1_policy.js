// General caclulations
//---------------------


$("#paper1").click(function() {
    // Removes element added in function if they exist
    if (document.contains(document.getElementById("sliderBody1"))) {
        document.getElementById("sliderBody1").remove();
    }
    if (document.contains(document.getElementById("sliderBody2"))) {
        document.getElementById("sliderBody2").remove();
    }
    if (document.contains(document.getElementById("graphColumn"))) {
        document.getElementById("graphColumn").remove();
        document.getElementById("textParent").remove();
        $("#graphsubParent").append('<div id="textParent"></div>');
        $("#graphsubParent").append('<div id="graphColumn"></div>');
    }
    policyFunction(sigma, lambdaP);
});
$('.list-group-item').on('click', function() {
    var $this = $(this);
    var $alias = $this.data('alias');

    $('.active').removeClass('active');
    $this.toggleClass('active')
})

var clientWidth = document.getElementById('graphColumn').clientWidth;
var Price
var vfun_Phi2
var vfun_F12
var eps12
var lambdaP = 0.25
var sigma = 0.20
var scriptSize = 15
policyFunction(sigma, lambdaP);

function policyFunction(sigma, lambdaP) {

    $("#graphColumn").append('<div id="sliderBody1">Policy uncertainty: <br /> </div>');
    $("#sliderBody1").append('<div class="sliders" id="slider1"></div>');
    $("#sliderBody1").append('<div class="valueBox" id="slider1Box"></div>');

    $("#graphColumn").append('<div id="sliderBody2">Price uncertainty:  <br /> </div>');
    $("#sliderBody2").append('<div class="sliders" id="slider2"></div>');
    $("#sliderBody2").append('<div class="valueBox" id="slider2Box"></div>');

    $("#textParent").append(`<div> <h3 id="policyText"> Sequential Investment in Emerging Technologies under  Policy Uncertainty </h3>
    <h6> Lars Sendstad & Michail Chronopoulos,
    <a class="text-primary" href="https://doi.org/10.1016/j.enpol.2019.111152 ">published in Energy Policy  </a>, <a class="text-primary" href="https://ssrn.com/abstract=2795475">working paper</a> and <a class="text-primary" href="http://www.sendstad.com/PresentationInvestExL2nd">presentation</a>
    </h6>
  <p> Investment in emerging technologies, such as renewable energy, is particularly challenging, since, apart from uncertainty in revenue streams, firms must also take into account both policy uncertainty and the random arrival of innovations. We assume that the former is reflected in the sudden provision and retraction of a support scheme, which takes the form of a fixed premium on top of the output price. Thus, we analyse how price, technological, and policy uncertainty interact to affect the decision to invest sequentially in successively improved versions of an emerging technology. We show that greater likelihood of subsidy retraction  lowers the incentive to invest, whereas greater likelihood of subsidy provision facilitates investment. However, embedded options to invest in improved technology versions raise the value of the investment opportunity, thereby  mitigating the impact of subsidy retraction and making the impact of subsidy provision more pronounced. Additionally, by allowing for sequential policy interventions, we find that the impact of policy uncertainty becomes less pronounced as the number of policy interventions increases. </p>

  <p>
    The graph below indicates the option value (orange line) and project value (blue line).
    At the investment threshold the firm forgoes the value of waiting by investing in the project.
    The sliders below the graph can be adjusted to investigate the impact of policy uncertainty and price uncertainty
    on the investment decision.
    Greater policy uncertainty implies a higher probability of a sudden subsidy retraction,
    which leads to later investment and lower project value. Also, greater price uncertainty
     increaes the option value and the firm postpones the investment decision.
  </p>
  </div>
  `);



    // ------------------------- Slider--------------------------//


    // My Plotly graph
    htmlElementPolicy = document.getElementById('graphColumn');
    var layout = {
        width: clientWidth * 1.0,
        height: clientWidth * 0.75,
        paper_bgcolor: 'rgba(0,0,0,0.0)',
        plot_bgcolor: 'rgba(0,0,0,0.0)',
        xaxis: {
            title: 'Output price, E',
            range: [0, 40],
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
        x: [0, 30],
        y: [10, 30],
    };
    Plotly.newPlot(htmlElementPolicy, [trace1, trace1, trace1], layout, {
        showLink: false,
        displayModeBar: false
    });




    function sliderFunction_policy(sigma, lambdaP) {
        // ajax the JSON to the server
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/blog/add/ajax",
            data: JSON.stringify({
                sigma: sigma,
                lambdaP: lambdaP
            }),
            success: function(data) {
                vfun_F12 = data.vfun_F12_retraction;
                vfun_Phi2 = data.vfun_Phi2_retraction;
                Price = data.Pt;
                eps12 = data.eps12_retraction;

                function lessthan_eps12_follow(element) {
                    return element > eps12;
                }
                var idx = Price.findIndex(lessthan_eps12_follow);
                plottingUpdate(sigma, lambdaP, idx)
            },
            dataType: "json"
        });

        async function plottingUpdate(sigma, lambdaP, idx) {
            Plotly.deleteTraces(htmlElementPolicy, [0, 1, 2]);
            Plotly.addTraces(htmlElementPolicy, [{
                    x: Price,
                    y: vfun_Phi2,
                    name: "Project value",
                    mode: 'lines',
                    marker: {
                        color: '#00bfff',
                        size: 15
                    },
                },
                {
                    x: Price,
                    y: vfun_F12.slice(0, idx),
                    name: "Option value",
                },
                {
                    x: [Price[idx]],
                    y: [vfun_F12[idx]],
                    mode: 'markers+text',
                    marker: {
                        color: 'rgb(255,255,0)',
                        size: 8
                    },
                    name: 'Invest',
                    text: ['Investment threshold', 'Leader'],
                    textposition: 'top left',
                    type: 'scatter'
                }
            ]);
            // My Plotly graph
        }
    };

    // -------------------------------
    // Slider

    var sliderTooltipPolicy = function(event, ui) {
        lambdaP = ui.value || lambdaP;
        $('#slider1Box').html(lambdaP);
        sliderFunction_policy(sigma, lambdaP);
    }

    var sliderTooltipVolatility = function(event, ui) {
        sigma = ui.value || sigma;;
        $('#slider2Box').html(sigma);
        sliderFunction_policy(sigma, lambdaP);
    }

    $("#slider1").slider({
        value: lambdaP,
        min: 0.00,
        max: 0.50,
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


}