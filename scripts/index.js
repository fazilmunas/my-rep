// Update the amount text box with the correct value, and call other functions to ensure all values are updated.
var AmountChange = function() {
  $('#amount').val(a.getValue());
  updatePrinciple(a.getValue());
  updateSummary();
};

// Update the duration text box with the correct value, and call other functions to ensure all values are updated.
var DurationChange = function() {
  $('#duration').val(d.getValue());
  updateDuration(d.getValue());
  updateSummary();
};

// Initialise the amount slider.
var a = $('#how-much').slider()
  .on('slide', AmountChange)
  .data('slider');

// Initialise the duration slider.
var d = $('#how-long').slider()
  .on('slide', DurationChange)
  .data('slider');

// These are variables needed to help with the calculations and updates.
var $repaymentDate,
  $loanAmount,
  $loanInterest,
  $loanTotal,
  applicationPrinciple = 0,
  applicationDuration = 0;

var months = ['January','February','March','April','May','June','July','August','Septempber','October','November','December'],
    days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

$(function() {
  // Document ready
  initialiseVars();
  
  // Add a click event to the amount input to update the sliders and calculate the summary amounts when the principle changes.
  $('#amount').on('change', function() {
    updateSliders(true, false);
  });
  
  // Add a click event to the duration input to update the sliders and calculate the summary amounts when the duration changes.
  $('#duration').on('change', function() {
    updateSliders(false, true);
  });

  // Add a click event to the minus of amount to update the text box to the value in it plus 1. The Number function is used here to convert the value from a string to a number to ensure the operator can work on the value correctly.
  $('.edit-how-much .slider-plus').on('click', function() {
    $('#amount').val(Number($('#amount').val()) + 1);
    updateSliders(true, false);
  });
  
  // Add a click event to the minus of amount to update the text box to the value in it minus 1. The Number function is used here to convert the value from a string to a number to ensure the operator can work on the value correctly.
  $('.edit-how-much .slider-minus').on('click', function() {
    $('#amount').val(Number($('#amount').val()) - 1);
    updateSliders(true, false);
  });

  // Add a click event to the minus of duration to update the text box to the value in it plus 1. The Number function is used here to convert the value from a string to a number to ensure the operator can work on the value correctly.
  $('.edit-how-long .slider-plus').on('click', function() {
    $('#duration').val(Number($('#duration').val()) + 1);
    updateSliders(false, true);
  });
  
  // Add a click event to the minus of duration to update the text box to the value in it minus 1. The Number function is used here to convert the value from a string to a number to ensure the operator can work on the value correctly.
  $('.edit-how-long .slider-minus').on('click', function() {
    $('#duration').val(Number($('#duration').val()) - 1);
    updateSliders(false, true);
  });
});

// Update the slider positions, and ensure the other calculations are also done to update the loan amounts. The Number function is used here to convert the value from a string to a number to ensure the slider's setValue can work correctly (it doesn't understand strings).
updateSliders = function(principle, duration) {
  if (principle) {
    var value = $('#amount').val();
    a.setValue(Number(value), true);
    updatePrinciple(a.getValue());
    updateSummary();
  }
  if (duration) {
    var value = $('#duration').val();
    d.setValue(Number(value), true);
    updateDuration(d.getValue());
    updateSummary();
  }
}

// Give the variables initial values, and set the html elements to use later.
var initialiseVars = function() {
  $('#amount').val(100);
  $('#duration').val(13);
  updatePrinciple(100);
  updateDuration(13);

  var $parent = $('.loan-sliders');
  var $loanSummaryWrapper = $parent.find('.summary');
  $repaymentDate = $parent.find('.repayment-date');
  $loanAmount = $loanSummaryWrapper.find('.loan-amount');
  $loanInterest = $loanSummaryWrapper.find('.loan-interest');
  $loanTotal = $loanSummaryWrapper.find('.loan-total');
  updateSummary();
};

// Get the repayment date in a nicely displayed format.
var repaymentDate = function() {
  var repay = new Date();
  repay.setDate(repay.getDate() + applicationDuration);
  return days[repay.getDay()] + ' ' + repay.getDate() + ' ' + months[repay.getMonth()] + ' ' + repay.getFullYear();
}

// Make sure the applicationPrinciple var is up to date with the new value.
var updatePrinciple = function(newPrinciple) {
  if (newPrinciple !== applicationPrinciple) {
    applicationPrinciple = newPrinciple;
  }
};

// Make sure the applicationDuration var is up to date with the new value.
var updateDuration = function(newDuration) {
  if (newDuration !== applicationDuration) {
    applicationDuration = newDuration;
  }
  
  $('.repayment-date').html('Repayment date: ' + repaymentDate());
};

// Update the calculation figures.
var updateSummary = function() {
  var currencySign = "$";

  var pricingResult = calculateInterestDue(applicationPrinciple,
    applicationDuration);

  // If nothing is returned, just leave the function.
  if (pricingResult === null) {
    return;
  }

  // Use the returned array of prices to set the value of the html elements to the correct values.
  var loanTotal = pricingResult.totalToRepay;
  var loanFees = pricingResult.interestAndFees;

  $loanAmount.html(currencySign + applicationPrinciple);
  $loanTotal.html(currencySign + loanTotal);
  $loanInterest.html(currencySign + loanFees);
}

// Function to correctly calculate interest and fees related to borrowing amount and time.
calculateInterestDue = function(n, t) {
  // Function to get the correct amount, limited to 2 decimal points. By adding the principle to 1e-11, this gives many trailing 0s, and enables the function to return an accurate amount.
  function u(n) {
    return (((n + 1e-11) * 100 | 0) / 100).toFixed(2)
  }
  
  // Initialise the variables, and do checks to ensure correct calculations.
  var r;
  if (n <= 0 || t <= 0)
    return null;
  var i = 0,
    f = 2,
    e = n;
  
  // Do the calculation.
  // r is set to the interest via the calculation of principle * 0.008 * duration.
  // i and r are then set to the minimum of the variable on its own, or the principle multiplied by f minus the principle (and minus the fee, in the case or r).
  // Each amount is run through function "u" to give the amount correct to 2 decimal places.
  // These values are added to an array, which is returned to the calling function, enabling named properties to be used when calling the values.
  return !1 && (e = n + i), r = e * 0.008 * t, f !== null && (i = Math.min(i, n * f - n), r = Math.min(r, n * f - n - i)), {
    principal: u(n),
    duration: t,
    totalToRepay: u(n + i + r),
    interestAndFees: u(i + r),
    interest: u(r),
    fees: u(i)
  }
}