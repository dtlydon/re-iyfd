import React from "react";
import { Table } from "react-bootstrap";

const WINNERS = [
  {
    year: "2022",
    user: "(tie) Phil In Your Bracket, Eric Lutz, Steve F",
    team: "Kansas"
  },
  {
    year: "2021",
    user: "IYFD worker strike",
    team: "Baylor"
  },
  {
    year: "2020",
    user: "NO Tournament",
    team: "NO Tournament"
  },
  {
    year: "2019",
    user: "Allison852",
    team: "Virginia"
  },
  {
    year: "2018",
    user: "LWoods2",
    team: "Villanova"
  },
  {
    year: "2017",
    user: "Dan Lydon",
    team: "North Carolina"
  },
  {
    year: "2016",
    user: "KDog0217",
    team: "Villanova"
  },
  {
    year: "2015",
    user: "(tie) Jim Lydon, The Black Bros, Texas J-Hawk",
    team: "Duke"
  },
  {
    year: "2014",
    user: "Scott Barranco",
    team: "UCONN"
  },
  {
    year: "2013",
    user: "Lois Black",
    team: "Louisville"
  },
  {
    year: "2012",
    user: "Misty Lydon",
    team: "Kentucky"
  },
  {
    year: "2011",
    user: "Jefferson Reese",
    team: "UCONN"
  },
  {
    year: "2010",
    user: "(tie) Tyler Volluz, Veronica Holton",
    team: "Duke"
  },
  {
    year: "2009",
    user: "(tie) Jason Pastrano, John Millice",
    team: "N. Carolina"
  },
  {
    year: "2008",
    user: "(tie) Jim Lydon, Andy Jones, Jeff Robinson",
    team: "Kansas"
  },
  {
    year: "2007",
    user: "Gil Pappas",
    team: "Florida "
  },
  {
    year: "2006",
    user: "Ed Eckhart",
    team: "Florida"
  },
  {
    year: "2005",
    user: "Ed Eckhart",
    team: "N. Carolina "
  },
  {
    year: "2004",
    user: "Wayno Bueno",
    team: "UCONN"
  },
  {
    year: "2003",
    user: "Bob Dover",
    team: "Syracuse"
  },
  {
    year: "2002",
    user: "(tie) Big Bass Mama, Joe Hibbs",
    team: "Maryland"
  },
  {
    year: "2001",
    user: "Danny Lydon",
    team: "Duke"
  },
  {
    year: "2000",
    user: "(tie) Lisa Hughes, Byron Luke",
    team: "Mich. St."
  },
  {
    year: "1999",
    user: "Maggie Digneo",
    team: "UCONN"
  },
  {
    year: "1998",
    user: "(tie) Jim Cowan, Tom Landers",
    team: "Kentucky"
  },
  {
    year: "1997",
    user: "Mike Grogan",
    team: "Arizona"
  },
  {
    year: "1996",
    user: "Ed Eckhart",
    team: "Kentucky"
  },
  {
    year: "1995",
    user: "Jerry Gordon",
    team: "UCLA"
  },
  {
    year: "1994",
    user: "Marsha Lindsey",
    team: "Arkansas"
  },
  {
    year: "1993",
    user: "NO IYFD",
    team: ""
  },
  {
    year: "1992",
    user: "Rick Hainline",
    team: "Duke"
  },
  {
    year: "1991",
    user: "(tie) Brandon Parrott, Gene Regan",
    team: "Duke"
  },
  {
    year: "1990",
    user: "Marsha Lindsey",
    team: "UNLV "
  },
  {
    year: "1989",
    user: "Brad Parrott",
    team: "Michigan"
  },
  {
    year: "1988",
    user: "(tie) Brad Parrott, George Chaffee",
    team: "Kansas"
  },
  {
    year: "1987",
    user: "Bob Digneo",
    team: "Indiana"
  },
  {
    year: "1986",
    user: "Jamie Anderson",
    team: "Louisville "
  },
  {
    year: "1985",
    user: "Jeff Coy",
    team: "Villanova"
  },
  {
    year: "1984",
    user: "Gary Harrison",
    team: "Georgetown"
  },
  {
    year: "1983",
    user: "Jeff Coy",
    team: "NC State"
  },
  {
    year: "1982",
    user: "Larry Schnieders",
    team: "N. Carolina"
  },
  {
    year: "1981",
    user: "Jim Pottorf",
    team: "Indiana"
  }
];

const History: React.FC = () => (
  <div className="history">
    <h2>Hall of Fame</h2>
    <Table striped bordered hover className="mt-4">
      <thead>
        <tr>
          <th>Year</th>
          <th>Winner</th>
          <th>Winning Team</th>
        </tr>
      </thead>
      <tbody>
        {WINNERS.map((winner: any, index: number) => (
          <tr key={index}>
            <td>{winner.year}</td>
            <td>{winner.user}</td>
            <td>{winner.team}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
);

export default History;
