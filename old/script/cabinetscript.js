var fs = require('fs');
var cabinetRepeats = JSON.parse(fs.readFileSync('cabinet.json', 'utf8')),
    outputfile = 'cabinetrepeats.json';
var presidents = ["George Washington","John Adams","Thomas Jefferson","James Madison","James Monroe","John Quincy Adams","Andrew Jackson","Martin Van Buren","William Henry Harrison","John Tyler","James K. Polk","Zachary Taylor","Millard Fillmore","Franklin Pierce","James Buchanan","Abraham Lincoln","Andrew Johnson","Ulysses S. Grant","Rutherford B. Hayes","James A. Garfield","Chester A. Arthur","Grover Cleveland","Benjamin Harrison","Grover Cleveland","William McKinley","Theodore Roosevelt","William Howard Taft","Woodrow Wilson","Warren G. Harding","Calvin Coolidge","Herbert Hoover","Franklin D. Roosevelt","Harry S. Truman","Dwight D. Eisenhower","John F. Kennedy","Lyndon B. Johnson","Richard Nixon","Gerald Ford","Jimmy Carter","Ronald Reagan","George H. W. Bush","Bill Clinton","George W. Bush","Barack Obama"],
    cabinets = {};

var secretaryKey={sec000:"John Adams",sec001:"Thomas Jefferson",sec002:"Edmund Randolph",sec003:"Timothy Pickering",sec004:"Samuel Dexter",sec005:"James Madison",sec006:"Robert Smith",sec007:"James Monroe",sec008:"Richard Rush",sec009:"William Crawford",sec010:"John Quincy Adams",sec011:"John Calhoun",sec012:"Martin Van Buren",sec013:"Lewis Cass",sec014:"Louis McLane",sec015:"Roger Taney",sec016:"Levi Woodbury",sec017:"John Crittenden",sec018:"Thomas Ewing",sec019:"John Spencer",sec020:"John Tyler",sec021:"Abel Upshur",sec022:"Daniel Webster",sec023:"John Mason",sec024:"James Buchanan",sec025:"William Marcy",sec026:"Isaac Toucey",sec027:"Millard Fillmore",sec028:"Jeremiah Black",sec029:"Joseph Holt",sec030:"Edwin Stanton",sec031:"Andrew Johnson",sec032:"Hugh McCulloch",sec033:"William Evarts",sec034:"Alphonso Taft",sec035:"John Sherman",sec036:"Chester Arthur",sec037:"James Blaine",sec038:"William Windom",sec039:"Walter Gresham",sec040:"Grover Cleveland",sec041:"William Vilas",sec042:"Richard Olney",sec043:"Elihu Root",sec044:"Philander Knox",sec045:"Theodore Roosevelt",sec046:"William Moody",sec047:"George Cortelyou",sec048:"Victor Metcalf",sec049:"William Taft",sec050:"Charles Bonaparte",sec051:"George von Lengerke Meyer",sec052:"Henry Stimson",sec053:"David Houston",sec054:"Calvin Coolidge",sec055:"Charles Dawes",sec056:"Herbert Hoover",sec057:"Hubert Work",sec058:"Henry Wallace",sec059:"James Forrestal",sec060:"Harry Truman",sec061:"George Marshall",sec062:"Richard Nixon",sec063:"William Rogers",sec064:"Maurice Stans",sec065:"Christian Herter",sec066:"Lyndon Johnson",sec067:"Marvin Watson",sec068:"George Shultz",sec069:"Elliot Richardson",sec070:"William Ruckelshaus",sec071:"Rogers Morton",sec072:"Caspar Weinberger",sec073:"Frederick Dent",sec074:"Gerald Ford",sec075:"Alexander Haig",sec076:"James Lynn",sec077:"James Schlesinger",sec078:"Donald Rumsfeld",sec079:"Dick Cheney",sec080:"Carla Hills",sec081:"Patricia Harris",sec082:"James Baker",sec083:"Bill Brock",sec084:"George H W Bush",sec085:"Donald Regan",sec086:"Donald Hodel",sec087:"Elizabeth Dole",sec088:"Clayton Yeutter",sec089:"Samuel Skinner",sec090:"Andrew Card",sec091:"Madeleine Albright",sec092:"Mickey Kantor",sec093:"Leon Panetta",sec094:"Federico Pena",sec095:"Robert Rubin",sec096:"Laura Tyson",sec097:"William Daley",sec098:"Bill Richardson",sec099:"Jack Lew",sec100:"Norman Mineta",sec101:"Joshua Bolten",sec102:"Mike Leavitt",sec103:"Rob Portman",sec104:"Sylvia Mathews Burwell",sec105:"Shaun Donovan"};

for (var secretary in cabinetRepeats){
  cabinetRepeats[secretary].forEach(function(el,i){
    cabinets[ presidents[ el[1]-1 ] ] = cabinets[ presidents[ el[1]-1 ] ] || [];
    cabinets[ presidents[ el[1]-1 ] ].push([secretary,el[0]]);
  });
};

fs.writeFile(outputfile, JSON.stringify(cabinets),
  function(err) {
    if (err) { return console.log(err); }
    console.log("The file was saved as", outputfile);
  }
);
