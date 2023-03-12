import React from "react";
import { useHistory } from 'react-router';
import logo from '../../assets/image2.jpeg'

const HomePage: React.FC = () => {
  const history = useHistory()

  return (
  <div className="home-page">
    <div className="text-center">
      <img src={logo} alt="Logo"/>
    </div>
    <h2 className="text-center">
      America’s Top Forty
    </h2>
    <h3>presents</h3>
    <h3>In-Your-Face-Disgrace 40</h3>
    <p>The Big 4 – 0.  Yes, this is the 40th edition of In-Your-Face-Disgrace, the March Madness prediction pool that has topped the Top 40 charts like nobody else.</p>
    <p>Our generous corporate sponsor this year is Casey Kasem’s A-T 40.</p>
    <h4>Get Started</h4>
    <p>Set your watch back to 1970.</p>
    <p>
      <b>Go to the Menu at the top of the page.</b>
      &nbsp;Create your account and password. You can enter more than one player.
      &nbsp;<b>You can play under an alias, such as Cool & the Gang, or maybe Green Day, or Pink, or even Bad Bunny.</b>
      &nbsp;Or just use your real moniker. Your choice.
    </p>
    <p><b>Be sure to click on the audio clip start button to hear the sponsor’s  announcement and the current leaderboard</b></p>
    <p><b>Use the Menu to CLICK on “Make Your Picks.”</b></p>
    <p>Select the winner of each NCAA Division I Men's Basketball Tournament game, one round at a time.  <b>Ignore</b> those silly “First Four” play-in games on Tuesday and Wednesday, March 14 and 15. </p>
    <p>Click on the icon for each team you predict will win each game.  Once each pick is recorded, you will get a confirmation.  That’s it!</p>
    <p><b>Deadlines for Your Picks</b> Remember, the games begin at 11 a.m. Central Time on Thursday March 16, 2023.</p>
    <p><b>Ignore the "First Four" games.</b></p>
    <h6><b>Round 1 picks are due before:</b> 11 a.m. on March 16 (Thursday)</h6>
    <h6><b>Round 2 picks are due before:</b> 11 a.m. on March 18 (Saturday) </h6>
    <h6><b>Sweet Sixteen picks are due  before:</b> 11 a.m. on March 23 (Thursday)</h6>
    <h6><b>Elite Eight picks are due before:</b> 11 a.m. on March 25 (Saturday)</h6>
    <h6><b>Final Four picks are due:</b> no later than 3 p.m. on Saturday, April 1 for the Semifinals and 3 p.m. on Monday, April 3 for the Championship Game.</h6>
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
    <p>Cash will be awarded to the top 7 finishers by <b>total points</b>, using the Official IYFD Sliding Scale Payout Formula 1 using quadratic equations with a smidge of calculus.    There are no tie-breakers.  Players who tie will share evenly the total payoff amounts for the respective places involved.  You get it.</p>
    <h5>Pay up by 3-20  – or face the music.</h5>
    <p>Your entry fee(s) are due by Monday, March 20.   The price is the same as always.... $10 per entry. </p>
    <p>Send your payment to:  <b>Gary Volluz      7309 Aemilian Way     Austin, Texas 78730</b>&nbsp;
      Or use PAYPAL by sending payment to LaurieJH@SWBELL.net  and please indicate you are sending money to friends and family, thus avoiding fees.  And put your IYFD player name in the “notes” section.
    </p>
    <h3>IYFD 40   -    Tune in and Win!</h3>
  </div>
  );
};

export default HomePage;
