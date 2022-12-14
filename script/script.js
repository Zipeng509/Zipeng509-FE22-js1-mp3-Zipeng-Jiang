const rootUrl = "https://restcountries.com/v3.1/";
const contentElement = document.getElementById("content");
const formElement = document.getElementById("form");

//function som plocka ut de informationer som jag behöver från arrayen från server
function extractData(item) {
    return {
        name: item.name.common,
        subregion: item.subregion,
        capital: item.capital,
        population: item.population,
        flag: item.flags.png,
    }
}

async function searchByLanguage(text){
    //ge svar på text innehåll / skapar en anropp till servern och väntar på resultatet
    const response = await fetch(rootUrl + "lang/" + text + "?fullText=false", {
        method: "GET"
    })

    //väntar på json datan 
    const data = await response.json()

    //manipulerar data från servern
    const mapedData = data.map(extractData)
    return mapedData;

}

//sortera ut det landet som har mest i population
function sortItems(itemA, itemB) {
    if (itemA.population < itemB.population) {
        return 1
    }
    else if (itemA.population > itemB.population) {
        return -1
    }
    else {
        return 0
    }
}

function itemToHtmlStr(item) {
    return `
    <div class="item">
        <p class="name">
            <span class = "title">Name</span>: ${item.name}
        </p>
        <p class="subregion">
            <span class = "title">Subregion</span>: ${item.subregion}
        </p>
        <p class="capital">
        <span class = "title">Capital</span>: ${item.capital}
        </p>
        <p class="population">
        <span class = "title">Population</span>: ${item.population}
        </p>
        <p class="flag">
        <span class = "title">Flag:</span><img src="${item.flag}"> 
        </p>
    </div>
    `
}

formElement.addEventListener('submit', async event =>{
    event.preventDefault();
    const value = event.target[0].value;

    try {
                const data = await searchByLanguage(value);
                contentElement.innerHTML = 
                data
                .sort(sortItems)
                .map(itemToHtmlStr).join("")
            }
            catch {
                contentElement.innerHTML = `
                    <div class="error">
                        No languages found
                    </div>
                `
            }
})