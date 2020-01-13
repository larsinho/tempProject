$("#paper4").click(function() {
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
    fun_tvtp()
});

function fun_tvtp() {
$("#textParent").append(`<div> <h3 id="policyText">The value of turning-point detection for optimal investment </h3>
<h6> Lars Sendstad & Michail Chronopoulos</h6>
<p>Understanding the dynamic evolution of business cycles is key for investment in emerging technologies, especially, since these technologies are associated with periods of economic growth whose duration depends on disruptive innovations, market saturation and economic uncertainty. Furthermore, recessions are often accompanied by greater economic uncertainty, which further incentivises firms to postpone investment. We develop a regime-switching, real options model for investment under uncertainty that facilitates time-varying transition probabilities in order to capture the dynamic evolution of an economic indicator. Specifically, we consider a private firm with a perpetual option to invest in a production facility within a dynamically evolving regime-switching economic environment, and develop a numerical approach to approximate the value of the investment opportunity. Results indicate that, ignoring the dynamic evolution of transition probabilities can result in severe valuation errors. Indeed, we find that when the probability of a regime switch is initially low, the option value is greater (less) in the good (bad) regime under time-varying transition probabilities than under fixed transition probabilities. In contrast, when the probability is initially high, we find that the impact of the initial state is reduced, and also that incorrectly assuming fixed-transition probabilities leads to overvalued investment opportunities.
 </p>
`);
}
