const button = document.getElementById("search_button");
const apiKey = '5cc5003492f5910c52b6b360bc07ec65';
const finalizedInfos = [];
const meteoBlock = document.querySelector(".forecast-container");

/**
 * Click on form's button, ask API and generate city weather
 */
button.addEventListener("click", function (event) {
    event.preventDefault();

    const city = document.getElementById("city").value;
    if (city && city !== '') {

        const cityApi = parseInt(city);

        if (isNaN(cityApi)) {
            const API = `http://api.openweathermap.org/data/2.5/forecast?q=${city},fr&units=metric&appid=${apiKey}`;

            fetch(API).then(response => {
                if (response.status === 200) {
                    response.json().then(data => {
                        console.log(data);

                        //todo dom pour ajouter les jours sur la page.
                        //todo optimiser le block html et son remplissage via
                        //todo selecteurs et remplissage en js

                        let tab = getFiveInformations(data.list);
                        tab.forEach( infos => {
                           meteoBlock.innerHTML = `${meteoBlock.innerHTML} <div class="today forecast">
                                <div class="forecast-header">
                                <div class="day">${infos.jour}</div>
                            <div class="date">date</div>
                            </div>
                            <div class="forecast-content">
                                <div class="location" id="myCity">${changeMyWord(city, "M")}</div>
                            <div class="degree">
                                <div class="num" id="temperature">${infos.temperature}<sup>o</sup>C</div>
                            <div class="forecast-icon">
                                <img src="images/icons/icon-1.svg" alt="" width="50px">
                                </div>
                                </div>
                                <span><img src="images/icon-umberella.png" alt="">${infos.humidite}</span>
                            <span><img src="images/icon-wind.png" alt="">${infos.vitesseVent}</span>
                            <span><img src="images/icon-compass.png" alt="">Est</span>
                                </div>`
                        })
                        
                    }).catch(erreur => {
                        console.log("Erreur de datas");
                    });
                }
            }).catch(erreur => {
                console.log("Erreur de status");
            })
        } else {
            const API = `http://api.openweathermap.org/data/2.5/forecast?zip=${cityApi},fr&units=metric&appid=${apiKey}`;
            console.log("on fait le test via un code postal : " + cityApi);
        }

    } else {
        console.log("Erreur de type sur la ville " + typeof city);
    }
});

/**
 *
 * @param list
 * @returns {Array}
 */
function getFiveInformations(list) {
    let date1 = new Date(list[0].dt * 1000);

    finalizedInfos.splice(0,finalizedInfos.length);
    meteoBlock.innerHTML = "";

    list.forEach(dtlist => {
        let date2 = new Date(dtlist.dt * 1000);

        if (date1.getDate() !== date2.getDate()) {
            finalizedInfos.push({
                "jour": returnDayInFrench(date2.getDay()),
                "temperature": dtlist.main.temp,
                "humidite": dtlist.main.humidity,
                "temps": dtlist.weather[0].main,
                "vitesseVent": dtlist.wind.speed,
                "degresVent": dtlist.wind.deg
            });
        }
        date1 = new Date(dtlist.dt * 1000);
    });

    return finalizedInfos;
}

/**
 *
 * @param dayTransmitted
 * @returns {string}
 */
function returnDayInFrench(dayTransmitted) {
    const daysList = [
        "dimanche",
        "lundi",
        "mardi",
        "mercredi",
        "jeudi",
        "vendredi",
        "samedi"
    ];

    for (let key in daysList) {
        if (parseInt(key) === parseInt(dayTransmitted)) {
            return changeMyWord(daysList[key], "M");
        }
    }

    return "Erreur jour inconnu";
}

/**
 *
 * @param word
 * @param type
 * @returns {string}
 */
const changeMyWord = (word, type = "minuscule") => type === 'm' ? (word.charAt(0).toLowerCase() + word.slice(1)) : (word.charAt(0).toUpperCase() + word.slice(1));