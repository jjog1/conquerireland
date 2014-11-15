/*
---- Author: Jago Gibbons
---- Version: 0.4
---- Date 02/06/2014

*/

var birthratecounter = 0;

var GatherFoodRatePerPerson = 1,
GatherWoodRatePerPerson = .5,
GatherStoneRatePerPerson = .2,
GatherIronRatePerPerson = .1;

var ConsumerFoodRatePerPerson = .65;

var FoodCounter = 0;
var WoodCounter = 0;
var StoneCounter = 0;
var IronCounter = 0;
var activeCounty = 0;

var DiscoveredCounties = ['Limrick','Kerry', 'Tipperary', 'Waterford'];
var NotificationBox = ["<div class='Positive'>Welcome to Conquer Ireland</div>"];

var Counties = [
	{
		Name: 'Cork',
		HumanControlled: true,
		Population:{
			UnassignedPeople:0 ,
			FoodPeople: 10,
			WoodPeople: 0,
			StonePeople: 0,
			IronPeople:0,
			BlacksmithPeople:0},
		Buildings:{
			Huts: 3,
			Houses: 0,
			Mansions: 0,
			Villages:0,
			Towns: 0,
			IronMines:0,
			Blacksmiths:0
			},
		Resources:{
			Food: 100,
			Wood: 0,
			Stone: 0,
			Iron: 0,
			Sword:0
			},
		Army:{
			Soldiers: 0,
			Knights: 0,
			Horsemen: 0
		},
		Neighbours: ['Limrick','Kerry', 'Tipperary', 'Waterford']
		
	},
	{
		Name: 'Dublin',
		HumanControlled: false,
		Population:{
			UnassignedPeople: 0,
			FoodPeople: 20,
			WoodPeople: 0,
			StonePeople: 0,
			IronPeople: 0,
			BlacksmithPeople:0},
		Buildings:{
			Huts: 5,
			Houses: 0,
			Mansions: 0,
			Villages: 0,
			Towns: 0,
			IronMines:0,
			Blacksmiths:0
			},
		Resources:{
			Food: 100,
			Wood: 0,
			Stone: 0,
			Iron:0,
			Swords:0
			},
		Army:{
			Soldiers: 0,
			Knights:0,
			Horsemen:0
		},
		Neighbours: ['Kildare','Louth', 'Meath', 'Wicklow']
	},
	{
		Name: 'Kerry',
		HumanControlled: false,
		Population:{
			UnassignedPeople: 0,
			FoodPeople: 10,
			WoodPeople: 0,
			StonePeople: 0,
			IronPeople: 0,
			BlacksmithPeople:0},
		Buildings:{
			Huts: 2,
			Houses: 0,
			Mansions: 0,
			Villages: 0,
			Towns: 0,
			IronMines:0,
			Blacksmiths:0
			},
		Resources:{
			Food: 100,
			Wood: 0,
			Stone: 0,
			Iron:0,
			Swords:0
			},
		Army:{
			Soldiers: 0,
			Knights:0,
			Horsemen:0
		},
		Neighbours: ['Kildare','Louth', 'Meath', 'Wicklow']
	}
];
var Hut = {
		UsageSlots: 5,
		Required:{
			Wood: 10,
			Stone: 0,
			Iron:0,
			Sword:0}
			},
	House = {
		UsageSlots: 20,
		Required:{
			Wood: 30,
			Stone: 0,
			Iron:0,
			Sword:0,
			Armor:0}
			},
	Mansion = {
		UsageSlots: 60,
		Required:{
			Wood:75,
			Stone:10,
			Iron: 0,
			Sword:0,
			Armor:0
			}},
	Village = {
		UsageSlots: 1000,
		Required:{
			Wood:1150,
			Stone:200,
			Iron:0,
			Sword:0,
			Armor:0
		}
		},
	Town = {
		UsageSlots: 10000,
		Required:{
			Wood:11300,
			Stone:1500,
			Iron:500,
			Sword:0,
			Armor:0
		}			
	},
	IronMine = {
		UsageSlots: 100,
		Required: {
			Wood: 50,
			Stone: 100,
			Iron:0,
			Sword:0,
			Armor:0
		}
	},	
	Blacksmith ={
		UsageSlots: 5,
		Required: {
			Wood: 20,
			Stone: 200,
			Iron: 0,
			Sword:0,
			Armor:0
		}
	},
	Sword ={
		Required:{
			Wood:10,
			Iron:3,
			Sword:0,
			Stone:0,
			Armor:0
		}
	},
	Armor ={
		Required:{
			Wood:30,
			Iron:5,
			Sword:0,
			Stone:0,
			Armor:0
			}
		},
	Soldier = {
		Required:{
			Sword: 1,
			Wood:0,
			Iron:0,
			Stone:0
			}
			},
	Knight = {
		Required:{
			Sword: 1,
			Armor: 1
			}
		}	
	Horseman = {
		Required: {
			Sword:1,
			Armor:1,
			Horse:1
			}
		}

function RefreshItems()
{
	birthratecounter ++;
	
	for(var county =0; county < Counties.length; ++county)
	{
	
	var consumedfood = ConsumerFoodRatePerPerson * PopulationCount(county);
	
	FoodCounter = GatherFoodRatePerPerson * Counties[county].Population.FoodPeople;
	WoodCounter = GatherWoodRatePerPerson * Counties[county].Population.WoodPeople;
	StoneCounter = GatherStoneRatePerPerson * Counties[county].Population.StonePeople;
	IronCounter = GatherIronRatePerPerson * Counties[county].Population.IronPeople;
	
	if(Counties[county].Resources.Food + FoodCounter < consumedfood)
	{
		Counties[county].Resources.Food = 0;
		var number = Math.round((consumedfood - (Counties[county].Resources.Food + FoodCounter))/ConsumerFoodRatePerPerson);
		KillWorkers(county, number);
	}
	else
	{
		Counties[county].Resources.Food = Math.round(100*(Counties[county].Resources.Food + FoodCounter - consumedfood))/100;
	}
	
	
	Counties[county].Resources.Wood = (Math.ceil((WoodCounter + Counties[county].Resources.Wood)*100))/100;
	Counties[county].Resources.Stone = (Math.ceil((StoneCounter + Counties[county].Resources.Stone)*100))/100;
	Counties[county].Resources.Iron = (Math.ceil((IronCounter + Counties[county].Resources.Iron)*100))/100;
	
	// Generate the number of swords to be created.
	var swordcost = Math.min((Counties[county].Resources.Wood/Sword.Required.Wood), (Counties[county].Resources.Iron/Sword.Required.Iron))
	if(swordcost < 1)
	{
		swordnumber = 0;
	}
	else
	{
		swordnumber = Math.round(Math.min(Counties[county].Population.BlacksmithPeople, swordcost));
	}
	Counties[county].Resources.Wood -= swordnumber * Sword.Required.Wood;
	Counties[county].Resources.Iron -= swordnumber * Sword.Required.Iron;
	Counties[county].Resources.Sword += swordnumber;
	
	if(birthratecounter == 30)
	{
		var newborns = Math.floor((Math.random() * (PopulationCount(county)/4))+1);
		if(PopulationCount(county) + newborns < MaxPopulation(county))
		{
			Counties[county].Population.UnassignedPeople += newborns;
			if(Counties[county].HumanControlled)
			{
				if(newborns > 0)
				{
					UpdateNotificationBox(Counties[county].Name + ": " + newborns + " babies were born", "Update");
				}
			}
		}
		else
		{
			newborns = MaxPopulation(county) - PopulationCount(county);
			Counties[county].Population.UnassignedPeople += newborns;
			
			if(Counties[county].HumanControlled)
			{
				if(newborns > 0)
				{
				UpdateNotificationBox(Counties[county].Name + ": " +newborns + " babies were born", "Update");
				UpdateNotificationBox(Counties[county].Name + ": " +"There is not enough living space for all the new babies.", "Warning");
				}
			}
		}	
	}
	}
	if(birthratecounter == 30)
	{
		birthratecounter = 0;
	}
	UpdateDisplay();
}

function UpdateNotificationBox(message, type)
{
	//document.getElementById("notificationbox").innerHTML += "\n" + message
	var newmessage = "<div class='" + type + "'>" + message + "</div>";
	
	NotificationBox.push(newmessage);
	
	if(NotificationBox.lenght > 20)
	{
		NotificationBox.shift();
	}
	document.getElementById("notificationbox").innerHTML = "";
	for( var index= 0; index < NotificationBox.length; ++index)
	{
		document.getElementById("notificationbox").innerHTML += NotificationBox[index];
	}
	var elem = document.getElementById('notificationbox');
	elem.scrollTop = elem.scrollHeight;
}

function HasResources(item, number, county)
{
	if( Counties[county].Resources.Iron >= item.Required.Iron * number
	&& Counties[county].Resources.Wood >= item.Required.Wood * number
	&& Counties[county].Resources.Stone >= item.Required.Stone * number
	&& Counties[county].Resources.Sword >= item.Required.Sword * number)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function RemoveResources(item, number, county)
{
	Counties[county].Resources.Iron -= item.Required.Iron * number;
	Counties[county].Resources.Stone -= item.Required.Stone * number;
	Counties[county].Resources.Wood -= item.Required.Wood * number;
	Counties[county].Resources.Sword -= item.Required.Sword * number;
}

function BuildBuilding(item, number, county)
{
	Counties[county].Resources.Iron -= item.Required.Iron * number;
	Counties[county].Resources.Stone -= item.Required.Stone * number;
	Counties[county].Resources.Wood -= item.Required.Wood * number;
}

function UpdateDisplay()
{
	document.getElementById("totalPopulation").innerHTML = PopulationCount(activeCounty);
	document.getElementById("maxPopulation").innerHTML = MaxPopulation(activeCounty);
	document.getElementById("unassignedpeople").innerHTML = Counties[activeCounty].Population.UnassignedPeople;
	
	//Food
	document.getElementById("food").innerHTML = Counties[activeCounty].Resources.Food;
	document.getElementById("assignedfood").innerHTML = Counties[activeCounty].Population.FoodPeople;
	//Wood
	document.getElementById("wood").innerHTML = Counties[activeCounty].Resources.Wood;
	document.getElementById("assignedwood").innerHTML = Counties[activeCounty].Population.WoodPeople;
	
	//Stone
	document.getElementById("stone").innerHTML = Counties[activeCounty].Resources.Stone;
	document.getElementById("assignedstone").innerHTML = Counties[activeCounty].Population.StonePeople;
	
	//Iron
	document.getElementById("iron").innerHTML = Counties[activeCounty].Resources.Iron;
	document.getElementById("assignediron").innerHTML = Counties[activeCounty].Population.IronPeople;
	
	//Blacksmith
	document.getElementById("assignedblacksmith").innerHTML = Counties[activeCounty].Population.BlacksmithPeople;
	document.getElementById("swords").innerHTML = Counties[activeCounty].Resources.Sword;
	document.getElementById("hutcount").innerHTML = Counties[activeCounty].Buildings.Huts;
	document.getElementById("housecount").innerHTML = Counties[activeCounty].Buildings.Houses;
	document.getElementById("mansioncount").innerHTML = Counties[activeCounty].Buildings.Mansions;
	document.getElementById("villagecount").innerHTML = Counties[activeCounty].Buildings.Villages;
	document.getElementById("towncount").innerHTML = Counties[activeCounty].Buildings.Towns;
	
	//Army
	document.getElementById("soldiercount").innerHTML = Counties[activeCounty].Army.Soldiers;
	
	if(Counties[activeCounty].Buildings.IronMines > 0)
	{	
		document.getElementById("resourceIron").className = ""; 
		document.getElementById("blacksmithrow").className = "";
		document.getElementById("blacksmithcount").innerHTML = Counties[activeCounty].Buildings.Blacksmiths;
		document.getElementById("resourceSword").className ="";
	} 
	else
	{	document.getElementById("resourceIron").className = "hidden";
		document.getElementById("blacksmithrow").className = "hidden";
	}
	
	if(Counties[activeCounty].Buildings.Blacksmiths > 0)
	{	
		document.getElementById("resourceBlacksmith").className = "";
		document.getElementById("Armies").className = "";
	}
	
	if(PopulationCount(activeCounty) > 50)
	{	document.getElementById("ironminerow").className = "";
		document.getElementById("ironminecount").innerHTML = Counties[activeCounty].Buildings.IronMines;
	}
	else
	{document.getElementById("ironminerow").className = "hidden";}
	
	if(PopulationCount(activeCounty) > 100)
	{	document.getElementById("mansionrow").className = "";}
	else
	{document.getElementById("mansionrow").className = "hidden";}
	
		if(PopulationCount(activeCounty) > 1000)
	{	document.getElementById("villagerow").className = "";}
	else
	{document.getElementById("villagerow").className = "hidden";}
	
	if(PopulationCount(activeCounty) > 5000)
	{	document.getElementById("townrow").className = "";}
	else
	{document.getElementById("townrow").className = "hidden";}
	
}

function CreateArmyActiveCounty(type, number)
{
	CreateArmy(activeCounty, type, number);
}

function CreateArmy(county, type, number)
{
	if(Counties[county].Population.UnassignedPeople >= number)
	{
		switch(type)
		{
			case 'soldier':
			{
				if(HasResources(Soldier, number, county))
				{
					Counties[county].Army.Soldiers += number;
					Counties[county].Population.UnassignedPeople -= number;
					RemoveResources(Soldier, number,county);
				}
				break;
			}
			case 'knight':
			{
				if(HasResources(Knight, number,county))
				{
					Counties[county].Army.Knights += number;
					Counties[county].Population.UnassignedPeople -= number;
					RemoveResources( Knights, number, county);
				}
				break;
			}
			case 'horseman':
			{
				if(HasResources(Horseman, number,county))
				{
					Counties[county].Army.Horsemen += number;
					Counties[county].Population.UnassignedPeople -= number;
					RemoveResources(Horseman, number, county);
				}
				break;
			}
		}
		UpdateDisplay();
	}
}

function RemoveArmyActiveCounty(type,number)
{
	RemoveArmy(activeCounty,type, number);
}

function RemoveArmy(county, type, number)
{
	switch(type)
	{
		case 'soldier':
		{
			if(Counties[county].Army.Soldiers >= number)
			{
				Counties[county].Army.Soldiers -= number;
				Counties[county].Population.UnassignedPeople += number;
			}
			break;
		}
		case 'knight':
		{
			if(Counties[county].Army.Knights >= number)
			{
				Counties[county].Army.Knights -= number;
				Counties[county].Population.UnassignedPeople += number;
			}
			break;
		}
		case 'horseman':
		{
			if(Counties[county].Army.Horsemen >= number)
			{
				Counties[county].Army.Horsemen -= number;
				Counties[county].Population.UnassignedPeople += number;
			}
			break;
		}
	}
	UpdateDisplay();
}

function AssignPersonActiveCounty(resource, number)
{
	AssignPerson(resource, activeCounty, number);
}

function UnassignPersonActiveCounty(resource, number)
{
	UnassignPerson(resource, activeCounty, number);
}

function AssignPerson(resource, county, number)
{
	if(Counties[county].Population.UnassignedPeople >= number)
	{
		switch(resource)
		{
			case 'food':
				Counties[county].Population.FoodPeople += number;
				break;
			case 'wood':
				Counties[county].Population.WoodPeople += number;
				break;
			case 'stone':
				Counties[county].Population.StonePeople += number;
				break;
			case 'iron':
				if(Counties[county].Population.IronPeople + number <= Counties[county].Buildings.IronMines * IronMine.UsageSlots)
				{
				Counties[county].Population.IronPeople += number;
				}
				else
				{
					return;
				}
				break;
			case 'blacksmith':
				if(Counties[county].Population.BlacksmithPeople + number <= MaxBlacksmiths(county))
				{
					Counties[county].Population.BlacksmithPeople += number;
				}
				else
				{
					return;
				}
				break;
			
		}
		Counties[county].Population.UnassignedPeople -= number;
		UpdateDisplay();
	}
}

function UnassignPerson(resource, county, number)
{
	switch(resource)
		{
			case 'food':
				if(Counties[county].Population.FoodPeople >= number)
				{			
					Counties[county].Population.FoodPeople -= number;
					Counties[county].Population.UnassignedPeople += number;
				}
				break;
			case 'wood':
				if(Counties[county].Population.WoodPeople >= number)
				{
					Counties[county].Population.WoodPeople -= number;
					Counties[county].Population.UnassignedPeople += number;
				}
				break;
			case 'stone':
				if(Counties[county].Population.StonePeople >= number)
				{
					Counties[county].Population.StonePeople -= number;
					Counties[county].Population.UnassignedPeople += number;
				}
				break;
			case 'iron':
				if(Counties[county].Population.IronPeople >= number)
				{
					Counties[county].Population.IronPeople -= number;
					Counties[county].Population.UnassignedPeople += number;
				}
				break;
			case 'blacksmith':
				if(Counties[county].Population.BlacksmithPeople >= number)
				{
					Counties[county].Population.BlacksmithPeople -= number;
					Counties[county].Population.UnassignedPeople += number;
				}
				break;
		}
		UpdateDisplay();
}

function BuildBuildingActiveCounty(type, number)
{
	BuildBuilding(type, number, activeCounty);
}

function BuildBuilding(type, number, county)
{	
switch(type)
	{
		case 'hut':
		if(HasResources(Hut, number, county))
		{
			Counties[county].Buildings.Huts += number;
			RemoveResources(Hut, number, county);
		}
		break;
		case 'house':
		if( HasResources(House, number, county))
		{
			Counties[county].Buildings.Houses += number;
			RemoveResources(House, number, county);
		}
		break;
		case 'mansion':
		if(HasResources(Mansion, number, county))
		{
			Counties[county].Buildings.Mansions += number;
			RemoveResources(Mansion, number, county);
		}
		break;
		case 'town':
		if(HasResources(Town, number, county))
		{
			Counties[county].Buildings.Towns += number;
			RemoveResources(Town, number, county);
		}
		break;
		case 'village':
		if(HasResources(Village, number, county))
		{
			Counties[county].Buildings.Villages += number;
			RemoveResources(Village, number, county);
		}
		break;
		case 'ironmine':
		if(HasResources(IronMine, number, county))
		{
			Counties[county].Buildings.IronMines += number;
			RemoveResources(IronMine, number, county);
		}
		break;
		case 'blacksmith':
		if(HasResources(Blacksmith, number, county))
		{
			Counties[county].Buildings.Blacksmiths += number;
			RemoveResources(Blacksmith, number, county);
		}
		break;
	}
	UpdateDisplay();
}

function CheckAchievments()
{

}

function MaxPopulation(x)
{
	return (Counties[x].Buildings.Huts * Hut.UsageSlots) + (Counties[x].Buildings.Houses * House.UsageSlots) +
		(Counties[x].Buildings.Mansions * Mansion.UsageSlots) + (Counties[x].Buildings.Villages * Village.UsageSlots) +
		(Counties[x].Buildings.Towns * Town.UsageSlots);
}

function PopulationCount(x)
{
	return Counties[x].Population.UnassignedPeople + Counties[x].Population.FoodPeople + Counties[x].Population.WoodPeople + Counties[x].Population.StonePeople
		+ Counties[x].Army.Soldiers + Counties[x].Army.Knights + Counties[x].Army.Horsemen;
}

function MaxBlacksmiths(county)
{
	return Counties[county].Buildings.Blacksmiths * Blacksmith.UsageSlots;
}

function KillWorkers(county, number)
{
	var killcount = 0;
	for(var i = 0; i < number; i++)
	{
		switch(Math.floor((Math.random() * 10)+1))
		{
			case 1:
			{
				if(Counties[county].Population.FoodPeople >= 1)
				{
				killcount ++;
				Counties[county].Population.FoodPeople -= 1;
				break;
				}
			}
			case 2:
			{
				if(Counties[county].Population.WoodPeople >= 1)
				{
				killcount ++;
				Counties[county].Population.WoodPeople -= 1;
				break;
				}
			}
			case 3:
			{
				if(Counties[county].Population.StonePeople >= 1)
				{
				killcount ++;
				Counties[county].Population.StonePeople -= 1;
				break;
				}
			}
			case 4:{
				if(Counties[county].Population.IronPeople >= 1)
				{
				killcount ++;
				Counties[county].Population.IronPeople -= 1;
				break;
				}
			}
			case 5:{
				if(Counties[county].Population.BlacksmithPeople >= 1)
				{
				killcount ++;
				Counties[county].Population.BlacksmithPeople -= 1;
				break;
				}
			}
			case 6:{
				if(Counties[county].Population.UnassignedPeople >= 1)
				{
				killcount ++;
				Counties[county].Population.UnassignedPeople -= 1;
				break;
				}
			}
		}
	}
	
	UpdateNotificationBox(Counties[county].Name + ": Food shortage! " + killcount + " dead!", "Warning");
}

function ActiveCounty(county)
{
	for (index = 0; index < Counties.length; ++index) {
		if(Counties[index].Name == county && Counties[index].HumanControlled)
		{
			activeCounty = index;
			break;
		}
	}
}

function ActivateRandomEvent()
{
	switch((Math.random()*10)+1)
	{
		case 1:
		{
			//plague
			break;
		}
		case 4:
		{
			break;
		}
		case 3:
		{
			//rat infestation
			break;
		}
		case 4:
		{
			//
		}
	}

}

function TotalArmy(x)
{
	return Counties[x].Army.Soldiers;
}

function Attack(county, attackingArmy)
{
	
}

function AttackCounty(atkCounty, army, defCounty)
{
	if(TotalArmy(atkCounty) > 0)
	{
		if(TotalArmy(defCounty) >0 )
		{
			
		}
		else
		{
			if(County[defCounty].PlayerControlled)
			{
			}
			else
			{
				//Player Take over County
				County[defCount].PlayerControlled = true;
				UpdateNotificationBox(County[atkCounty].Name + " has taken control of " + County[defCounty].Name, "Positive")
			}
		}
	}
}
var timer = setInterval(RefreshItems, 1000);