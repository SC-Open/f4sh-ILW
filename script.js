const schedule = [
    {
        name: "Greycat & Aegis",
        timestamp: 1747324800,
        end: 1747497600,
        location: "Bevic Convention Center, Area 18",
        participants: "GREYCAT INDUSTRIAL, AEGIS DYNAMICS",
        limitedSales: "Aegis Idris-P, Aegis Javelin",
        waveTimestamps: [1747324800, 1747353600, 1747378800]
    },
    {
        name: "Origin, RSI & Argo",
        timestamp: 1747497600,
        end: 1747670400,
        location: "Bevic Convention Center, Area 18",
        participants: "ORIGIN JUMPWORKS, ROBERTS SPACE INDUSTRIES, ARGO ASTRONAUTICS",
        limitedSales: "RSI Constellation Phoenix",
        waveTimestamps: [1747497600, 1747526400, 1747551600]
    },
    {
        name: "Consolidated Outland, MISC & Mirai",
        timestamp: 1747670400,
        end: 1747843200,
        location: "Bevic Convention Center, Area 18",
        participants: "CONSOLIDATED OUTLAND, MISC, MIRAI"
    },
    {
        name: "Crusader & Tumbril",
        timestamp: 1747843200,
        end: 1748016000,
        location: "Bevic Convention Center, Area 18",
        participants: "CRUSADER INDUSTRIES, TUMBRIL LAND SYSTEMS"
    },
    {
        name: "Anvil Aerospace",
        timestamp: 1748016000,
        end: 1748188800,
        location: "Bevic Convention Center, Area 18",
        participants: "ANVIL AEROSPACE"
    },
    {
        name: "Drake Defensecon",
        timestamp: 1748188800,
        end: 1748260800,
        location: "Riker Memorial Spaceport, Area 18",
        participants: "DRAKE INTERPLANETARY",
        limitedSales: "Drake Kraken, Drake Kraken Privateer",
        waveTimestamps: [1748188800, 1748217600, 1748246400]
    },
    {
        name: "Invictus Finale",
        timestamp: 1748260800,
        end: 1748433600,
        location: "Riker Memorial Spaceport, Area 18"
    }
];

function populateTimeZones() {
    const timeZones = Intl.supportedValuesOf('timeZone');
    const selector = document.getElementById('timezone-selector');
    timeZones.forEach(zone => {
        const option = document.createElement('option');
        option.value = zone;
        option.textContent = zone;
        selector.appendChild(option);
    });
    selector.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
    document.getElementById('timezone-info').textContent = `Your timezone is ${selector.value} and the schedule is based on that.`;
}

function convertTimestampToLocaleString(timestamp, timeZone) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', { timeZone, hour12: true });
}

function getTimeLeft(timestamp, endTimestamp) {
    const now = new Date().getTime() / 1000;
    let timeUntilStart = timestamp - now;
    let timeUntilEnd = endTimestamp ? endTimestamp - now : null;

    return {
        text: calculateTimeLeft(Math.max(timeUntilStart, 0)),
        timeUntilEnd: timeUntilEnd ? calculateTimeLeft(timeUntilEnd) : null,
        isHappening: now >= timestamp && (!endTimestamp || now <= endTimestamp),
        hasPassed: endTimestamp ? now > endTimestamp : false
    };
}

function calculateTimeLeft(seconds) {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsLeft = Math.floor(seconds % 60);

    let timeLeftText;
    if (days > 0) {
        timeLeftText = `${days}d:${hours.toString().padStart(2, '0')}h:${minutes.toString().padStart(2, '0')}m`;
    } else {
        timeLeftText = `${hours.toString().padStart(2, '0')}h:${minutes.toString().padStart(2, '0')}m:${secondsLeft.toString().padStart(2, '0')}s`;
    }
    return timeLeftText;
}

function updateSchedule() {
    const now = new Date().getTime() / 1000;

    function getWaveStatus(waveTimestamp, nextWaveTimestamp) {
        if (now >= waveTimestamp && (nextWaveTimestamp === undefined || now < nextWaveTimestamp)) {
            return 'Started. Good Luck!';
        } else if (now < waveTimestamp) {
            return 'Upcoming';
        } else {
            return 'Passed';
        }
    }

    const selectedTimeZone = document.getElementById('timezone-selector').value;
    const scheduleContainer = document.getElementById('schedule');
    scheduleContainer.innerHTML = '';

    schedule.forEach((event, index) => {
        const nextEventTimestamp = (index < schedule.length - 1) ? schedule[index + 1].timestamp : null;
        const eventTimeLeft = getTimeLeft(event.timestamp, nextEventTimestamp, event.end);

        let eventHTML = `<div class="event${eventTimeLeft.hasPassed ? ' finished-event' : ''}">`;

        if (eventTimeLeft.isHappening) {
            eventHTML = `<div class="event event-active">`;
            const endTime = event.end ? event.end : event.timestamp + 48 * 3600;
            const timeLeftToEnd = endTime - (new Date().getTime() / 1000);

            let timeLeftText;
            if (timeLeftToEnd > 0) {
                timeLeftText = calculateTimeLeft(timeLeftToEnd);
            } else {
                timeLeftText = 'Finished';
            }

            eventHTML += `<div class="event-name happening-now">${event.name}<br><span class="location-small">Happening Now in ${event.location}</span><span class="time-left">${timeLeftText}</span></div>`;

        } else if (eventTimeLeft.hasPassed) {
            eventHTML += `<div class="event-name finished">${event.name} - Finished</div>`;
        } else {
            const diffInSeconds = event.timestamp - (new Date().getTime() / 1000);
            if (diffInSeconds > 0 && diffInSeconds <= 86400) {
                eventHTML += `<div class="event-name">${event.name}</div>
                          <div class="location">Event starting soon in: ${eventTimeLeft.text} at ${convertTimestampToLocaleString(event.timestamp, selectedTimeZone)} [${event.location}]</div>`;
            } else {
                eventHTML += `<div class="event-name">${event.name}</div>
                          <div class="location">${convertTimestampToLocaleString(event.timestamp, selectedTimeZone)} [${event.location}]</div>`;
            }
        }

        if (event.limitedSales) {
            let limitedSalesLinks = '';
            const sales = event.limitedSales.split(', ');
            sales.forEach(sale => {
                let link = '';
                switch (sale) {
                    case 'RSI Constellation Phoenix':
                        link = 'https://robertsspaceindustries.com/store/pledge/browse/extras/?search=phoenix&sort=weight&direction=desc';
                        break;
                    case 'Aegis Idris-P':
                        link = 'https://robertsspaceindustries.com/store/pledge/browse/extras/?search=idris&sort=weight&direction=desc';
                        break;
                    case 'Aegis Javelin':
                        link = 'https://robertsspaceindustries.com/store/pledge/browse/extras/?search=javelin&sort=weight&direction=desc';
                        break;
                    case 'Drake Kraken':
                    case 'Drake Kraken Privateer':
                        link = 'https://robertsspaceindustries.com/store/pledge/browse/extras/?search=kraken&sort=weight&direction=desc';
                        break;
                }
                limitedSalesLinks += `<a href="${link}" class="limited-sales-link" target="_blank">${sale}</a>, `;
            });
            limitedSalesLinks = limitedSalesLinks.slice(0, -2); // Remove the trailing comma and space

            eventHTML += `<div class="limited-sales">Limited Ship Sales: ${limitedSalesLinks}</div>`;
            let lastWaveStatus = '';
            event.waveTimestamps.forEach((waveTimestamp, waveIndex) => {
                const nextWaveTimestamp = (waveIndex < event.waveTimestamps.length - 1) ?
                    event.waveTimestamps[waveIndex + 1] :
                    (nextEventTimestamp ? nextEventTimestamp : Number.MAX_SAFE_INTEGER);
                const waveTimeLeft = getTimeLeft(waveTimestamp, nextWaveTimestamp);

                let waveStatus;
                if (waveTimeLeft.isHappening) {
                    waveStatus = `Wave ${waveIndex + 1}: <span class="wave-happening-now">Started. Good Luck!</span>`;
                    if (lastWaveStatus === 'Happening') {
                        eventHTML = eventHTML.replace(`Wave ${waveIndex}: <span class="wave-happening-now">Started. Good Luck!</span>`, `Wave ${waveIndex}: <span class="finished-wave">Passed</span>`);
                    }
                    lastWaveStatus = 'Happening';
                } else if (waveTimeLeft.hasPassed) {
                    waveStatus = `Wave ${waveIndex + 1}: <span class="finished-wave">Passed</span>`;
                    lastWaveStatus = 'Passed';
                } else {
                    waveStatus = `Wave ${waveIndex + 1}: ${waveTimeLeft.text}`;
                    lastWaveStatus = 'Upcoming';
                }

                eventHTML += `<div class="wave">${waveStatus}</div>`;
            });
        }

        eventHTML += `</div>`;
        scheduleContainer.innerHTML += eventHTML;
    });
}

window.onload = () => {
  populateTimeZones();
  updateSchedule();
  setInterval(updateSchedule, 1000);

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('action') === 'copyToDiscord') {
    copyToDiscord();
  }
};

function copyToDiscord() {
    const discordSchedule = `Invictus Launch Week 2955 Official Schedule:\n\n` +
        `**Greycat & Aegis:**\n<t:1747324800:f> [Bevic Convention Center, Area 18 <t:1747324800:R>]\nLimited Ship Sales: Aegis Idris-P, Aegis Javelin\nWave 1: <t:1747324800:T>, Wave 2: <t:1747353600:T>, Wave 3: <t:1747378800:T>\n\n` +
        `**Origin, RSI & Argo:**\n<t:1747497600:f> [Bevic Convention Center, Area 18 <t:1747497600:R>]\nLimited Ship Sales: RSI Constellation Phoenix\nWave 1: <t:1747497600:T>, Wave 2: <t:1747526400:T>, Wave 3: <t:1747551600:T>\n\n` +
        `**Consolidated Outland, MISC & Mirai:**\n<t:1747670400:f> [Bevic Convention Center, Area 18 <t:1747670400:R>]\n\n` +
        `**Crusader & Tumbril:**\n<t:1747843200:f> [Bevic Convention Center, Area 18 <t:1747843200:R>]\n\n` +
        `**Anvil Aerospace:**\n<t:1748016000:f> [Bevic Convention Center, Area 18 <t:1748016000:R>]\n\n` +
        `**Drake Defensecon:**\n<t:1748188800:f> [Riker Memorial Spaceport, Area 18 <t:1748188800:R>]\nLimited Ship Sales: Drake Kraken, Drake Kraken Privateer\nWave 1: <t:1748188800:T>, Wave 2: <t:1748217600:T>, Wave 3: <t:1748246400:T>\n\n` +
        `**Invictus Finale:**\n<t:1748260800:f> [Riker Memorial Spaceport, Area 18 <t:1748260800:R>]\nEnd of Invictus Launch Week 2955: <t:1748433600:f> [Riker Memorial Spaceport, Area 18 <t:1748433600:R>]`;

    navigator.clipboard.writeText(discordSchedule).then(() => {
        document.getElementById('copyToDiscordBtn').innerText = 'Copied schedule in Discord format';
    }, (err) => {
        console.error('Failed to copy text: ', err);
    });
}
