import React from "react";
import { useHistory } from 'react-router';
import logo from '../../assets/image1.png'

const HomePage: React.FC = () => {
  const history = useHistory()

  return (
  <div className="home-page">
    <h2>
      <img src={logo} alt="Logo"/>&nbsp;
      Green Chile Chevrolet of NM
    </h2>
    <h3>presents</h3>
    <h3>In-Your-Face-Disgrace 39</h3>
    <p>Yes, this is the 39th edition of In-Your-Face-Disgrace, the March Madness prediction pool that leaves the rest eating dust.  Our generous sponsors this year are the fine folks at Green Chile Chevrolet of New Mexico, with dealerships in Tucumcari, Claunch, Hatch – and soon, Chimayo!</p>
    <h4>How to Play</h4>
    <ol>
      <li>-- Warm up your 402 horsepower bore-and-stroke engine.</li>
      <li>-- Select the winner of each NCAA Division I Men's Basketball Tournament game, one round at a time.
        <b>Ignore</b> those silly "First Four" play-in games on Tuesday and Wednesday, March 15 and 16.
      </li>
    </ol>
    <p>You can enter more than one player.  You can enter under an <b>alias</b> (examples:  The Hot Rod, To The Levee, V-8).  Or just use your <b>real moniker</b>.  Your choice.</p>
    <h5>First be sure to <button className="btn btn-primary" onClick={() => history.push('/account/register')}>Register</button></h5>
    <h5>Then be sure to click on the audio clip start button to hear the sponsor’s  announcement and the current leaderboard</h5>
    <h5>After that drive over to <button className="btn btn-primary" onClick={() => history.push('/play')}>Play</button></h5>
    <p>Click on the icon for each team you predict will win each game.  Once each pick is recorded, you will get a confirmation.  That’s it.</p>
    <h4>When to Make Your Picks</h4>
    <h5>The first games begin at 11 a.m. on Thursday March 17, 2022.  </h5>
    <h6>Round 1 picks are due before: 11 a.m. on March 17 (Thursday)</h6>
    <h6>Round 2 picks are due before: 11 a.m. on March 19 (Saturday) </h6>
    <h6>Sweet Sixteen picks are due  before: 11 a.m. on March 24 (Thursday)</h6>
    <h6>Elite Eight picks are due before: 11 a.m. on March 26 (Saturday)</h6>
    <h6>Final Four picks are due: no later than 3 p.m. on Saturday, April 2 for the Semifinals and 3 p.m. on Monday, April 4 for the Championship Game.</h6>
    <h4>Scoring</h4>
    <p><b>Each</b> correct pick will earn you: </p>
    <ul>
      <li>In Round One: One point </li>
      <li>In Round Two: Two points </li>
      <li>In the Sweet Sixteen: Three points </li>
      <li>In the Elite Eight:  Four points </li>
      <li>In the National Semifinal games:  Five points </li>
      <li>In the National Championship game:  Six points </li>
    </ul>
    <h4>Prize Money To the Top Seven</h4>
    <p>Cash will be awarded to the top 7 finishers by <b>total points</b>, using the Official IYFD Sliding Scale Payout Formula 1 via quadratic equations with a smidge of calculus.    There are no tie-breakers.  Players who tie will share evenly the total payoff amounts for the respective places involved.  You get it.</p>
    <h5>Pay up by 3-21  – or lose your license </h5>
    <p>Your entry fee(s) are due by Monday, March 21.   The price is the same as always.... $10 per entry. </p>
    <p>Send your payment to:  <b>Gary Volluz      7309 Aemilian Way     Austin, Texas 78730</b>
      Or use PAYPAL by sending payment to LaurieJH@SWBELL.net  and please indicate you are sending money to friends and family, thus avoiding fees.  And put your IYFD player name in the “notes” section.
    </p>
    <p>Ladies and Gents, Start Your Engines!</p>
  </div>
  );
};

export default HomePage;
