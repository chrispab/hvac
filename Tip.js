function Tip() {
}

Tip.prototype.CalculateTip = function (p1) {
  // NEW
  const tipAmount = p1 * 0.20;
  return tipAmount;
};

module.exports.Tip = Tip;
