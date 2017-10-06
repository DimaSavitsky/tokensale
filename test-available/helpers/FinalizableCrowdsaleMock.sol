pragma solidity ^0.4.15;


import 'zeppelin-solidity/contracts/crowdsale/FinalizableCrowdsale.sol';


contract FinalizableCrowdsaleMock is FinalizableCrowdsale {

  function FinalizableCrowdsaleMock (
    uint256 _startTime,
    uint256 _endTime,
    uint256 _rate,
    address _wallet
  ) public
    Crowdsale(_startTime, _endTime, _rate, _wallet)
    FinalizableCrowdsale() 
  {
  }

  function finalization() internal {
    token.finishMinting();
    super.finalization();
  }

}
