// General caclulations
//---------------------
var scriptSize = 15
var clientWidth = document.getElementById('graphColumn').clientWidth;
var eps_follow_list = [];
var eps_leader_list = [];
var output;
var mus_3d = [];
var rs_3d = [];
var eps_follow_3d = [];
var eps_leader_3d = [];


$("#paper2").click(function() {
    onRunFunction_paper2()
});

var onRunFunction_paper2 = function() {
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
    riskCompetitionFunction();
};

onRunFunction_paper2()

// $('.list-group-item').on('click', function() {
//     var $this = $(this);
//     var $alias = $this.data('alias');
//
//     $('.active').removeClass('active');
//     $this.toggleClass('active')
//
// })

// Getting width of plotly column


function riskCompetitionFunction() {

    $("#graphColumn").append('<div  id="sliderBody1">Investment cost: <br /> </div>');
    $("#sliderBody1").append('<div class="sliders" id="slider1"></div>');
    $("#sliderBody1").append('<div class="valueBox" id="slider1Box"></div>');

    $("#graphColumn").append('<div " id="sliderBody2">Price uncertainty:  <br /> </div>');
    $("#sliderBody2").append('<div class="sliders" id="slider2"></div>');
    $("#sliderBody2").append('<div class="valueBox" id="slider2Box"></div>');


    var D1uBar = 7;
    var D2uBar = 18;
    var D1lBar = 9;
    var D2lBar = 20;
    //var mu = 0.01;
    var sigma = 0.2;
    var I1 = 500;
    var I2 = 1500;
    // var r = 0.08;
    var GAMMA = 1;
    var LAMBDA = 0.1;
    var Pt = [];
    var mus = [];
    var rs = [];
    // Create all the possible output prices
    for (var i = 0; i < 450; i++) {
        Pt.push(i / 10  )
    }
    for (var i = 0; i < 10; i++) {
        mus.push(i / 200)
    }
    for (var i = 0; i < 10; i++) {
        rs.push(i / 1000 + 0.05)
    }


    function fun_competition(I2, sigma, r, mu) {
        bb = (mu - 0.5 * sigma ** 2);
        beta1 = (-bb + (bb ** 2 + 2 * sigma ** 2 * (r)) ** 0.5) / (sigma ** 2);
        beta2 = (-bb - (bb ** 2 + 2 * sigma ** 2 * (r)) ** 0.5) / (sigma ** 2);
        scriptA = (beta1 * beta2) / (r * (beta1 - GAMMA) * (beta2 - GAMMA));

        function U(p) {
            return p ** GAMMA / GAMMA; // The function returns the product of p1 and p2
        }

        this.eps12_follow = r * I2 * ((beta2 - GAMMA) / (beta2 * (D2uBar ** GAMMA - D1uBar ** GAMMA))) ** (1 / GAMMA)
        A12_follow = (1 / this.eps12_follow) ** beta1 * (scriptA * U(this.eps12_follow) *
            (D2uBar ** GAMMA - D1uBar ** GAMMA) - U(r * I2) / (r));


        function vfun_Phi2_follow(p) {
            return (scriptA * U(p * D2uBar) - U(r * I1) / r - U(r * I2) / r) // Value funciton follower after investment
        }

        function vfun_F12_follow(p) {
            return (scriptA * U(p * D1uBar) - U(r * I1) / r + A12_follow * p ** beta1) //
        }


        var A2_leader = (1 / this.eps12_follow) ** beta1 * (scriptA * U(this.eps12_follow) *
            (D2uBar ** GAMMA - D2lBar ** GAMMA))

        function vfun_Phi2_leader(p) {
            return (scriptA * U(p * D2lBar) - U(r * I1) / r - U(r * I2) / r + A2_leader * p ** beta1) // The function returns the product of p1 and p2
        }
        // this.eps12_leader = r * I2 * ((beta2 - GAMMA) / (beta2 * (D2lBar ** GAMMA - D1uBar ** GAMMA))) ** (1 / GAMMA)

        var eps_preempt_leader;
        for (i = 0; i < Pt.length; i++) {
            if (vfun_Phi2_leader(Pt[i]) > vfun_F12_follow(Pt[i])) {
                eps_preempt_leader = Pt[i];
                break;
            }
        }
        //console.log(vfun_Phi2_leader(eps_preempt_leader), vfun_F12_follow(eps_preempt_leader))
        return [this.eps12_follow, eps_preempt_leader]
    }
    //console.log(fun_competition(sigma, r[1], mu[1]))
    function generate_3darray(I2, sigma) {
        rs_3d = [];
        mus_3d = [];
        eps_follow_3d = [];
        eps_leader_3d = [];
        var mylength = rs.length
        for (v = 0; v < mylength; v++) {
            eps_follow_list = [];
            eps_leader_list = [];
            for (j = 0; j < mylength; j++) {
                //console.log(rs );
                output = fun_competition(I2, sigma, rs[j], mus[v]);
                eps_follow_list.push(output[0]);
                eps_leader_list.push(output[1]);
            }
            rs_3d.push(Array(rs.length).fill(mus[v]));
            mus_3d.push(rs);
            eps_follow_3d.push(eps_follow_list);
            eps_leader_3d.push(eps_leader_list);
        }
    }
    generate_3darray(I2, sigma)
    // -------------------------------- PLOTTING ---------------------------------------------------------------//


    htmlElementCompet = document.getElementById('graphColumn');
    var clientWidth = document.getElementById('graphColumn').clientWidth;
    var clientHeight = $(window).height();;

    var data_z1 = {
        name: 'Follower',
        z: eps_follow_3d,
        y: rs_3d,
        x: mus_3d,
        type: 'surface',
        colorscale: 'Greens',
        showscale: false
    };
    var data_z2 = {
        name: 'Leader',
        z: eps_leader_3d,
        y: rs_3d,
        x: mus_3d,
        type: 'surface',
        colorscale: 'Reds',
        showscale: false
    };


    var layout = {
        width: clientWidth * 0.9,
        height: clientHeight * 0.75,
        scene: {
            xaxis: {
                title: 'Discount rate'
            },
            yaxis: {
                title: 'Growth rate'
            },
            zaxis: {
                title: 'Investment threshold',
                range: [5, 20]
            },
            aspectratio: {
                x: 1,
                y: 1,
                z: 1
            },
            camera: {
                center: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                eye: {
                    x: -1.5,
                    y: -1.5,
                    z: 1.5
                },
                up: {
                    x: 0,
                    y: 0,
                    z: 1
                }
            },
        },
        autosize: true,
        paper_bgcolor: 'rgba(0,0,0,0.0)',
        plot_bgcolor: 'rgba(0,0,0,0.0)',
        font: {
            color: "black"
        },
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0,
            pad: 0
        },
    };
    Plotly.newPlot('graphColumn', [data_z1, data_z2], layout);

    async function sliderFunction_competition(I2, sigma) {
        generate_3darray(I2, sigma) // the relevant variables will be overwritten
        var data_z1 = {
            name: 'Follower',
            z: eps_follow_3d,
            y: rs_3d,
            x: mus_3d,
            type: 'surface',
            colorscale: 'Greens',
            showscale: false
        };
        var data_z2 = {
            name: 'Leader',
            z: eps_leader_3d,
            y: rs_3d,
            x: mus_3d,
            type: 'surface',
            colorscale: 'Reds',
            showscale: false
        };

        //Plotly.deleteTraces('graphColumn', 0);
        //Plotly.update('graphColumn', [data_z1, data_z2], layout);
        //Plotly.deleteTraces(htmlElementCompet, [0, 1]);
        //Plotly.addTraces(htmlElementCompet, [data_z1, data_z2]

        Plotly.react('graphColumn', [data_z1, data_z2], layout);

    }

    // -------------------------------
    // Slider


    var initialValue = 1;

    var sliderTooltipPolicy = function(event, ui) {
        I2 = ui.value || I2;
        $('#slider1Box').html(I2);
        sliderFunction_competition(I2, sigma);
    }

    var sliderTooltipVolatility = function(event, ui) {
        sigma = ui.value || sigma;;
        $('#slider2Box').html(sigma);
        sliderFunction_competition(I2, sigma);
    }

    $("#slider1").slider({
        value: I2,
        min: 1000,
        max: 2000,
        step: 10,
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
